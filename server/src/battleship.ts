// TODO: validate moves
// TODO: maintain state to dedupe moves
// TODO: reset button
// TODO: turns
// TODO: 2 players
// TODO: introduce setup phase
// TODO: validate ship placement
// TODO: check sunk ship
// TODO: check winner

class Game {
  players: Player[];
  // let turn = 0;
  rows = 5;
  cols = 10;

  constructor(player: Player, rows = 5, cols = 10) {
    player.board = this._generateBoard();
    this.players = [player];
    this.rows = rows;
    this.cols = cols;
  }

  addPlayer(player: Player): boolean {
    if (this.players.length >= 2) {
      return false;
    } else {
      this.players.push(player);
      return true;
    }
  }

  _generateBoard(): { [key: string]: string } {
    let board: { [key: string]: string } = {};
    let key = "";
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        key = `${String.fromCharCode("A".charCodeAt(0) + row)}-${(
          col + 1
        ).toString()}`;
        console.log(key);
        board.set(key, "empty");
      }
    }
    board["C-4"] = "ship";
    return board;
  }

  async move(
    data: string,
    responder: (operation: string, data: object) => void
  ) {
    // For testing lag
    // await new Promise((r) => setTimeout(r, 1000));
    if (this.players[0].board.has(data))
    responder("move", {
      isShip: data === "C-4",
      cellid: data,
    });
    console.log("ship", data === "C-4");
  }
}

class Player {
  name: string;
  board: { [key: string]: string };
  constructor(name: string) {
    this.name = name;
    this.board = {};
  }
}

export { Game, Player };