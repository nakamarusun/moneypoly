const propertyList =  require("../src/game/propertydata.js");
const Player = require("../src/game/Player.js");
const Property = require ('../src/game/property.js');
const Board = require('../src/game/board.js'); 
const { TestScheduler } = require("jest");

let board1 = new Board();

board1.initBoard(39);

let property = propertyList.find((a) => {return a.name === "Bundaran HI"});

console.log(property);
property.price  = property.price * 2;
console.log(board1.board);
describe("Moneypoly board test", () => {
    test("Whether BINUS exists", () => {
        expect(property).toEqual(expect.anything());
    })
})