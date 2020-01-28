const express = require('express');
const projectRouter = require('./routers/projectRouter');
const actionRouter = require("./routers/actionRouter");

const server = express();

server.get('/', (req, res) => {
    res.send(`Hello World! This is an API!`)
});

server.use(express.json());
server.use('/projects', projectRouter);
server.use('/actions', actionRouter);

module.exports = server;
