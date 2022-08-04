const socketHandlers = require('./socket-handlers/db-handlers');
const joinRoomHandler = require('../socket/socket-handlers/room-handlers');
const IncomingEvents = require('../utils/events/incoming-events');

const dbSockets = (server) => {
    // on joining a room and all the updated data should be send to specific
    // rooms users
    server.socket.on(IncomingEvents.JOIN_ROOM, (roomInformation) =>
        joinRoomHandler(server, roomInformation)
    );

    // on creating new document
    server.socket.on(IncomingEvents.POST_DATA, (data) =>
        socketHandlers.postDocument(server, data)
    );

    // on updating data
    server.socket.on(IncomingEvents.UPDATE_DATA, (updatedData) =>
        socketHandlers.updateDocument(server, updatedData)
    );

    // on deleting data
    server.socket.on(IncomingEvents.DELETE_DATA, (documentInformation) =>
        socketHandlers.deleteDocument(server, documentInformation)
    );

    // on get data
    server.socket.on(IncomingEvents.GET_DATA, (query) =>
        socketHandlers.getDocuments(server, query)
    );
};

module.exports = dbSockets;
