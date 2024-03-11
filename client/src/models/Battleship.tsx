import { getRow, getColumn } from "../utils/consts";

class Battleship {
  opponentBoard: string[][];
  playerBoard: string[][];

  constructor(rows = 5, cols = 5) {
    this.opponentBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
    this.playerBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
  }
}

export default Battleship;
