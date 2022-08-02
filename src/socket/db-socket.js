const socketHandlers = require('./socket-handlers/db-handlers');
const joinRoomHandler = require('../socket/socket-handlers/room-handlers');

const dbSockets = (server) => {
    // on joining a room and all the updated data should be send to specific
    // rooms users
    server.socket.on('join-room', (roomInformation) =>
        joinRoomHandler(server, roomInformation)
    );

    // on creating new document
    server.socket.on('post-data', (data) =>
        socketHandlers.postDocument(server, data)
    );

    // on updating data
    server.socket.on('update-data', (updatedData) =>
        socketHandlers.updateDocument(server, updatedData)
    );

    // on deleting data
    server.socket.on('delete-data', (documentInformation) =>
        socketHandlers.deleteDocument(server, documentInformation)
    );

    // on get data
    server.socket.on('get-data', (query) =>
        socketHandlers.getDocuments(server, query)
    );
};

module.exports = dbSockets;
