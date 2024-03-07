"use strict";
// DONE: maintain state to dedupe moves
// TODO: reset button
// TODO: turns
// TODO: 2 players
// TODO: introduce setup phase
// TODO: validate ship placement
// TODO: check sunk ship
// TODO: check winner
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Game = void 0;
class Game {
    players;
    // let turn = 0;
    rows = 5;
    cols = 10;
    constructor(player, rows = 5, cols = 10) {
        player.board = this._generateBoard();
        this.players = [player];
        this.rows = rows;
        this.cols = cols;
    }
    addPlayer(player) {
        if (this.players.length >= 2) {
            return false;
        }
        else {
            this.players.push(player);
            return true;
        }
    }
    _generateBoard() {
        let board = new Map();
        let key = "";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                key = `${String.fromCharCode("A".charCodeAt(0) + row)}-${(col + 1).toString()}`;
                console.log(key);
                board.set(key, "empty");
            }
        }
        // TODO Remove when done testing
        board.set("C-4", "ship");
        return board;
    }
    async move(data, responder) {
        // For testing lag
        // await new Promise((r) => setTimeout(r, 1000));
        let board = this.players[0].board;
        if (board.has(data)) {
            switch (board.get(data)) {
                case "empty":
                    board.set(data, "miss");
                    break;
                case "ship":
                    board.set(data, "hit");
                    break;
                default:
                    responder("move", {
                        error: "invalid move - cell already attacked",
                    });
                    return;
            }
            responder("move", {
                status: board.get(data),
                cellid: data,
            });
        }
        else {
            responder("move", {
                error: "invalid move",
            });
        }
    }
}
exports.Game = Game;
class Player {
    name;
    board;
    constructor(name) {
        this.name = name;
        this.board = new Map();
    }
}
exports.Player = Player;
