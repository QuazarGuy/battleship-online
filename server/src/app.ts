import express from 'express';
import { Server } from 'socket.io';

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

  socket.on('foo', (data) => {
    console.log('foo', data);
  })

  socket.on('create-something', (data) => {
    console.log('create-something', data);
    socket.emit('foo', data)
  })

  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });
});