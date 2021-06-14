const { createBoard } = require("../src/worker/engine/gameref");

players = ["Player", "Shoob", "Cibaboo"];
const board = createBoard({
    players: players.map((_n) => {return {n: _n};} )
});

const boardData = board.returnBoard();

describe("Moneypoly socket board test", () => {
   test("Whether username is there", () => {
        expect(players).toContain(boardData.playerList[1].uname);
    });

    test("There is 3 players", () => {
        expect(boardData.playerList.length).toEqual(3);
    });
});
