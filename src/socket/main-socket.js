const socketio = require('socket.io');
const dbSockets = require('./db-socket');

const createSocket = (server) => {
    const io = socketio(server);

    io.of('/data').on('connection', (socket) => {
        console.log('One user connected');

        const socketServer = {
            io,
            socket,
        };

        dbSockets(socketServer);
    });
};

module.exports = createSocket;
