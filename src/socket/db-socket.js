const CRUDObject = require('../models/crud.model');
const dbHandlers = require('./socket-handlers/db-handlers');
const connection = require('../db/mongoose-connection.db');

const dbSockets = (server) => {
    // on creating new document
    server.socket.on('post-data', (data) =>
        dbHandlers.postDocument(server, data)
    );

    // on updating data
    server.socket.on('update-data', (updatedData) =>
        dbHandlers.updateDocument(server, updatedData)
    );

    // on deleting data
    server.socket.on('delete-data', (documentInformation) =>
        dbHandlers.deleteDocument(server, documentInformation)
    );

    // on get data
    server.socket.on('get-data', (query) =>
        dbHandlers.getDocuments(server, query)
    );
};

module.exports = dbSockets;
