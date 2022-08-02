const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

getConnection = async () => {
    try {
        mongoose.connect(connectionURL, {
            useNewUrlParser: true,
        });
        console.log('Connection to DB Successful');
    } catch (err) {
        console.log(err.message);
    }
};

getConnection();
