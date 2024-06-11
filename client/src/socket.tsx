import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://battleship-online.azurewebsites.net' : 'http://localhost';
// const URL = "http://192.168.1.3:4000";
const PORT = 4000;

alert("url: " + URL + " port: " + PORT);

export const socket = io(`${URL}:${PORT}`, { autoConnect: true });
