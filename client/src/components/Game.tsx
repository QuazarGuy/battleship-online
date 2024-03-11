import { useMemo, useState } from "react";
import { Board } from "./Board";
import Battleship from "../models/Battleship";

// https://blog.openreplay.com/building-a-chess-game-with-react/

interface Props {
  player: string;
  opponent: string;
  room: string;
  orientation: string;
  // reset: () => void;
}

function Game({ player, opponent, room, orientation }: Props) {
  const battleship = useMemo(() => new Battleship(), []);
  const [opponentState, setOpponentState] = useState(battleship.opponentBoard);
  const [playerState, setPlayerState] = useState(battleship.playerBoard);
  //   const [over, setOver] = useState("");
  const [turn, setTurn] = useState(0);

  // Setting up the board with battleships
  function onDrop() {}

  function onMove(cell) {
    if (state !== "empty") {
      console.log("cell already clicked");
    } else {
      let status = "";
      try {
        socket.emit("move", cellid);
        status = await new Promise((resolve, reject) => {
          // Socket names are global, temporarily create a socket for this
          // cell. Moves can't be spammed for normal users if we check cellid.
          socket.once("move", (data) => {
            if (data.error) {
              reject(new Error(data.error));
            } else if (data.cellid !== cellid) {
              reject(
                new Error(
                  "data.cellid " + data.cellid + " !== cellid " + cellid
                )
              );
            }
            resolve(data.status);
          });
        });
      } catch (error) {
        console.log(error);
        return;
      }
      setState(status);      
    }
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
