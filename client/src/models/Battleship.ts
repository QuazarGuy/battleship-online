import { getRow, getColumn, getCoords } from "../utils/consts";

export class Battleship {
  private _setupPhase: boolean;
  private _orientation: string;
  private _turn: string;
  private _rows: number;
  private _cols: number;
  private _players: Player[];
  private _opponentBoard: string[][];
  private _playerBoard: string[][];

  constructor(players: Player[], rows = 5, cols = 5, orientation = "Axis") {
    this._setupPhase = false;
    this._players = players;
    this._orientation = orientation;
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
    this._opponentBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
    this._playerBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
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

  isValidMove(move: { target: string; turn: string }): boolean {
    console.log("battleship", move);
    const [targetRow, targetCol] = getCoords(move.target);
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

  move(move: { target: string; turn: string }): string[][] | null {
    // TODO: Add server check for ship
    this._opponentBoard = JSON.parse(JSON.stringify(this._opponentBoard));
    this._opponentBoard[targetRow][targetCol] =
      this._opponentBoard[targetRow][targetCol] === "ship" ? "hit" : "miss";

    console.log(this._opponentBoard[targetRow][targetCol]);
    return this._opponentBoard;
  }

  updateState(move: { players: Player[]; turn: string }): void {
    
  }
}

type Player = {
  username: string;
  board: string[][];
};

