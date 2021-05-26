import {propertyList} from "../src/game/propertydata.js";
import Player from "../src/game/Player.js";
//import Property from '../src/game/property.js';
import Board from '../src/game/board.js'; 

// TODO make new file
let board1 = new Board();

board1.initBoard(39);

let property = propertyList.find((a) => {return a.name === "BINUS Square"});
// start game with 4 players
console.log(property);
// test every single possibilities