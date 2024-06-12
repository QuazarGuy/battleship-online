import express from "express";
import { Server } from "socket.io";
import { Game } from "./battleship";
import { v4 as uuidV4 } from "uuid";

const app = express();
const hostname = process.env.NODE_ENV === 'production' ? "https://battleship-online.azurewebsites.net" : "localhost";
const port = normalizePort(process.env.PORT || "3000");
const websocketPort = normalizePort(process.env.PORT || "4000");
if (!websocketPort || typeof(websocketPort) !== "number" || isNaN(websocketPort)) {
  throw new Error("Websocket port is not defined");
}
const rooms = new Map();

const io = new Server({
  cors: {
    origin: "*",
    // origin: `http://${hostname}:${port}`,
  },
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

io.listen(websocketPort);

app.use(express.static("../client/dist"));

app.listen(port, () => {
  return console.log(`Express is listening at http://${hostname}:${port}`);
});

io.on("connection", (socket) => {
  socket.on("username", (data) => {
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

  socket.on("getRooms", () => {
    let roomList = [];
    for (const room of rooms.values()) {
      if (room.players.length === 1) {
        roomList.push([room.roomId, room.players[0].username]);
      }
    }
    socket.emit("roomList", roomList);
  });

  socket.on("joinRoom", async (args, callback) => {
    const room = rooms.get(args.roomId);
    let error, message;

    if (!room) {
      error = true;
      message = "room does not exist";
    } else if (room.length <= 0) {
      error = true;
      message = "room is empty";
    } else if (room.length >= 2) {
      error = true;
      message = "room is full";
    }

    if (error) {
      if (callback) {
        callback({
          error,
          message,
        });
      }
      return;
    }

    await socket.join(args.roomId);
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
    callback(roomUpdate);
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
    const response = rooms
      .get(data.roomId)
      .game.setup(socket.id, data.playerBoard, data.ships);
    socket.emit("setup", response);
    if (!response.error) {
      socket.to(data.roomId).emit("setup", response);
    }
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data);

    const clientSockets = await io.in(data.roomId).fetchSockets();

    clientSockets.forEach((s) => {
      s.leave(data.roomId);
    });

    rooms.delete(data.roomId);
  });

  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values());

    // TODO: fix inefficient room management
    gameRooms.forEach((room) => {
      const userInRoom = room.players.find(
        (player: any) => player.id === socket.id
      );

      if (userInRoom) {
        if (room.players.length < 2) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }

        socket.to(room.roomId).emit("playerDisconnected", userInRoom);
      }
    });
  });
});
