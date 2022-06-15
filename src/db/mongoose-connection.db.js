const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

const connection = mongoose.connect(connectionURL, () => {
    console.log('Connected to db');
});

module.exports = connection;
