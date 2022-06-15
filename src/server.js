require('dotenv').config();
require('./db/mongoose-connection.db');
const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/auth.router');
const crudRouter = require('./routes/crud.router');

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(authRouter);
app.use(crudRouter);

server.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
