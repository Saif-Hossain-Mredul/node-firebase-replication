const mongoose = require('mongoose');
const waitForConnection = require('../../db/mongodb-connection.db');
const modifySearchResult = require('../../utils/modify-search-result');
const { ObjectId } = require('mongodb');

// creates new document
const postDocument = async (server, data) => {
    try {
        console.log('postDocuments triggered');

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const receivedObject = JSON.parse(data);
        const collection = receivedObject.collection;
        const dataObject = { data: receivedObject.data };
        dataObject.createdAt = new Date();
        dataObject.updatedAt = new Date();

        const object = await mongooseConnection.db
            .collection('crudobjects')
            .insertOne(dataObject);

        // whenever a new data is added to the database it is sent to the client
        // not he whole data like before
        //
        // here two methods have been used because flutter client can not get
        // event passed through io.emit()
        //
        // passes data to all client except sender
        server.socket.broadcast
            .to(collection)
            .emit('new-object', { id: object.insertedId, ...dataObject });

        // passes data to sender only
        server.socket.emit('new-object', {
            id: object.insertedId,
            ...dataObject,
        });
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
            error: { status: 409, message: e.message },
        });
    }
};

// updates a document
const updateDocument = async (server, updatedData) => {
    try {
        console.log('updateDocuments triggered');

        const dataObject = JSON.parse(updatedData);

        const filter = { _id: ObjectId(dataObject.id) };
        const updates = { ...dataObject.updates };
        const collection = dataObject.collection;

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const updatedObject = await mongooseConnection.db
            .collection('crudobjects')
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

        // Upon updating the data, server sends only the data
        server.socket.broadcast.to(collection).emit('updated-object', object);
        server.socket.emit('updated-object', object);
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
            error: { status: 400, message: e.message },
        });
    }
};

// deletes a document
const deleteDocument = async (server, documentInformation) => {
    try {
        console.log('deleteDocuments triggered');

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const informationObject = JSON.parse(documentInformation);
        const { id, collection } = informationObject;

        const object = await mongooseConnection.db
            .collection('crudobjects')
            .findOneAndDelete({
                _id: ObjectId(id),
            });

        if (!object.value) throw new Error('Failed to delete data.');

        // Upon deleting server sends only the id of the deleted document, then
        // the document is removed from the offline client too
        server.socket.broadcast.to(collection).emit('deleted-object', id);
        server.socket.emit('deleted-object', id);
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
            error: { status: 404, message: e.message },
        });
    }
};

// fetches document and sends it
const getDocuments = async (server, query) => {
    try {
        console.log('getDocuments triggered');

        const queryObject = JSON.parse(query);
        const { skip, collection } = queryObject;

        const mongooseConnection = await waitForConnection(mongoose.connection);
        let recentData = await mongooseConnection.db
            .collection('crudobjects')
            .find()
            .skip(skip)
            .sort({ updatedAt: 1 })
            .limit(50)
            .toArray();

        recentData = modifySearchResult(recentData);

        server.socket.emit('recent-data', recentData);
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
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
