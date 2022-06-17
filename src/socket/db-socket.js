const CRUDObject = require('../models/crud.model');
const dbHandlers = require('./socket-handlers/db-handlers');

const dbSockets = (server) => {
    // on creating new document
    server.socket.on('post-data', dbHandlers.postData(server, data));

    // on updating data
    server.socket.on('update-data', dbHandlers.updateData(server, updatedData));

    // on deleting data
    server.socket.on('delete-data', dbHandlers.deleteData(server, id));

    // on get data
    server.socket.on('get-data', dbHandlers.getDocuments(server, skip));
};

module.exports = dbSockets;
