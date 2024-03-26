import { getRow, getColumn, getCoords } from "../utils/consts";

export class Battleship {
  private _setupPhase: boolean;
  private _orientation: string;
  private _turn: string;
  private _rows: number;
  private _cols: number;
  private _opponentBoard: string[][];
  private _playerBoard: string[][];

  constructor(rows = 5, cols = 5, orientation = "Axis") {
    this._setupPhase = false;
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

  move(move: { target: string; turn: string }): string[][] {
    console.log("battleship", move);
    const [targetRow, targetCol] = getCoords(move.target);
    if (this._setupPhase || this._turn !== this._orientation) {
      console.log("not your turn");
      return this._opponentBoard;
    }
    if (
      targetRow < 0 ||
      targetRow >= this._rows ||
      targetCol < 0 ||
      targetCol >= this._cols
    ) {
      console.log("out of bounds");
      return this._opponentBoard;
    }
    if (this._opponentBoard[targetRow][targetCol] !== "empty") {
      console.log("cell already attacked");
      return this._opponentBoard;
    }
    // TODO: Add server check for ship
    this._opponentBoard = JSON.parse(JSON.stringify(this._opponentBoard));
    this._opponentBoard[targetRow][targetCol] =
      this._opponentBoard[targetRow][targetCol] === "ship" ? "hit" : "miss";

    // this._opponentBoard[targetRow][targetCol] =
    //   this._opponentBoard[targetRow][targetCol] === "ship" ? "hit" : "miss";
    console.log(this._opponentBoard[targetRow][targetCol]);
    // this.#turn = this.#turn === "p" ? "o" : "p";
    // console.log(this._turn);
    return this._opponentBoard;

    // if (state !== "empty") {
    //   console.log("cell already clicked");
    //   return {
    //     cellid: cellid,
    //     status: "error",
    //   }
    // } else {
    //   let status = "";
    //   try {
    //     socket.emit("move", cellid);
    //     status = await new Promise((resolve, reject) => {
    //       // Socket names are global, temporarily create a socket for this
    //       // cell. Moves can't be spammed for normal users if we check cellid.
    //       socket.once("move", (data) => {
    //         if (data.error) {
    //           reject(new Error(data.error));
    //         } else if (data.cellid !== cellid) {
    //           reject(
    //             new Error(
    //               "data.cellid " + data.cellid + " !== cellid " + cellid
    //             )
    //           );
    //         }
    //         resolve(data.status);
    //       });
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     return {
    //       cellid: cellid,
    //       status: "error",
    //     };
    //   }
    //   return {
    //     cellid: cellid,
    //     status: status,
    //   }
    // }
  }
}
