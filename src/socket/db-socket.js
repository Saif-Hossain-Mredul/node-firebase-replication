const dbSockets = (server) => {
    server.socket.on('post-data', (server, data) => {});
    server.socket.on('update-data', (server, updatedData) => {});
    server.socket.on('delete-data', (server, id) => {});
    server.socket.on('get-data', (server, skip) => {});
};

module.exports = dbSockets;
