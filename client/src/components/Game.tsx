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
      turn: battleship.turn,
    }
    
    const move = makeAMove(moveData);

    return move !== null;
  }

  const makeAMove = useCallback(
    (moveData: {target: string, turn: string}) => {
      try {
        const result = battleship.move(moveData);
        battleship.opponentBoard.map((row, rowIndex) => {
          return rowIndex === modifiedRowIndex ? [...row.slice(0, modifiedColIndex), newValue, ...row.slice(modifiedColIndex + 1)] : row;
        });

        console.log("Victory!", battleship.isGameOver());
        console.log(battleship);

        setBattleship(prevState => ({ ...prevState, opponentBoard: result }));

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
        boardState={battleship.opponentBoard}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
      <div style={{ height: 30 }}>{`${player}\'s Fleet`}</div>
      <Board
        id="playerBoard"
        boardState={battleship.playerBoard}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
    </>
  );
}

export default Game;
