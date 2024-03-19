import { useCallback, useMemo, useState } from "react";
import { Board } from "./Board";
import Battleship from "../models/Battleship";

// https://blog.openreplay.com/building-a-chess-game-with-react/

interface Props {
  player: string;
  opponent: string;
  // reset: () => void;
}

function Game({ player, opponent }: Props) {
  const battleship = useMemo(() => new Battleship(), []);
  const [setupPhase, setSetupPhase] = useState(battleship.isSetupPhase());
  const [opponentState, setOpponentState] = useState(battleship.getOpponentBoard());
  const [playerState, setPlayerState] = useState(battleship.getPlayerBoard());
  const [over, setOver] = useState("");
  const [turn, setTurn] = useState(0);

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
        setOpponentState(battleship.getOpponentBoard());

        console.log("Victory!", battleship.isGameOver());

        if (battleship.isGameOver()) {
          setOver("Victory!");
        }

        return result;
      } catch (e) {
        return null;
      }
    },
    [battleship]
  )

  return (
    <>
      <div style={{ height: 30 }}>{`${opponent}\'s Fleet"`}</div>
      <Board
        id="opponentBoard"
        boardState={opponentState}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
      <div style={{ height: 30 }}>{`${player}\'s Fleet`}</div>
      <Board
        id="playerBoard"
        boardState={playerState}
        boardWidth={400}
        rows={5}
        cols={5}
        onMove={onMove}
      />
    </>
  );
}

export default Game;
