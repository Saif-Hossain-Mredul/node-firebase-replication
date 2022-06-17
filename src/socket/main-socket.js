const socketio = require('socket.io');

const createSocket = (server) => {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log('One user connected');
        
        const socketServer = {
            io,
            socket,
        };
    });
};

module.exports = createSocket;
