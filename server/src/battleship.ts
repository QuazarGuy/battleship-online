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
    this._setupPhase = true;
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

  setup(playerId: string, board: string[][]): object {
    const player = this._players.get(playerId)
    if (!player) {
      return {
        error: "player not found"
      }
    }
    player.board = board;
    player.ready = true;
    const opponent = this._players.get(this.getOpponentId(playerId));
    if (opponent && opponent.ready) {
      this._setupPhase = false;
      return {
        msg: "setup complete",
      };
    }
    return {
      error: "waiting for opponent",
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
    const opponent = this._players.get(this.getOpponentId(playerId));
    if (!opponent) {
      console.log("opponent not found");
      return false;
    }
    if (opponent.isAttacked(targetRow, targetCol)) {
      console.log("cell already attacked");
      return false;
    }
    return true;
  }

  move(data: { playerId: string; target: string }): object {
    if (this._setupPhase) {
      return { error: "setup phase" };
    }
    const player = this._players.get(data.playerId);
    if (!player) {
      return { error: "player not found" };
    }
    if (!this.isValidMove(data.playerId, player, data.target)) {
      return { error: "invalid move" };
    }

    const opponent = this._players.get(this.getOpponentId(data.playerId));
    let [moveRow, moveCol] = this.getCoords(data.target);
    if (opponent && !opponent?.isAttacked(moveRow, moveCol)) {
      opponent.setAttacked(moveRow, moveCol);
    }
    this._turn = this._turn === "Axis" ? "Allies" : "Axis";

    return {
      status: opponent?.getStatus(moveRow, moveCol),
      turn: this._turn,
      playerBoard: player?.board,
      opponentBoard: opponent?.board,
    };
  }

  getPlayerBoard(playerId: string): string[][] | undefined {
    return this._players.get(playerId)?.board;
  }

  // Throws if there is no opponent
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
  private _ready: boolean;

  constructor(orientation: string, rows: number, cols: number) {
    this._orientation = orientation;
    this._board = this.generateBoard(rows, cols);
    this._shipPlacement = this.generateBoard(rows, cols);
    this._ships = new Map();
    this._ready = false;
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

  get ready(): boolean {
    return this._ready;
  }

  set ready(ready: boolean) {
    this._ready = ready;
  }

  set board(board: string[][]) {
    this._shipPlacement = board;
    // TODO: Validate placement of ships
  }

  isAttacked(row: number, col: number): boolean {
    return this._board[row][col] !== "empty";
  }

  getStatus(row: number, col: number): string {
    return this._board[row][col];
  }

  // Throws an error if the coordinates are already attacked
  setAttacked(row: number, col: number) {
    if (this.isAttacked(row, col)) {
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
