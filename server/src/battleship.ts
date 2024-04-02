// DONE: maintain state to dedupe moves
// TODO: reset button
// DONE: turns
// DONE: 2 players
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

  constructor(rows = BOARD_SIZE, cols = BOARD_SIZE) {
    this._setupPhase = false;
    this._players = new Map();
    this._playerList = [];
    this._turn = "Axis";
    this._rows = rows;
    this._cols = cols;
  }

  addPlayer(playerId: string, orientation: string): boolean {
    if (this._players.size >= 2) {
      return false;
    } else {
      this._players.set(
        playerId,
        new Player(orientation, this._rows, this._cols)
      );
      this._playerList.push(playerId);
      return true;
    }
  }

  isValidMove(playerId: string, player: Player, target: string): boolean {
    const [targetRow, targetCol] = this.getCoords(target);
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
    const opponentId = this.getOpponentId(playerId);
    const opponentBoard = this.getPlayerBoard(opponentId);
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

    this._turn = this._turn === "Axis" ? "Allies" : "Axis";

    const opponentId = this.getOpponentId(data.playerId);
    const opponentBoard = this.getPlayerBoard(opponentId);
    if (!opponentBoard) {
      return { error: "opponent board not found" };
    }
    let [moveRow, moveCol] = this.getCoords(data.target);
    switch (opponentBoard[moveRow][moveCol]) {
      case "empty":
        opponentBoard[moveRow][moveCol] = "miss";
        break;
      case "ship":
        opponentBoard[moveRow][moveCol] = "hit";
        break;
      default:
        return { error: "invalid move" };
    }

    return {
      status: opponentBoard[moveRow][moveCol],
      turn: this._turn,
      playerBoard: this.getPlayerBoard(data.playerId),
      opponentBoard: opponentBoard,
    };
  }

  getPlayerBoard(playerId: string): string[][] | undefined {
    return this._players.get(playerId)?.board;
  }

  getOpponentId(playerId: string): string {
    if (this._playerList.length < 2) {
      throw new Error("no opponent found"); 
    }
    const opponentId =
      this._playerList[0] === playerId
        ? this._playerList[1]
        : this._playerList[0];
    return opponentId;
  }

  getCoords(target: string): [number, number] {
    const [row, col] = target.split("-");
    return [row.charCodeAt(0) - "A".charCodeAt(0), parseInt(col) - 1];
  }
}

class Player {
  private _orientation: string;
  private _board: string[][];
  private _shipPlacement: string[][];
  private _ships: Map<string, Ship>;

  constructor(orientation: string, rows: number, cols: number) {
    this._orientation = orientation;
    this._board = this.generateBoard(rows, cols);
    this._shipPlacement = this.generateBoard(rows, cols);
    this._ships = new Map();

    // TODO Remove when done testing
    this._shipPlacement[2][2] = "ship";
    this._ships.set("ship", new Ship(1));
  }

  generateBoard(rows: number, cols: number): string[][] {
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

  get orientation(): string {
    return this._orientation;
  }

  get board(): string[][] {
    return this._board;
  }

  isAttacked(row: number, col: number): boolean {
    return this._board[row][col] !== "empty";
  }

  // Throws an error if the coordinates are already attacked
  setAttacked(row: number, col: number) {
    if (!this.isAttacked(row, col)) {
      throw new Error("already attacked");
    }
    this._board[row][col] = this.isShip(row, col) ? "hit" : "miss";
    this._ships.get(this._shipPlacement[row][col])?.addHit();
  }

  // TODO: Validate placement of ships
  set shipPlacement(shipPlacement: string[][]) {
    this._shipPlacement = shipPlacement;
  }

  isShip(row: number, col: number): boolean {
    return this._shipPlacement[row][col] !== "empty";
  }

  // Throws an error if there isn't a ship at the specified coordinates
  isSunk(row: number, col: number): boolean {
    if (!this.isShip(row, col)) {
      throw new Error("not a ship");
    }
    return this._ships.get(this._shipPlacement[row][col])?.isSunk() ?? false;
  }
}

class Ship {
  private _size: number;
  private _hits: number;

  constructor(size: number) {
    this._size = size;
    this._hits = 0;
  }

  addHit() {
    this._hits++;
  }

  isSunk(): boolean {
    return this._hits >= this._size;
  }
}

export { Game };
