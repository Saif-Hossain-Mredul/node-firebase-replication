const mongoose = require('mongoose');
const waitForConnection = require('../../db/mongodb-connection.db');
const modifySearchResult = require('../../utils/modify-search-result');
const { ObjectId } = require('mongodb');
const OutgoingEvents = require('../../utils/events/outgoing-events');

// creates new document
const postDocument = async (server, data) => {
    try {
        console.log('postDocuments triggered');
        // Incoming data structure
        // {
        //     "data":{
        //        "name":"name",
        //        "roll":10,
        //        "age":10

        //        "extra field can be added in key value pair like above"
        //     },
        //     "collection":"data"
        // }

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const receivedObject = JSON.parse(data);
        const collection = receivedObject.collection;
        const dataObject = { data: receivedObject.data };
        dataObject.createdAt = new Date();
        dataObject.updatedAt = new Date();

        const object = await mongooseConnection.db
            .collection(collection)
            .insertOne(dataObject);

        /**
           whenever a new data is added to the database it is sent to the client
           not he whole data like before
         */

        server.io
            .of('/data')
            .in(collection)
            .emit(OutgoingEvents.NEW_OBJECT, {
                id: object.insertedId,
                ...dataObject,
            });
    } catch (e) {
        console.log(e.message);

        server.socket.emit(OutgoingEvents.ERROR, {
            error: { status: 409, message: e.message },
        });
    }
};

// updates a document
const updateDocument = async (server, updatedData) => {
    try {
        console.log('updateDocuments triggered');

        /**
         * Incoming data structure
         * Data must come in this pattern, otherwise error will be thrown
         * {
            "id":"62eeb352d6218a18b21c742f",
            "updates":{
               "name":"name",
               "roll":0,
               "age":0
            },
            "collection":"data"
        }*/

        const dataObject = JSON.parse(updatedData);

        const filter = { _id: ObjectId(dataObject.id) };
        const updates = { ...dataObject.updates };
        const collection = dataObject.collection;

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const updatedObject = await mongooseConnection.db
            .collection(collection)
            .findOneAndUpdate(
                filter,
                { $set: { data: updates } },
                {
                    returnDocument: 'after',
                }
            );

        if (!updatedObject.value) throw new Error('Error updating document');

        const object = {
            id: updatedObject.value._id,
            data: updatedObject.value.data,
        };

        // Upon updating the data, server sends only the updated data
        server.io
            .of('/data')
            .in(collection)
            .emit(OutgoingEvents.UPDATED_OBJECT, object);
    } catch (e) {
        console.log(e.message);

        server.socket.emit(OutgoingEvents.ERROR, {
            error: { status: 400, message: e.message },
        });
    }
};

// deletes a document
const deleteDocument = async (server, documentInformation) => {
    try {
        console.log('deleteDocuments triggered');
        /**
         * Incoming data structure
         * Data must come in this pattern, otherwise error will be thrown
         * {
            "id":"62eeb352d6218a18b21c742f",
            "collection":"data"
        }*/

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const informationObject = JSON.parse(documentInformation);
        const { id, collection } = informationObject;

        const object = await mongooseConnection.db
            .collection(collection)
            .findOneAndDelete({
                _id: ObjectId(id),
            });

        if (!object.value) throw new Error('Failed to delete data.');

        // Upon deleting server sends only the id of the deleted document, then
        // the document is removed from the offline client too
        server.io
            .of('/data')
            .in(collection)
            .emit(OutgoingEvents.DELETED_OBJECT, id);
    } catch (e) {
        console.log(e.message);

        server.socket.emit(OutgoingEvents.ERROR, {
            error: { status: 404, message: e.message },
        });
    }
};

// fetches document and sends it
const getDocuments = async (server, query) => {
    try {
        console.log('getDocuments triggered');
        /**
         * Incoming data structure
         * Data must come in this pattern, otherwise error will be thrown
         * {
            "skip":0,
            "collection":"data"
            }
        */

        const queryObject = JSON.parse(query);
        const { skip, collection } = queryObject;

        const mongooseConnection = await waitForConnection(mongoose.connection);
        let recentData = await mongooseConnection.db
            .collection(collection)
            .find()
            .skip(skip)
            .sort({ updatedAt: 1 })
            .limit(50)
            .toArray();

        recentData = modifySearchResult(recentData);

        server.socket.emit(OutgoingEvents.RECENT_DATA, recentData);
    } catch (e) {
        console.log(e.message);

        server.socket.emit(OutgoingEvents.ERROR, {
            error: { status: 400, message: e.message },
        });
    }
};

module.exports = {
    postDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
};
