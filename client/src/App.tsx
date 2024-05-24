// https://blog.openreplay.com/building-a-chess-game-with-react/

import { useState, useEffect, useCallback } from "react";
import { socket } from "./socket";
import Game from "./components/Game";
import CustomDialog from "./components/CustomDialog";
import { TextField } from "@mui/material";
import Lobby from "./components/Lobby";

function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSumbitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers([]);
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setPlayers(roomData.players);
    });
  }, []);

  return (
    <>
      <CustomDialog
        open={!usernameSubmitted}
        title="Pick a username"
        contentText="Please select a username"
        handleContinue={() => {
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
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          autoComplete="off"
        />
      </CustomDialog>
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          cleanup={cleanup}
        />
      ) : (
        <Lobby
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </>
  );
}

export default App;
