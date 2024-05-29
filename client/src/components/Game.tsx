import { useCallback, useEffect, useMemo, useState } from "react";
import CustomDialog from "./CustomDialog";
import { BOARD_SIZE, getCoords } from "../utils/consts";
import { Board } from "./Board";
import { Battleship } from "../models/Battleship";
import { socket } from "../socket";
import GameViewHelper from "../utils/GameViewHelper";
import {
  ClientRect,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { Draggable } from "../utils/Draggable";
import { Ship } from "./Ship";

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
  const gameView = useMemo(() => new GameViewHelper(), []);
  const [opponentBoard, setOpponentBoard] = useState(battleship.opponentBoard);
  const [playerBoard, setPlayerBoard] = useState(battleship.playerBoard);
  const [opponentBoardHover, setOpponentBoardHover] = useState(
    gameView.opponentBoardHover
  );
  const [playerBoardHover, setPlayerBoardHover] = useState(
    gameView.playerBoardHover
  );
  const [shipLayout, setShipLayout] = useState(gameView.initializeShipLayout());
  const [hoverColor, setHoverColor] = useState("white");
  const [setup, setSetup] = useState(true);
  const [playersReady, setPlayersReady] = useState(false);
  const [readyEnabled, setReadyEnabled] = useState(false);
  const [turn, setTurn] = useState("Axis");
  const [gameOver, setGameOver] = useState(false);
  // const [isDragging, setIsDragging] = useState(false);
  // const [over, setOver] = useState("null");
  const [shipDirection, setShipDirection] = useState("EW");
  const [shipTypeIndex, setShipTypeIndex] = useState(0);
  const shipTypes = [
    "carrier",
    "battleship",
    "cruiser",
    "submarine",
    "destroyer",
  ];

  function onShipHover(cellid: string) {
    if (
      battleship.isValidShipPlacement(
        cellid,
        shipDirection,
        shipTypes[shipTypeIndex]
      )
    ) {
      setHoverColor("white");
    } else {
      setHoverColor("red");
    }
    gameView.setPlayerBoardHover(
      cellid,
      shipDirection,
      shipTypes[shipTypeIndex]
    );
    setPlayerBoardHover(gameView.playerBoardHover);
  }

  function onDrop(cellid: string): boolean {
    if (
      !battleship.isValidShipPlacement(
        cellid,
        shipDirection,
        shipTypes[shipTypeIndex]
      )
    ) {
      return false;
    }
    battleship.addShip(cellid, shipDirection, shipTypes[shipTypeIndex]);
    setPlayerBoard(battleship.playerBoard);
    if (shipTypeIndex < shipTypes.length - 1) {
      setShipTypeIndex(shipTypeIndex + 1);
    } else {
      gameView.resetPlayerBoardHover();
      setPlayerBoardHover(gameView.playerBoardHover);
      setSetup(false);
      setReadyEnabled(true);
    }
    return true;
  }

  function onReady() {
    socket.emit("setup", {
      roomId: room,
      playerBoard: playerBoard,
      ships: battleship.playerShips,
    });
    setReadyEnabled(false);
  }

  const ready = useCallback(() => {
    battleship.ready();
  }, [battleship]);

  function onHover(cellid: string) {
    gameView.setOpponentBoardHover(cellid);
    setOpponentBoardHover(gameView.opponentBoardHover);
  }

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
        ready();
        setPlayersReady(true);
      }
    });
  }, [ready]);

  useEffect(() => {
    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  function handleDragStart() {
    // setIsDragging(true);
  }

  function handleDragOver(event: DragOverEvent) {
    let cellid = event.over?.id.toString().substring(10);
    if (cellid !== undefined && cellid !== null) {
      onShipHover(cellid);
    }
    // setOver(event.over === null ? "null" : event.over.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log(event);
    let cellid = event.over?.id.toString().substring(10);
    if (cellid !== undefined && cellid !== null && onDrop(cellid)) {
      gameView.setShipLayout(cellid, shipDirection, shipTypes[shipTypeIndex]);
      setShipLayout(gameView.shipLayout);
    }
  }

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
        hoverState={playersReady && !gameOver ? opponentBoardHover : undefined}
        hoverColor={hoverColor}
        boardWidth={400}
        rows={BOARD_SIZE}
        cols={BOARD_SIZE}
        onMove={playersReady && !gameOver ? onMove : () => {}}
        onHover={playersReady && !gameOver ? onHover : () => {}}
      />
      {setup && (
        <button
          onClick={() => setShipDirection(shipDirection === "EW" ? "NS" : "EW")}
        >
          Toggle ship direction
        </button>
      )}
      {readyEnabled && <button onClick={onReady}>Ready</button>}
      <div>
        {`${username}\'s Fleet`}
        <DndContext
          collisionDetection={GameViewHelper.customCollisionCheck}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div>
            <Draggable id="carrier" element="ship">
              <Ship ship="Carrier">
                <img src="/carrier.svg" width="250" height="50" />
              </Ship>
            </Draggable>
          </div>
          {/* <DragOverlay>
            {isDragging ? (
              <Ship ship="Carrier">
                <img src="../../carrier.svg" width="250" height="50" />
              </Ship>
            ) : null}
          </DragOverlay> */}
          <Board
            id="playerBoard"
            boardState={playerBoard}
            hoverState={!readyEnabled ? playerBoardHover : undefined}
            shipLayout={shipLayout}
            hoverColor={hoverColor}
            boardWidth={400}
            rows={BOARD_SIZE}
            cols={BOARD_SIZE}
            onMove={setup ? onDrop : () => {}}
            onHover={setup ? onShipHover : () => {}}
          />
        </DndContext>
      </div>
      <CustomDialog // Game Over Dialog
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
