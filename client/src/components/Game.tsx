import { useCallback, useEffect, useMemo, useState } from "react";
import CustomDialog from "./CustomDialog";
import { BOARD_SIZE } from "../utils/consts";
import { Board } from "./Board";
import { Battleship } from "../models/Battleship";
import { socket } from "../socket";

// https://blog.openreplay.com/building-a-chess-game-with-react/

type Player = {
  username: string;
  orientation: string;
};

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
  const [setup, setSetup] = useState(true);
  const [turn, setTurn] = useState("Axis");
  const [gameOver, setGameOver] = useState(false);

  // Setting up the board with battleships
  function onDrop(cellid: string) {
    battleship.addShip(cellid);
    setPlayerBoard(battleship.playerBoard);
  }

  function onReady() {
    socket.emit("setup", { roomId: room, playerBoard: playerBoard, ships: battleship.playerShips });
  }

  const ready = useCallback (() => {
    battleship.ready();
    console.log("ready"); 
  }, [battleship]);

  function onMove(cellid: string) {
    if (battleship.isValidMove(cellid)) {
      socket.emit("move", { target: cellid, roomId: room });
    }
  }

  const makeAMove = useCallback(
    (move: {
      status: string;
      shipStatus: string | undefined;
      gameOver: boolean;
      turn: string;
      playerBoard: string[][];
      opponentBoard: string[][];
    }) => {
      try {
        // Set model state
        battleship.move(move);

        setOpponentBoard(battleship.opponentBoard);
        setPlayerBoard(battleship.playerBoard);
        setGameOver(battleship.isGameOver());
        setTurn(battleship.turn);

        return move.status;
      } catch (e) {
        return null;
      }
    },
    [battleship]
  );

  useEffect(() => {
    socket.on("move", (move) => {
      if (move.error) {
        console.log("error", move.error);
        return;
      }
      makeAMove(move);
    });
  }, [makeAMove]);

  useEffect(() => {
    socket.on("setup", (response) => {
      if (response.error) {
        console.log("error", response.error);
      } else {
        console.log("setup", response.msg);
        ready();
        setSetup(false);        
      }
    });
  }, [ready]);

  useEffect(() => {
    socket.on('closeRoom', ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  return (
    <>
      <div style={{ height: 30 }}>Room: {room}</div>
      <div style={{ height: 30 }}>Turn: {setup ? "Setup" : turn}</div>
      <div style={{ height: 30 }}>{`${
        !players[1]
          ? "Waiting for opponent"
          : orientation === "Axis"
          ? players[1].username
          : players[0].username
      }\'s Fleet`}</div>
      <Board
        id="opponentBoard"
        boardState={opponentBoard}
        boardWidth={400}
        rows={BOARD_SIZE}
        cols={BOARD_SIZE}
        onMove={setup || gameOver ? () => {} : onMove}
      />
      <div style={{ height: 30 }}>{`${username}\'s Fleet`}</div>
      <Board
        id="playerBoard"
        boardState={playerBoard}
        boardWidth={400}
        rows={BOARD_SIZE}
        cols={BOARD_SIZE}
        onMove={setup ? onDrop : () => {}}
      />
      {setup && <button onClick={onReady}>Ready</button>}
      <CustomDialog // Game Over CustomDialog
        open={Boolean(gameOver)}
        title={"Game Over"}
        contentText={battleship.turn === orientation ? "You Win!" : "You Lose!"}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
      >
        <div>Click Continue to go back to lobby</div>
      </CustomDialog>
    </>
  );
}

export default Game;
