module.exports = joinRoomHandler = (server, roomInformation) => {
    const roomObject = JSON.parse(roomInformation);

    server.socket.join(roomObject.room);
    server.socket.emit('joined-room', 'successfully joined room');
};
