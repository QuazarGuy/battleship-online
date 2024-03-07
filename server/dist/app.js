"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const battleship_1 = require("./battleship");
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
    const game = new battleship_1.Game(new battleship_1.Player(socket.id), 5, 10);
    socket.on('move', (data) => {
        console.log('move', data);
        game.move(data, responder);
    });
    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
    });
    function responder(operation, data) {
        socket.emit(operation, data);
    }
});
