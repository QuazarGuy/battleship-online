// TODO add room and table support
// TODO add account support

import express from 'express';
import { Server } from 'socket.io';
import { Game, Player } from './battleship';

const app = express();
const port = 3000;

const io = new Server({
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
  const game = new Game(new Player(socket.id), 5, 10);

  socket.on('username', (data) => {
    console.log('username:', data);
    socket.data.username = data;
  })

  socket.on('move', (data) => {
    console.log('move:', data);
    game.move(data, responder);
  })

  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });

  function responder(operation: string, data: object) {
    socket.emit(operation, data);
  }
});