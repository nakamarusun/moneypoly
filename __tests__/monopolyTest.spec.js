const Board = require('../src/game/board.js'); 

const board1 = new Board();

board1.initBoard(40);
board1.initGame(4);
// console.log(board1.players);
board1.players[0].move(board1);
board1.players[0].buy();
// board1.players[0].upgrade();
// console.log(board1.players);
console.log(JSON.stringify(board1.returnBoard()))
// board1.players[1].position = 8;
// board1.players[1].checkPosition();
// board1.players[2].position = 1;
// board1.players[2].buy();
// board1.players[2].upgrade(1);
// board1.players[2].sell(1);
// board1.players[3].position = 2;
// board1.players[3].checkPosition();
// board1.players[0].status = 2;
// board1.players[0].move();
// console.log(board1.players[0].properties[0]);
// console.log(board1.returnBoard().boardState);

// console.log(board1.board[1]);
// console.log(board1.players);

describe("Moneypoly board test", () => {
   test("Whether the board exists", () => {
        expect(board1.board).toEqual(expect.anything());
     });
 });
