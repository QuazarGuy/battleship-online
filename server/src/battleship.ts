// DONE: maintain state to dedupe moves
// TODO: reset button
// TODO: turns
// TODO: 2 players
// TODO: introduce setup phase
// TODO: validate ship placement
// TODO: check sunk ship
// TODO: check winner

const BOARD_SIZE = 5;

class Game {
  _setupPhase: boolean;
  _players: Player[];
  _turn: string;
  _rows: number;
  _cols: number;

  constructor(players: Player[], rows = BOARD_SIZE, cols = BOARD_SIZE) {
    this._setupPhase = false;
    this._players = players;
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
    this._players[0].board = this.#generateBoard();
  }

  addPlayer(player: Player): boolean {
    if (this._players.length >= 2) {
      return false;
    } else {
      this._players.push(player);
      return true;
    }
  }

  #generateBoard(): string[][] {
    let board = new Array(this._rows).fill(new Array(this._cols).fill("empty"));
    // TODO Remove when done testing
    board[2][2] = "ship";
    return board;
  }

  isValidMove(data: { target: string; turn: string }): boolean {
    const [targetRow, targetCol] = this.getCoords(data.target);
    if (
      this._players.length < 2 ||
      this._setupPhase ||
      data.turn !== this._turn
    ) {
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
    let board = this.getBoard(data.turn);
    if (board[targetRow][targetCol] !== "empty") {
      console.log("cell already attacked");
      return false;
    }
    return true;
  }

  async move(
    data: { target: string; turn: string },
    responder: (operation: string, data: object) => void
  ) {
    if (!this.isValidMove(data)) {
      responder("move", {
        error: "invalid move",
      });
      return;
    }
    // For testing lag
    // await new Promise((r) => setTimeout(r, 1000));
    let board = this.getBoard(data.turn);
    let [moveRow, moveCol] = this.getCoords(data.target);
    switch (board[moveRow][moveCol]) {
      case "empty":
        board[moveRow][moveCol] = "miss";
        break;
      case "ship":
        board[moveRow][moveCol] = "hit";
        break;
      default:
        responder("move", {
          error: "invalid move",
        });
        return;
    }

    this._turn = this._turn === "Axis" ? "Allies" : "Axis";

    responder("move", {
      status: board[moveRow][moveCol],
      cellid: data.target,
    });
  }

  getBoard(turn: string): string[][] {
    return turn === "Axis" ? this._players[0].board : this._players[1].board;
  }

  getCoords(target: string): [number, number] {
    const [row, col] = target.split("-");
    return [row.charCodeAt(0) - "A".charCodeAt(0), parseInt(col) - 1];
  }
}

class Player {
  board: string[][];
  constructor() {
    this.board = new Array(5).fill(new Array(5).fill("empty"));
  }
}

export { Game, Player };
