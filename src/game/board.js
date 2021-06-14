const propertyList = require("./propertydata.js");
const Player = require("./player.js");
const PLAYERS = ["Hat", "Bike", "Salt", "Boat"];
const makeBoardTile = (name, type) => {
  return { name: name, type: type }; // type would be property, gacha tile(?), or others
};

class Board {
  constructor() {
    this.board;
    this.players = [];
    this.turn = 0;
  }

  initBoard(boardSize) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push(makeBoardTile("", ""));
    }
    board[0] = makeBoardTile("Start", "Others");
    board[1] = makeBoardTile("Taman Safari", "Property");
    board[2] = makeBoardTile("Gacha", "Gacha");
    board[3] = makeBoardTile("Ancol", "Property");
    board[4] = makeBoardTile("Instant -100", "Others");
    board[5] = makeBoardTile("Gacha", "Gacha");
    board[6] = makeBoardTile("Museum Macan", "Property");
    board[7] = makeBoardTile("Gacha", "Gacha");
    board[8] = makeBoardTile("Museum Wayang", "Property");
    board[9] = makeBoardTile("Sea World", "Property");
    board[10] = makeBoardTile("Jail", "Others");
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
  initGame(playerSize) {
    const names = Array.isArray(playerSize) ? playerSize : undefined;
    if (names) playerSize = names.length;

    if (playerSize < 2 || playerSize > 4) {
      console.log("invalid amount of players");
      return;
    }

    for (let i = 0; i < playerSize; i++) {
      const player = new Player(PLAYERS[i], this.board);
      const rollOrder = player.roll();
      player.rollValue = rollOrder;
      this.players.push(player);
    }

    // Assign player names
    if (names) {
      this.players.forEach((item, i) => {
        item.uname = names[i];
      });
    }

    this.players.sort((a, b) => {
      return (
        b.rollValue[0] + b.rollValue[1] - (a.rollValue[0] + a.rollValue[1])
      );
    });

    // Set first person dice to be rollable.
    this.checkTurn().rollable = true;
  }

  returnBoard() {
    const playerList = [];
    const boardState = propertyList;
    const turnNumber = this.turn;
    const currentPlayer = this.checkTurn();
    for (let i = 0; i < this.players.length; i++) {
      playerList.push(this.players[i]);
    }
    switch (currentPlayer.action) {
      case 1:
        const actionType1 = {
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "Do you want to buy this property"
        };
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          actionType: actionType1
        };
      case 2:
        const actionType2 = {
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "Do you want to upgrade this property"
        };
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          actionType: actionType2
        };
      case 3:
        const actionType3 = {
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg:
            "You have landed on a gacha tile, money will randomly be added or subtracted from your balance"
        };
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          actionType: actionType3
        };
      case 4:
        const actionType4 = {
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "You have been taxed, your balance will be reduced by 100"
        };
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          actionType: actionType4
        };
      case 5:
        const actionType5 = {
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "The police have arrested you, you will now be sent to jail"
        };
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          actionType: actionType5
        };
      default:
        return { boardState, playerList, turnNumber };
    }
  }

  /**
   *
   * @returns {Player}
   */
  checkTurn() {
    return this.players[this.turn % this.players.length];
  }

  /**
   *
   * @returns {Player}
   */
  nextTurn() {
    this.turn += 1;

    // Set the player to be able to roll
    const player = this.players[this.turn % this.players.length];
    player.rollable = true;

    return player;
  }
}

module.exports = Board;
