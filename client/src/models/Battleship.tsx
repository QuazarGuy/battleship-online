import { getRow, getColumn, getCoords } from "../utils/consts";

class Battleship {
  #setupPhase: boolean;
  orientation: string;
  #turn: string;
  rows: number;
  cols: number;
  #opponentBoard: string[][];
  #playerBoard: string[][];

  constructor(rows = 5, cols = 5) {
    this.#setupPhase = false;
    this.orientation = "p";
    this.#turn = "p";
    this.rows = rows;
    this.cols = cols;
    this.#opponentBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
    this.#playerBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
  }

  move(moveData: { target: string; turn: string }): string[][] {
    console.log("battleship", moveData);
    const [row, col] = getCoords(moveData.target);
    if (this.#setupPhase || this.#turn !== this.orientation) {
      console.log("not your turn");
      return this.#opponentBoard;
    }
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      console.log("out of bounds");
      return this.#opponentBoard;
    }
    if (this.#opponentBoard[row][col] !== "empty") {
      console.log("cell already attacked");
      return this.#opponentBoard;
    }
    // TODO: Add server check for ship
    this.#opponentBoard[row][col] =
      this.#opponentBoard[row][col] === "ship" ? "hit" : "miss";
    console.log(this.#opponentBoard[row][col]);
    // this.#turn = this.#turn === "p" ? "o" : "p";
    console.log(this.#turn);
    return this.#opponentBoard;

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

  isSetupPhase() {
    return this.#setupPhase;
  }

  getTurn() {
    return this.#turn;
  }

  isGameOver() {
    return false;
  }

  getOpponentBoard() {
    return this.#opponentBoard;
  }

  setOpponentBoard(board: string[][]) {
    this.#opponentBoard = board;
  }

  getPlayerBoard() {
    return this.#playerBoard;
  }
}

export default Battleship;
