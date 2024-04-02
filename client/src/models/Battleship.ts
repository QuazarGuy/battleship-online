import { getRow, getColumn, getCoords } from "../utils/consts";

export class Battleship {
  private _setupPhase: boolean;
  private _orientation: string;
  private _turn: string;
  private _rows: number;
  private _cols: number;
  private _opponentBoard: string[][];
  private _playerBoard: string[][];

  constructor(orientation: string, rows = 5, cols = 5) {
    this._setupPhase = true;
    this._orientation = orientation;
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
    this._playerBoard = new Array(this._rows).fill(new Array(this._cols).fill("empty"));
    this._opponentBoard = new Array(this._rows).fill(new Array(this._cols).fill("empty"));
  }

  get turn(): string {
    return this._turn;
  }

  get opponentBoard(): string[][] {
    return this._opponentBoard;
  }

  get playerBoard(): string[][] {
    return this._playerBoard;
  }

  // TODO: For setup phase refer to chess.js load method
  // https://github.com/jhlywa/chess.js/blob/master/src/chess.ts#L585

  // TODO: Check if all enemy ships are sunk
  isGameOver(): boolean {
    return false;
  }

  addShip(cellid: string): void {
    if (this._setupPhase) {
      const [row, col] = getCoords(cellid);
      this._playerBoard[row][col] = "ship";
      this._playerBoard = JSON.parse(JSON.stringify(this._playerBoard));
    } else {
      console.log("already setup");
    }
  }

  ready() {
    this._setupPhase = false;
  }

  isValidMove(target: string): boolean {
    console.log("battleship", target);
    const [targetRow, targetCol] = getCoords(target);
    if (this._setupPhase || this._turn !== this._orientation) {
      console.log("not your turn");
      return false;
    }
    if (
      targetRow < 0 ||
      targetRow >= this._rows ||
      targetCol < 0 ||
      targetCol >= this._cols
    ) {
      console.log("out of bounds");
      return false;
    }
    if (this._opponentBoard[targetRow][targetCol] !== "empty") {
      console.log("cell already attacked");
      return false;
    }
    return true;
  }

  move(move: {
    status: string;
    turn: string;
    playerBoard: string[][];
    opponentBoard: string[][];
  }) {
    this._playerBoard = move.playerBoard;
    this._opponentBoard = move.opponentBoard;
    this._turn = move.turn;
    return;
  }

  updateState(move: { players: Player[]; turn: string }): void {}
}

type Player = {
  username: string;
  board: string[][];
};
