const Board = require('../src/game/board.js'); 

const board1 = new Board();

board1.initBoard(40);
board1.initGame(["Anto", "Budi", "Cecep", "Dabus"]);
// console.log(board1.players);
board1.checkTurn().move(board1);
board1.checkTurn().buy(board1);
board1.checkTurn().checkPosition(board1);
board1.checkTurn().upgrade(board1);
board1.nextTurn();
board1.checkTurn().position = 8;
board1.checkTurn().checkPosition(board1);
board1.checkTurn().position = 1;
board1.checkTurn().buy(board1);
board1.checkTurn().upgrade(board1);
// board1.checkTurn().sell(1);
board1.checkTurn().position = 2;
board1.checkTurn().checkPosition(board1);
board1.checkTurn().status = 2;
board1.checkTurn().move(board1);

describe("Moneypoly board test", () => {
   test("Whether the board exists", () => {
        expect(board1.board).toEqual(expect.anything());
     });
 });
