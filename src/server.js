require('dotenv').config();
const PORT = process.env.PORT || 3000;

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());

server.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
