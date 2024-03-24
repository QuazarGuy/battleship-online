"use strict";
// TODO add room and table support
// TODO add account support
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
// import { Game, Player } from './battleship';
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
const rooms = new Map();
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
    socket.on('username', (data) => {
        console.log('username:', data);
        socket.data.username = data;
    });
    socket.on('createRoom', async (callback) => {
        const roomId = (0, uuid_1.v4)();
        await socket.join(roomId);
        rooms.set(roomId, {
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }]
        });
        callback(roomId);
    });
    socket.on('joinRoom', async (args, callback) => {
        // check if room exists and has a player waiting
        const room = rooms.get(args.roomId);
        let error, message;
        if (!room) { // if room does not exist
            error = true;
            message = 'room does not exist';
        }
        else if (room.length <= 0) { // if room is empty set appropriate message
            error = true;
            message = 'room is empty';
        }
        else if (room.length >= 2) { // if room is full
            error = true;
            message = 'room is full'; // set message to 'room is full'
        }
        if (error) {
            // if there's an error, check if the client passed a callback,
            // call the callback (if it exists) with an error object and exit or 
            // just exit if the callback is not given
            if (callback) { // if user passed a callback, call it with an error payload
                callback({
                    error,
                    message
                });
            }
            return; // exit
        }
        await socket.join(args.roomId); // make the joining client join the room
        // add the joining user's data to the list of players in the room
        const roomUpdate = {
            ...room,
            players: [
                ...room.players,
                { id: socket.id, username: socket.data?.username },
            ],
        };
        rooms.set(args.roomId, roomUpdate);
        callback(roomUpdate); // respond to the client with the room details.
        // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
        socket.to(args.roomId).emit('opponentJoined', roomUpdate);
    });
    // socket.on('move', (data) => {
    //   console.log('move:', data);
    //   game.move(data, responder);
    // });
    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
    });
    // function responder(operation: string, data: object) {
    //   socket.emit(operation, data);
    // }
});
