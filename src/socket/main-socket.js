const socketio = require('socket.io');
const dbSockets = require('./db-socket');

const createSocket = (server) => {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log('One user connected');

        const socketServer = {
            io,
            socket,
        };

        dbSockets(server);
    });
};

module.exports = createSocket;
