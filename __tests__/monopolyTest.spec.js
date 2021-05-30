const propertyList =  require("../src/game/propertydata.js");
const Player = require("../src/game/player.js");
const Property = require ('../src/game/property.js');
const Board = require('../src/game/board.js'); 
const { TestScheduler } = require("jest");

let board1 = new Board();

board1.initBoard(40);
board1.initGame(4);
console.log(board1.players[0]);
board1.players[0].position = 8;
board1.players[0].buy(board1);
board1.players[0].upgrade(8, board1);
board1.players[1].position = 8;
board1.players[1].checkPosition(board1);
board1.players[2].position = 1;
board1.players[2].buy(board1);
board1.players[2].upgrade(1, board1);
board1.players[2].sell(1, board1);
board1.players[3].position = 2;
board1.players[3].checkPosition(board1);
console.log(board1.board[8]);
console.log(board1.board[1]);
console.log(board1.players);

describe("Moneypoly board test", () => {
   test("Whether BINUS exists", () => {
        expect(board1.board).toEqual(expect.anything());
     })
 })