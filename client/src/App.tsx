import { useState, useEffect } from "react";
import { socket } from "./socket";
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
// import { Events } from "./components/Events";
// import { MyForm } from './components/MyForm';
import { Board } from "./components/Board";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      socket.emit("foo", "bar");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("disconnected");
      socket.emit("foo", "bar");
      setIsConnected(false);
    }

    function onFooEvent(value: string) {
      console.log("foo", value);
      socket.emit("foo", value);
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <>
      {/* <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm /> */}
      <Board id="board" boardWidth={400} rows={5} cols={10} />
      <div style={{ height: 20 }} />
      <Board id="board2" boardWidth={400} rows={5} cols={10} />
    </>
  );
}

export default App;
