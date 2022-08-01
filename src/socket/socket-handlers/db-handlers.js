const CRUDObject = require('../../models/crud.model');
const fetchDataFromDatabase = require('../../utils/fetch-data.utils');

// creates new document
const postDocument = async (server, data) => {
    try {
        console.log('postDocuments triggered');

        const receivedObject = JSON.parse(data);
        const collection = receivedObject.collection;
        const dataObject = { data: receivedObject.data };

        const object = new CRUDObject({ ...dataObject });
        await object.save();

        // whenever a new data is added to the database it is sent to the client
        // not he whole data like before
        //
        // here two methods have been used because flutter client can not get
        // event passed through io.emit()
        //
        // passes data to all client except sender
        server.socket.broadcast.to(collection).emit('new-object', object);

        // passes data to sender only
        server.socket.emit('new-object', object);
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

        const filter = { _id: dataObject.id };
        const updates = { ...dataObject.updates };
        const collection = dataObject.collection;

        const object = await CRUDObject.findOneAndUpdate(
            filter,
            { data: updates },
            {
                new: true,
            }
        );

        if (!object) throw new Error('Error updating document');

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

        const informationObject = JSON.parse(documentInformation);
        const { id, collection } = informationObject;

        const object = await CRUDObject.findOneAndDelete({
            _id: id,
        });

        if (!object) throw new Error('Failed to delete data.');

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

        const recentData = await fetchDataFromDatabase(skip);

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
