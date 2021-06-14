const { createBoard } = require("../src/worker/engine/gameref");

const board = createBoard({
    players: [
        {
            n: "Player"
        },
        {
            n: "Shoob"
        },
        {
            n: "Cibaboo"
        }
    ]
});

const boardData = board.returnBoard();

describe("Moneypoly socket board test", () => {
   test("Whether username is there", () => {
        expect(boardData.playerList[1].uname).toEqual("Shoob");
    });

    test("There is 3 players", () => {
        expect(boardData.playerList.length).toEqual(3);
    });
});