import { getRow, getColumn, getCoords } from "../utils/consts";

export class Battleship {
  private _setupPhase: boolean;
  private _orientation: string;
  private _turn: string;
  private _rows: number;
  private _cols: number;
  private _players: Player[];

  constructor(players: Player[], orientation: string, rows = 5, cols = 5) {
    this._setupPhase = false;
    this._players = players;
    this._orientation = orientation;
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
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

  move(move: { status: string; cellid: string }): string[][] | null {
    const [targetRow, targetCol] = getCoords(move.cellid);
    let board = 
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

