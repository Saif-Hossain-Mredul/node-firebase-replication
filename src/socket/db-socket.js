const CRUDObject = require('../models/crud.model');

const dbSockets = (server) => {
    server.socket.on('post-data', async (server, data) => {
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
    });
    server.socket.on('update-data', (server, updatedData) => {});
    server.socket.on('delete-data', (server, id) => {});
    server.socket.on('get-data', (server, skip) => {});
};

const fetchData = async (skip) => {
    try {
        const recentData = await CRUDObject.find()
            .sort({ createdAt: 'desc' })
            .skip(parseInt(skip))
            .limit(50);

        return recentData;
    } catch (e) {
        return e.message;
        // res.status(400).send({ error: { status: 400, message: e.message } });
    }
};

module.exports = dbSockets;
