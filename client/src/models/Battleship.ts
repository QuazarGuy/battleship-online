import { getCoords } from "../utils/consts";

export class Battleship {
  private _setupPhase: boolean;
  private _orientation: string;
  private _turn: string;
  private _rows: number;
  private _cols: number;
  private _opponentBoard: string[][];
  private _playerBoard: string[][];
  private _playerShips: Map<string, number>;
  private _gameOver: boolean;

  constructor(orientation: string, rows = 5, cols = 5) {
    this._setupPhase = true;
    this._orientation = orientation;
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
    this._playerBoard = this.generateBoard(this._rows, this._cols);
    this._opponentBoard = this.generateBoard(this._rows, this._cols);
    this._playerShips = new Map();
    this._gameOver = false;
  }

  private generateBoard(rows: number, cols: number): string[][] {
    let board = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push("empty");
      }
      board.push(row);
    }
    return board;
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

  get playerShips(): string[][] {
    var ships = [];
    for (const [key, value] of this._playerShips) {
      ships.push([key, value.toString()]);
    }
    return ships;
  }

  updatePlayerBoard(update: string[][]): string[][] {
    this._playerBoard = JSON.parse(JSON.stringify(this._playerBoard))
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        this._playerBoard[i][j] = update[i][j] === "hit" || update[i][j] === "miss" ? update[i][j] : this._playerBoard[i][j];
      }
    }
    
    return this._playerBoard;
  }

  // TODO: For setup phase refer to chess.js load method
  // https://github.com/jhlywa/chess.js/blob/master/src/chess.ts#L585

  // TODO: Check if all enemy ships are sunk
  isGameOver(): boolean {
    return this._gameOver;
  }

  addShip(cellid: string): void {
    if (this._setupPhase) {
      const [row, col] = getCoords(cellid);
      this._playerBoard[row][col] = "ship";
      this._playerBoard = JSON.parse(JSON.stringify(this._playerBoard));
      this._playerShips.set("ship", (this._playerShips.get("ship") ?? 0) + 1);
      console.log("playerShips: ", this._playerShips);
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
    shipStatus: string | undefined;
    gameOver: boolean;
    turn: string;
    playerBoard: string[][];
    opponentBoard: string[][];
  }) {
    this._gameOver = move.gameOver;
    this._playerBoard = this.updatePlayerBoard(move.playerBoard);
    this._opponentBoard = move.opponentBoard;
    this._turn = move.turn;
  }
}
