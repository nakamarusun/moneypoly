//import propertyList from "./propertydata.js";
import Player from "./Player.js";
const PLAYERS = ["Hat", "Bike", "Salt", "Boat"];
let makeBoardTile = (name, type) => {
  return { name: name, type: type }; // type would be property, gacha tile(?), or others
};
export default class Board {
  constructor() {
    this.board;
  }

  initBoard = (boardSize) => {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push(makeBoardTile("", ""));
    }
    board[0] = makeBoardTile("Start", "Property");
    board[1] = makeBoardTile("Taman Safari", "Property");
    board[2] = makeBoardTile("Gacha", "Gacha");
    board[3] = makeBoardTile("Ancol", "Property");
    board[4] = makeBoardTile("Instant -100", "Others");
    board[5] = makeBoardTile("Gacha", "Gacha");
    board[6] = makeBoardTile("Museum Macan", "Property");
    board[7] = makeBoardTile("Gacha", "Gacha")
    board[8] = makeBoardTile("Museum Wayang", "Property");
    board[9] = makeBoardTile("Sea World", "Property");
    board[10] = makeBoardTile("Free Parking", "Others");
    board[11] = makeBoardTile("Taman Mini", "Property");
    board[12] = makeBoardTile("Gacha", "Gacha");
    board[13] = makeBoardTile("Taman Menteng", "Property");
    board[14] = makeBoardTile("Museum Indonesia", "Property");
    board[15] = makeBoardTile("Gacha", "Gacha");
    board[16] = makeBoardTile("Monas", "Property");
    board[17] = makeBoardTile("Gacha", "Gacha");
    board[18] = makeBoardTile("Taman Suropati", "Property");
    board[19] = makeBoardTile("BINUS Square", "Property");
    board[20] = makeBoardTile("Free Parking", "Others");
    board[21] = makeBoardTile("Senayan City", "Property");
    board[22] = makeBoardTile("Gacha", "Gacha");
    board[23] = makeBoardTile("BINUS Senayan", "Property");
    board[24] = makeBoardTile("Senayan Park", "Property");
    board[25] = makeBoardTile("Gacha", "Gacha");
    board[26] = makeBoardTile("Plaza Senayan", "Property");
    board[27] = makeBoardTile("Gelora Bung Karno", "Property");
    board[28] = makeBoardTile("Gacha", "Gacha");
    board[29] = makeBoardTile("Taman Mangrove", "Property");
    board[30] = makeBoardTile("Go to Jail", "Others");
    board[31] = makeBoardTile("BINUS Alam Sutera", "Property");
    board[32] = makeBoardTile("Merdeka Square", "Property");
    board[33] = makeBoardTile("Gacha", "Gacha");
    board[34] = makeBoardTile("Planetarium Jakarta", "Property");
    board[35] = makeBoardTile("Gacha", "Gacha");
    board[36] = makeBoardTile("Gacha", "Gacha");
    board[37] = makeBoardTile("Bundaran HI", "Property");
    board[38] = makeBoardTile("Instant -100", "Others");
    board[39] = makeBoardTile("Hotel Indonesia", "Property");
    this.board = board;
  }

  // function gets called when game starts
  initGame = (playerSize) => {
    const players = [];
    if (playerSize < 2 || playerSize > 4) {
      console.log("invalid amount of players");
      return;
    }

    for (let i = 0; i < playerSize; i++) {
      const player = new Player(PLAYERS[i]);
      player.rollValue = player.roll();
      players.push(player);
    }

    players.sort((a, b) => {
      return a.rollValue < b.rollValue;
    });
    console.log(players);
  }
}

