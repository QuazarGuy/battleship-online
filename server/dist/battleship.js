"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlayer = void 0;
let players = [];
let turn = 0;
let rows = 5;
let cols = 10;
class Player {
    name;
    board;
    constructor(name) {
        this.name = name;
        // TODO: validate board
        this.board = generateBoard();
    }
}
function addPlayer(player) {
    if (players.length >= 2) {
        return false;
    }
    else {
        players.push(player);
        return true;
    }
}
exports.addPlayer = addPlayer;
function generateBoard() {
    let board = {};
    let index = "";
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            index = `${String.fromCharCode("A".charCodeAt(0) + row)}-${(col + 1).toString()}`;
            console.log(index);
            board[index] = "empty";
        }
    }
    board["C-4"] = "ship";
    return board;
}
