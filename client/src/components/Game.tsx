import { useCallback, useMemo, useState } from "react";
import { Board } from "./Board";
import { Battleship } from "../models/Battleship";

// https://blog.openreplay.com/building-a-chess-game-with-react/

interface Props {
  player: string;
  opponent: string;
  // reset: () => void;
}

function Game({ player, opponent }: Props) {
  const battleship = useMemo(() => new Battleship(), []);
  const [opponentBoard, setOpponentBoard] = useState(battleship.opponentBoard);
  const [playerBoard, setPlayerBoard] = useState(battleship.playerBoard);
  const [turn, setTurn] = useState("Axis");

  // Setting up the board with battleships
  function onDrop() {}

  function onMove(cellid: string): boolean {
    const moveData = {
      target: cellid,
      turn: battleship.turn,
    }
    
    const move = makeAMove(moveData);

    return move !== null;
  }

  const makeAMove = useCallback(
    (moveData: {target: string, turn: string}) => {
      try {
        const result = battleship.move(moveData);
        
        console.log("Victory!", battleship.isGameOver());

        setOpponentBoard(battleship.opponentBoard);

        return result;
      } catch (e) {
        return null;
      }
    },
    [battleship]
  )

  return (
    <>
      <div style={{ height: 30 }}>{`${opponent}\'s Fleet`}</div>
      <Board
        id="opponentBoard"
        boardState={opponentBoard}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
      <div style={{ height: 30 }}>{`${player}\'s Fleet`}</div>
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
