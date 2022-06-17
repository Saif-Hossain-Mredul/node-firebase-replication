const CRUDObject = require('../models/crud.model');
const dbHandlers = require('./socket-handlers/db-handlers')

const dbSockets = (server) => {
    // on creating new document
    server.socket.on('post-data', dbHandlers.postData(server, data));

    // on updating data
    server.socket.on('update-data', async (server, updatedData) => {
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
    });

    // on deleting data
    server.socket.on('delete-data', async (server, id) => {
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
    });

    // on get data
    server.socket.on('get-data', async (server, skip) => {
        try {
            const recentData = await fetchData(skip);

            server.io.emit('recent-data', recentData);
        } catch (e) {
            server.socket.emit('error', {
                error: { status: 400, message: e.message },
            });
        }
    });
};

const fetchData = async (skip) => {
    try {
        const recentData = await CRUDObject.find()
            .sort({ updatedAt: 'desc' })
            .skip(parseInt(skip))
            .limit(50);

        return recentData;
    } catch (e) {
        return e.message;
    }
};

module.exports = dbSockets;
