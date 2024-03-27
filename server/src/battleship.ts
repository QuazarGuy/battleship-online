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
  _players: Map<string, Player>;
  _playerList: string[];
  _turn: string;
  _rows: number;
  _cols: number;

  constructor(playerId: string, rows = BOARD_SIZE, cols = BOARD_SIZE) {
    this._setupPhase = false;
    this._players = new Map();
    this._playerList = [playerId];
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
    this.addPlayer(playerId, "Axis");
  }

  addPlayer(playerId: string, orientation: string): boolean {
    if (this._players.size >= 2) {
      return false;
    } else {
      this._players.set(
        playerId,
        new Player(orientation, this.#generateBoard())
      );
      this._playerList.push(playerId);
      return true;
    }
  }

  #generateBoard(): string[][] {
    let board = new Array(this._rows).fill(new Array(this._cols).fill("empty"));
    // TODO Remove when done testing
    board[2][2] = "ship";
    return board;
  }

  isValidMove(playerId: string, player: Player, target: string): boolean {
    const [targetRow, targetCol] = this.getCoords(target);
    if (!player) {
      console.log("player not found");
      return false;
    }
    if (
      this._players.size < 2 ||
      this._setupPhase ||
      player.orientation !== this._turn
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
    const opponentBoard = this.getOpponentBoard(playerId);
    if (!opponentBoard) {
      console.log("opponent board not found");
      return false;
    }
    if (opponentBoard[targetRow][targetCol] !== "empty") {
      console.log("cell already attacked");
      return false;
    }
    return true;
  }

  move(data: { playerId: string; target: string }): object {
    const player = this._players.get(data.playerId);
    if (!player) {
      return { error: "player not found" };
    }
    if (!this.isValidMove(data.playerId, player, data.target)) {
      return { error: "invalid move" };
    }
    
    let board = this.getOpponentBoard(data.playerId);
    if (!board) {
      return { error: "opponent board not found" };
    }
    let [moveRow, moveCol] = this.getCoords(data.target);
    switch (board[moveRow][moveCol]) {
      case "empty":
        board[moveRow][moveCol] = "miss";
        break;
      case "ship":
        board[moveRow][moveCol] = "hit";
        break;
      default:
        return { error: "invalid move" };
    }

    this._turn = this._turn === "Axis" ? "Allies" : "Axis";

    return { status: board[moveRow][moveCol], cellid: data.target };
  }

  getOpponentBoard(playerId: string): string[][] | undefined {
    return this._playerList[0] === playerId
      ? this._players.get(this._playerList[1])?.board
      : this._players.get(this._playerList[0])?.board;
  }

  getCoords(target: string): [number, number] {
    const [row, col] = target.split("-");
    return [row.charCodeAt(0) - "A".charCodeAt(0), parseInt(col) - 1];
  }
}

class Player {
  orientation: string;
  board: string[][];

  constructor(orientation: string, board: string[][]) {
    this.orientation = orientation;
    this.board = board;
  }
}

export { Game, Player };
