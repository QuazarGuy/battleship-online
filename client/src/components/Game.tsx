import { useCallback, useState } from "react";
import { Board } from "./Board";
import Battleship from "../models/Battleship";

// https://blog.openreplay.com/building-a-chess-game-with-react/

interface Props {
  player: string;
  opponent: string;
  // reset: () => void;
}

function Game({ player, opponent }: Props) {
  const [battleship, setBattleship] = useState(new Battleship());

  // Setting up the board with battleships
  function onDrop() {}

  function onMove(cellid: string): boolean {
    const moveData = {
      target: cellid,
      turn: battleship.getTurn(),
    }
    
    const move = makeAMove(moveData);

    return move !== null;
  }

  const makeAMove = useCallback(
    (moveData: {target: string, turn: string}) => {
      try {
        const result = battleship.move(moveData);
        battleship.setOpponentBoard(result);

        console.log("Victory!", battleship.isGameOver());

        setBattleship({ ...battleship });

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
        boardState={battleship.getOpponentBoard()}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
      <div style={{ height: 30 }}>{`${player}\'s Fleet`}</div>
      <Board
        id="playerBoard"
        boardState={battleship.getPlayerBoard()}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
    </>
  );
}

export default Game;
