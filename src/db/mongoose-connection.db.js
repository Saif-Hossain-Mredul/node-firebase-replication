const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

getConnection = async () => {
    try {
        const connection = await mongoose.connect(connectionURL, {
            useNewUrlParser: true,
        });
        console.log('Connection to DB Successful');

        return connection;
    } catch (err) {
        console.log(err.message);
    }
};

const connection = getConnection();

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');

    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
    });

    // mongoose.connection.db.createCollection('one').then((value) => {
    //     console.log(value);
    // });
});

module.exports = connection;
