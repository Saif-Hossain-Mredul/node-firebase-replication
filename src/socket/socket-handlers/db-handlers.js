const CRUDObject = require('../../models/crud.model');
const fetchDataFromDatabase = require('../../utils/fetch-data.utils');

// creates new document
const postDocument = async (server, data) => {
    try {
        const dataObject = JSON.parse(data);
        const object = new CRUDObject({ ...dataObject });

        await object.save();
        const recentData = await fetchDataFromDatabase();

        console.log(recentData.length);

        server.socket.broadcast.emit('recent-data', recentData);
        server.socket.emit('recent-data', recentData);
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
        const dataObject = JSON.parse(updatedData);
        const filter = { _id: dataObject.id };
        const updates = { ...dataObject.updates };
        const object = await CRUDObject.findOneAndUpdate(
            filter,
            { data: updates },
            {
                new: true,
            }
        );

        if (!object) throw new Error('Error updating document');

        const recentData = await fetchDataFromDatabase();

        server.socket.broadcast.emit('recent-data', recentData);
        server.socket.emit('recent-data', recentData);
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
            error: { status: 400, message: e.message },
        });
    }
};

// deletes a document
const deleteDocument = async (server, id) => {
    try {
        const object = await CRUDObject.findOneAndDelete({ _id: id });

        if (!object) throw new Error('Failed to delete data.');

        const recentData = await fetchDataFromDatabase();

        server.socket.broadcast.emit('recent-data', recentData);
        server.socket.emit('recent-data', recentData);
    } catch (e) {
        console.log(e.message);

        server.socket.emit('error', {
            error: { status: 404, message: e.message },
        });
    }
};

// fetches document and sends it
const getDocuments = async (server, skip) => {
    try {
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
