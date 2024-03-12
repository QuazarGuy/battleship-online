import { useMemo, useState } from "react";
import { Board } from "./Board";
import Battleship from "../models/Battleship";

// https://blog.openreplay.com/building-a-chess-game-with-react/

interface Props {
  player: string;
  opponent: string;
  room: string;
  orientation: number;
  // reset: () => void;
}

function Game({ player, opponent, room, orientation }: Props) {
  const battleship = useMemo(() => new Battleship(), []);
  const [setupPhase, setSetupPhase] = useState(true);
  const [opponentState, setOpponentState] = useState(battleship.opponentBoard);
  const [playerState, setPlayerState] = useState(battleship.playerBoard);
  //   const [over, setOver] = useState("");
  const [turn, setTurn] = useState(0);

  // Setting up the board with battleships
  function onDrop() {}

  function onMove(cellid: string) {
    setOpponentState(battleship.move(cellid));
  }

  return;
  <>
    <Board
      id="opponentBoard"
      boardState={opponentState}
      boardWidth={400}
      rows={5}
      cols={5}
      onMove={onMove}
    />
    <div style={{ height: 20 }} />
    <Board
      id="playerBoard"
      boardState={playerState}
      boardWidth={400}
      rows={5}
      cols={5}
      onMove={onMove}
    />
  </>;
}

export default Game;
