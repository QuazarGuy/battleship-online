// DONE add room and table support
// TODO add room cleanup
// TODO add account support

import express from "express";
import { Server } from "socket.io";
import { Game } from "./battleship";
import { v4 as uuidV4 } from "uuid";

const app = express();
const port = 3000;
const rooms = new Map();

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(4000);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("user " + socket.id + " connected");

  socket.on("username", (data) => {
    console.log("username:", data);
    socket.data.username = data;
  });

  socket.on("createRoom", async (callback) => {
    const roomId = uuidV4();
    await socket.join(roomId);

    rooms.set(roomId, {
      roomId,
      players: [
        { id: socket.id, username: socket.data?.username, orientation: "Axis" },
      ],
      game: new Game(),
    });

    rooms.get(roomId).game.addPlayer(socket.id, "Axis");

    callback(roomId);
  });

  socket.on("joinRoom", async (args, callback) => {
    // check if room exists and has a player waiting
    const room = rooms.get(args.roomId);
    let error, message;

    if (!room) {
      // if room does not exist
      error = true;
      message = "room does not exist";
    } else if (room.length <= 0) {
      // if room is empty set appropriate message
      error = true;
      message = "room is empty";
    } else if (room.length >= 2) {
      // if room is full
      error = true;
      message = "room is full"; // set message to 'room is full'
    }

    if (error) {
      // if there's an error, check if the client passed a callback,
      // call the callback (if it exists) with an error object and exit or
      // just exit if the callback is not given

      if (callback) {
        // if user passed a callback, call it with an error payload
        callback({
          error,
          message,
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
        {
          id: socket.id,
          username: socket.data?.username,
          orientation: "Allies",
        },
      ],
    };

    room.game.addPlayer(socket.id, "Allies");
    rooms.set(args.roomId, roomUpdate);

    callback(roomUpdate); // respond to the client with the room details.

    // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
    socket.to(args.roomId).emit("opponentJoined", roomUpdate);
  });

  socket.on("move", (data) => {
    const response = rooms
      .get(data.roomId)
      .game.move({ playerId: socket.id, target: data.target });
    socket.emit("move", response);
    if (!response.error) {
      const opponentResponse = {
        status: response.status,
        shipStatus: response.shipStatus,
        gameOver: response.gameOver,
        turn: response.turn,
        playerBoard: response.opponentBoard,
        opponentBoard: response.playerBoard,
      };
      socket.to(data.roomId).emit("move", opponentResponse);
    }
  });

  socket.on("setup", (data) => {
    console.log("setup: ", data);
    const response = rooms
      .get(data.roomId)
      .game.setup(socket.id, data.playerBoard, data.ships);
    console.log("setup response", response);
    socket.emit("setup", response);
    if (!response.error) {
      socket.to(data.roomId).emit("setup", response);
    }
  });

  socket.on("disconnect", () => {
    console.log("user " + socket.id + " disconnected");
  });

  // function responder(operation: string, data: object) {
  //   socket.emit(operation, data);
  // }
});
