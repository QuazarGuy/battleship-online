import { RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { BOARD_SIZE, SHIP_SIZES, getCoords } from "./consts";
import { Active, Collision, CollisionDetection, DroppableContainer, closestCenter } from "@dnd-kit/core";

export default class GameViewHelper {
  opponentBoardHover: boolean[][];
  playerBoardHover: boolean[][];
  static customCollisionCheck: CollisionDetection | undefined;

  constructor() {
    this.opponentBoardHover = this.initializeBoardHover();
    this.playerBoardHover = this.initializeBoardHover();
  }

  initializeBoardHover(): boolean[][] {
    let boardHover: boolean[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      let row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push(false);
      }
      boardHover.push(row);
    }
    return boardHover;
  }

  initializeShipLayout(): any[][] {
    let shipLayout = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      let row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push("empty");
      }
      shipLayout.push(row);
    }
    return shipLayout;
  }

  setPlayerBoardHover(cellid: string, orientation: string, shipType: string) {
    const [row, col] = getCoords(cellid);
    const shipSize = SHIP_SIZES.get(shipType) ?? 0;
    this.playerBoardHover = this.initializeBoardHover();
    if (orientation === "EW") {
      for (let i = 0; i < shipSize && col + i < BOARD_SIZE; i++) {
        this.playerBoardHover[row][col + i] = true;
      }
    } else {
      for (let i = 0; i < shipSize && row + i < BOARD_SIZE; i++) {
        this.playerBoardHover[row + i][col] = true;
      }
    }
  }

  resetPlayerBoardHover() {
    this.playerBoardHover = this.initializeBoardHover();
  }

  setOpponentBoardHover(cellid: string) {
    const [row, col] = getCoords(cellid);
    this.opponentBoardHover = this.initializeBoardHover();
    this.opponentBoardHover[row][col] = true;
    this.opponentBoardHover = JSON.parse(
      JSON.stringify(this.opponentBoardHover)
    );
  }

  // Sets the collision point to the left side of the ship
  customCollisionCheck(
    args: {
      active: Active;
      collisionRect: ClientRect;
      droppableRects: RectMap;
      droppableContainers: DroppableContainer[];
      pointerCoordinates: Coordinates | null;
  }): Collision[] {
    console.log(args.active);
    return closestCenter({
      ...args,
    });
  }
}
