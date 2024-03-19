// https://blog.openreplay.com/building-a-chess-game-with-react/

import { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import Game from "./components/Game";
import CustomDialog from "./components/CustomDialog";
import { TextField } from "@mui/material";

function App() {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSumbitted] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("disconnected");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <CustomDialog
        open = {!usernameSubmitted}
        title = "Pick a username"
        contentText = "Please select a username"
        handleContinue = {() => {
          if (!username) return;
          console.log("username: ", username);
          socket.emit("username", username);
          setUsernameSumbitted(true);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)} // update username state with value
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>
      <ConnectionState isConnected={ isConnected } />
      {/* <ConnectionManager /> */}
      <Game player={username} opponent="Alice" />
    </>
  );
}

export default App;
