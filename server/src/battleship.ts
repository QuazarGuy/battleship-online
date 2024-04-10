// TODO: validate ship placement

const BOARD_SIZE = 10;

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

  setup(playerId: string, board: string[][], ships: string[][]): object {
    const player = this._players.get(playerId);
    if (!player) {
      return {
        error: "player not found",
      };
    }
    player.shipPlacement = board;
    player.ships = ships;
    player.ready = true;
    try {
      const opponent = this._players.get(this.getOpponentId(playerId));
      if (opponent && opponent.ready) {
        this._setupPhase = false;
        return {
          msg: "setup complete",
        };
      }
      return {
        error: "waiting for opponent",
      };
    } catch (error) {
      return {
        error: "no opponent found",
      };
    }
  }

  isValidMove(playerId: string, player: Player, target: string): boolean {
    const [targetRow, targetCol] = this.getCoords(target);
    if (
      this._players.size < 2 ||
      this._setupPhase ||
      player.orientation !== this._turn
    ) {
      return false;
    }
    if (
      targetRow < 0 ||
      targetRow >= this._rows ||
      targetCol < 0 ||
      targetCol >= this._cols
    ) {
      return false;
    }
    const opponent = this._players.get(this.getOpponentId(playerId));
    if (!opponent) {
      return false;
    }
    if (opponent.isAttacked(targetRow, targetCol)) {
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
    const [moveRow, moveCol] = this.getCoords(data.target);
    if (opponent && !opponent?.isAttacked(moveRow, moveCol)) {
      opponent.setAttacked(moveRow, moveCol);
    }
    const gameOver = opponent?.isGameOver();
    if (!gameOver) {
      this._turn = this._turn === "Axis" ? "Allies" : "Axis";
    }

    return {
      status: opponent?.getStatus(moveRow, moveCol),
      shipStatus:
        opponent?.getStatus(moveRow, moveCol) === "hit"
          ? opponent?.isSunk(moveRow, moveCol)
          : undefined,
      gameOver: gameOver,
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
    this._ships = new Map<string, Ship>();
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

  get shipPlacement(): string[][] {
    return this._shipPlacement;
  }

  set shipPlacement(board: string[][]) {
    this._shipPlacement = board;
    // TODO: Validate placement of ships
  }

  set ships(ships: string[][] | undefined) {
    this._ships = new Map<string, Ship>();
    if (!ships) {
      this._ships.set("Carrier", new Ship(5));
      this._ships.set("Battleship", new Ship(4));
      this._ships.set("Cruiser", new Ship(3));
      this._ships.set("Submarine", new Ship(3));
      this._ships.set("Destroyer", new Ship(2));
      return;
    }
    for (const ship of ships) {
      this._ships.set(ship[0], new Ship(parseInt(ship[1])));
    }
  }

  get ready(): boolean {
    return this._ready;
  }

  set ready(ready: boolean) {
    this._ready = ready;
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

  isGameOver(): boolean {
    for (const ship of this._ships.values()) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
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
