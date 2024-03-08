import { useMemo, useState } from "react";
import { Board } from "./Board";

function Game({ players, room, orientation, reset }) {
  const battleship = useMemo(() => new Battleship(), []);
  //   const [over, setOver] = useState("");
  const [turn, setTurn] = useState(0);

  function onDrop() {}

  function onMove() {}

  return;
  <>
    <Board
      id="opponentBoard"
      boardWidth={400}
      rows={5}
      cols={5}
      onMove={onMove}
    />
    <div style={{ height: 20 }} />
    <Board
      id="playerBoard"
      boardWidth={400}
      rows={5}
      cols={5}
      onMove={onMove}
    />
  </>;
}

export default Game;
