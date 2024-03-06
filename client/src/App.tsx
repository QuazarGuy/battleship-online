import { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Board } from "./components/Board";

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
      <Board id="board" boardWidth={400} rows={5} cols={10} />
      <div style={{ height: 20 }} />
      <Board id="board2" boardWidth={400} rows={5} cols={10} />
    </>
  );
}

export default App;
