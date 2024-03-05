"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = 3000;
const io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173"
    }
});
io.listen(4000);
app.get('/', (_, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
io.on('connection', (socket) => {
    console.log('user ' + socket.id + ' connected');
    socket.on('foo', (data) => {
        console.log('foo', data);
    });
    socket.on('create-something', (data) => {
        console.log('create-something', data);
        socket.emit('foo', data);
    });
    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
    });
});
