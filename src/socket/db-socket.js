const dbHandlers = require('./socket-handlers/db-handlers');

const dbSockets = (server) => {
    // on joining a room and all the updated data should be send to specific
    // rooms users
    server.socket.on('join-room', (roomInformation) => {
        const roomObject = JSON.parse(roomInformation);

        server.socket.join(roomObject.room);
        server.socket.emit('joined-room', 'successfully joined room');
    });

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
