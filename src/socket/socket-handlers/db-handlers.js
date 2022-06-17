const CRUDObject = require('../../models/crud.model');

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

module.exports = { postData };
