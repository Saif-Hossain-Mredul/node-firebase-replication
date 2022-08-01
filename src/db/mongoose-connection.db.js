const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

getConnection = async () => {
    try {
        await mongoose.connect(connectionURL, {
            useNewUrlParser: true,
        });
        console.log('Connection to DB Successful');

        const mongooseConnection = await waitForConnection(mongoose.connection);

        const collections = await mongooseConnection.db
            .listCollections()
            .toArray();
        console.log(collections);

        return mongooseConnection;
    } catch (err) {
        console.log(err.message);
    }
};

const waitForConnection = (connection) => {
    return new Promise((resolve, reject) => {
        connection.on('open', resolve(mongoose.connection));
        connection.on('error', reject('Error connection to server'));
    });
};

const connection = getConnection();

module.exports = connection;
