require('dotenv').config();
require('./db/mongoose-connection.db');
const PORT = process.env.PORT || 3000;

const cors = require('cors');
const authRouter = require('./routes/auth.router');
const createSocket = require('./socket/main-socket');

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use(authRouter);

createSocket(server);

app.get('*', (req, res) => {
    res.send('Invalid path.').status(404);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('Server started on port ' + PORT);
});
