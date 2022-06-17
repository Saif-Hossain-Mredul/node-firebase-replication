const CRUDObject = require('../../models/crud.model');
const fetchData = require('../../utils/fetch-data.utils');

// creates new document
const postData = async (server, data) => {
    try {
        const object = new CRUDObject({ ...data });

        await object.save();
        const recentData = await fetchData();

        server.io.emit('recent-data', recentData);
    } catch (e) {
        server.socket.emit('error', {
            error: { status: 409, message: e.message },
        });
    }
};

// updates a document
const updateData = async (server, updatedData) => {
    try {
        const filter = { _id: updatedData.id };
        const updates = { ...updatedData.updates };
        const object = await CRUDObject.findOneAndUpdate(
            filter,
            { data: updates },
            {
                new: true,
            }
        );

        if (!object) throw new Error('Error updating document');

        const recentData = await fetchData();

        server.io.emit('recent-data', recentData);
    } catch (e) {
        server.socket.emit('error', {
            error: { status: 400, message: e.message },
        });
    }
};

// deletes a document
const deleteData = async (server, id) => {
    try {
        const object = await CRUDObject.findOneAndDelete({ _id: id });

        if (!object) throw new Error('Failed to delete data.');

        const recentData = await fetchData();

        server.io.emit('recent-data', recentData);
    } catch (e) {
        server.socket.emit('error', {
            error: { status: 404, message: e.message },
        });
    }
};

// fetches document and sends it
const getDocuments = async (server, skip) => {
    try {
        const recentData = await fetchData(skip);

        server.io.emit('recent-data', recentData);
    } catch (e) {
        server.socket.emit('error', {
            error: { status: 400, message: e.message },
        });
    }
};

module.exports = { postData, updateData, deleteData, getDocuments };