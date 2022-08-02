module.exports = waitForConnection = (connection) => {
    return new Promise((resolve, reject) => {
        connection.on('open', resolve(connection));
        connection.on('error', reject('Error connection to server'));
    });
};
