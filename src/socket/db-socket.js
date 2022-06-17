const dbSockets = (server) => {
    server.socket.on('post-data');
    server.socket.on('update-data');
    server.socket.on('delete-data');
    server.socket.on('get-data');
};

module.exports = dbSockets;
