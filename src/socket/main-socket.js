const socketio = require('socket.io');
const dbSockets = require('./db-socket');

const createSocket = (server) => {
    const io = socketio(server);

    io.of('/data').on('connection', (socket) => {
        console.log('One user connected');

        // on joining a room and all the updated data should be send to specific 
        // rooms users
        socket.on('join-room', (roomInformation) => {
            const roomObject = JSON.parse(roomInformation);

            socket.join(roomObject.room);
            socket.emit('joined-room', 'successfully joined room');
        });

        const socketServer = {
            io,
            socket,
        };

        dbSockets(socketServer);
    });
};

module.exports = createSocket;
