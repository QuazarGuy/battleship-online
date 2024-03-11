// https://blog.openreplay.com/building-a-chess-game-with-react/

import { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import Game from "./components/Game";

function App() {
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
      <ConnectionState isConnected={ isConnected } />
      <ConnectionManager />
      <Game player="Bob" opponent="Alice" room="1" orientation="0" />
    </>
  );
}

export default App;
