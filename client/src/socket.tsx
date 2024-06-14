import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = 'ws://localhost';
// env ? 'ws://battleship-online.azurewebsites.net' : 
// const URL = "http://192.168.1.3:4000";
// const PORT = normalizePort(process.env.PORT || "3000");

// function normalizePort(val: string) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

export const socket = io({ autoConnect: true });

// `${URL}:${PORT}`, 
