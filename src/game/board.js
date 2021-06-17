const PropertyList = require("./propertydata.js");
const Player = require("./player.js");
const PLAYERS = ["Car", "Hat", "Shoe", "Iron"];
const makeBoardTile = (name, type) => {
  return { name: name, type: type, owner: "" }; // type would be property, gacha tile(?), or others
};

class Board {
  constructor() {
    this.board = undefined;
    this.players = [];
    this.turn = 0;
    this.losers = [];
    this.propertyList = new PropertyList();
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
    board[4] = makeBoardTile("Museum Macan", "Property");
    board[5] = makeBoardTile("Instant -100", "Others");
    board[6] = makeBoardTile("Gacha", "Gacha");
    board[7] = makeBoardTile("Museum Wayang", "Property");
    board[8] = makeBoardTile("Gacha", "Gacha");
    board[9] = makeBoardTile("Sea World", "Property");
    board[10] = makeBoardTile("Go to Jail", "Others");

    board[11] = makeBoardTile("BINUS Square", "Property");
    board[12] = makeBoardTile("Taman Suropati", "Property");
    board[13] = makeBoardTile("Gacha", "Gacha");
    board[14] = makeBoardTile("Monas", "Property");
    board[15] = makeBoardTile("Gacha", "Gacha");
    board[16] = makeBoardTile("Museum Indonesia", "Property");
    board[17] = makeBoardTile("Taman Menteng", "Property");
    board[18] = makeBoardTile("Gacha", "Gacha");
    board[19] = makeBoardTile("Taman Mini", "Property");
    board[20] = makeBoardTile("Free Parking", "Others");

    board[21] = makeBoardTile("Taman Mangrove", "Property");
    board[22] = makeBoardTile("Gacha", "Gacha");
    board[23] = makeBoardTile("Gelora Bung Karno", "Property");
    board[24] = makeBoardTile("Plaza Senayan", "Property");
    board[25] = makeBoardTile("Gacha", "Gacha");
    board[26] = makeBoardTile("Senayan Park", "Property");
    board[27] = makeBoardTile("BINUS Senayan", "Property");
    board[28] = makeBoardTile("Gacha", "Gacha");
    board[29] = makeBoardTile("Senayan City", "Property");
    board[30] = makeBoardTile("Jail", "Others");

    board[31] = makeBoardTile("BINUS Alam Sutera", "Property");
    board[32] = makeBoardTile("Merdeka Square", "Property");
    board[33] = makeBoardTile("Gacha", "Gacha");
    board[34] = makeBoardTile("Ragunan Zoo", "Property");
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
      const player = new Player(PLAYERS[i]);
      const rollOrder = player.roll();
      player.rollValue = rollOrder;
      this.players.push(player);
    }

    // Assign player names
    if (names) {
      this.players.forEach((item, i) => {
        item.uname = names[i].n;
        item.isBot = names[i].b;
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
    const boardState = this.propertyList;
    const turnNumber = this.turn % this.players.length;
    const currentPlayer = this.checkTurn();
    for (let i = 0; i < this.players.length; i++) {
      playerList.push(this.players[i]);
    }
    switch (currentPlayer.action) {
      case 1: {
        const actionType1 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "Do you want to buy this property"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType1,
          losers: this.losers,
          board: this.board
        };
      }
      case 2: {
        const actionType2 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "Do you want to upgrade this property"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType2,
          losers: this.losers,
          board: this.board
        };
      }
      case 3: {
        const actionType3 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          amount: currentPlayer.gachaCost,
          msg:
            "You have landed on a gacha tile, money will randomly be added or subtracted from your balance"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType3,
          losers: this.losers,
          board: this.board
        };
      }
      case 4: {
        const actionType4 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "You have been taxed, your balance will be reduced by 100"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType4,
          losers: this.losers,
          board: this.board
        };
      }
      case 5: {
        const actionType5 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "The police have arrested you, you will now be sent to jail"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType5,
          losers: this.losers,
          board: this.board
        };
      }
      case 6: {
        const actionType6 = {
          player: this.turn % this.players.length,
          piece: currentPlayer.piece,
          action: currentPlayer.action,
          msg: "You must pay for this property!"
        };
        this.checkTurn().action = 0;
        return {
          boardState: boardState,
          playerList: playerList,
          turnNumber: turnNumber,
          turnTotal: this.turn,
          actionType: actionType6,
          losers: this.losers,
          board: this.board
        };
      }
      default: {
        this.checkTurn().action = 0;
        return {
          boardState,
          playerList,
          turnNumber,
          actionType: {},
          turnTotal: this.turn,
          losers: this.losers,
          board: this.board
        };
      }
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
    let count = 0;
    const curPlayer = this.turn % this.players.length;
    console.log("Begin turn: " + curPlayer);

    // Skip players which has bankrupted
    let player;
    do {
      this.turn++;
      count++;
      player = this.players[this.turn % this.players.length];
      console.log("Next player");
    } while (player.status === 2 && count < 4);

    // Set the player to be able to roll
    this.players[this.turn % this.players.length].rollable = true;

    console.log("Begin turn: " + (this.turn % this.players.length));

    // We got a winner if the loop goes back.
    if (curPlayer === this.turn % this.players.length) {
      return curPlayer;
    }

    return player;
  }
}

module.exports = Board;
