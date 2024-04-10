This is a project to build a React-based website that implements the board game of Battleship.

Requirements:
- Nodejs

Installation:
1. Run npm install in the base directory and server and client directories

Running:
1. Can be played locally by running "npm run start" in the base directory

1. To run over the local network, the local IP address will need to be replaced in "/server/src/app.ts" and "/client/src/socket.tsx"
2. Build the client, run "npm run build" in the client directory
3. Run "npm run start" in the base directory

Notes:
I followed this chess tutorial, https://blog.openreplay.com/building-a-chess-game-with-react/. However, I had to implement the Battleship game play and UI myself.
