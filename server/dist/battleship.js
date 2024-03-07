"use strict";
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
        let board = {};
        let index = "";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                index = `${String.fromCharCode("A".charCodeAt(0) + row)}-${(col + 1).toString()}`;
                console.log(index);
                board[index] = "empty";
            }
        }
        board["C-4"] = "ship";
        return board;
    }
    async move(data, responder) {
        await new Promise((r) => setTimeout(r, 1000));
        responder("move", {
            isShip: data === "C-4",
            cellid: data,
        });
        console.log("ship", data === "C-4");
    }
}
exports.Game = Game;
class Player {
    name;
    board;
    constructor(name) {
        this.name = name;
        this.board = {};
    }
}
exports.Player = Player;
