import { useCallback, useEffect, useMemo, useState } from "react";
import { Board } from "./Board";
import { Battleship } from "../models/Battleship";
import { socket } from "../socket";

// https://blog.openreplay.com/building-a-chess-game-with-react/

type Player = {
  username: string;
  orientation: string;
}

interface Props {
  room: string;
  orientation: string;
  username: string;
  players: Player[];
  cleanup: () => void;
}

function Game({ room, orientation, username, players, cleanup }: Props) {
  const battleship = useMemo(() => new Battleship(orientation), []);
  const [opponentBoard, setOpponentBoard] = useState(battleship.opponentBoard);
  const [playerBoard, setPlayerBoard] = useState(battleship.playerBoard);
  const [turn, setTurn] = useState("Axis");

  // Setting up the board with battleships
  function onDrop() {}

  function onMove(cellid: string) {
    if (battleship.isValidMove(cellid)) {
      socket.emit("move", {target: cellid, roomId: room});      
    }
  }

  const makeAMove = useCallback(
    (move: {status: string; turn: string, playerBoard: string[][], opponentBoard: string[][]}) => {
      try {
        // Set model state
        battleship.move(move);
        
        console.log("Victory!", battleship.isGameOver());

        setOpponentBoard(move.opponentBoard);
        setPlayerBoard(move.playerBoard);
        setTurn(move.turn);

        return move.status;
      } catch (e) {
        return null;
      }
    },
    [battleship]
  )

  useEffect(() => {
    socket.on("move", (move) => {
      if (move.error) {
        console.log("error", move.error);
        return;
      }
      console.log("received move", move);
      makeAMove(move);
    });
  }, [makeAMove]);

  return (
    <>
      <div style={{ height: 30 }}>Room: {room}</div>
      <div style={{ height: 30 }}>Turn: {turn}</div>
      <div style={{ height: 30 }}>{`${!players[1] ? "Waiting for opponent" : orientation === "Axis" ? players[1].username : players[0].username}\'s Fleet`}</div>
      <Board
        id="opponentBoard"
        boardState={opponentBoard}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
      <div style={{ height: 30 }}>{`${username}\'s Fleet`}</div>
      <Board
        id="playerBoard"
        boardState={playerBoard}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
    </>
  );
}

export default Game;
