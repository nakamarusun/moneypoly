const propertyList =  require("../src/game/propertydata.js");
const Player = require("../src/game/Player.js");
const Property = require ('../src/game/property.js');
const Board = require('../src/game/board.js'); 
const { TestScheduler } = require("jest");

let board1 = new Board();

board1.initBoard(40);

board1.initGame(4);
describe("Moneypoly board test", () => {
    test("Whether BINUS exists", () => {
        expect(property).toEqual(expect.anything());
    })
})