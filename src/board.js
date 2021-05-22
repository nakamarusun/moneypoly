import propertyList from "./propertydata";
import Player from "./Player";
makeBoardTile = (name, type) => {
  return { name: name, type: type }; //type would be property, gacha tile(?), or others
};
class Board {
  constructor() {
    this.board;
  }

  initBoard(boardSize) {
    let board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push(makeBoardTile("", ""));
    }
    //TODO add actually board tiles

    this.board = board;
  }

  //function gets called when game starts
  initGame(playerSize) {
    let players = [];
    switch (playerSize) {
      case 2:
        let player1 = new Player("Hat");
        let player2 = new Player("Bike");
        players.push(player1, player2);
        break;
      case 3:
        let player1 = new Player("Hat");
        let player2 = new Player("Bike");
        let player3 = new Player("Salt");
        players.push(player1, player2, player3);
        break;
      case 4:
        let player1 = new Player("Hat");
        let player2 = new Player("Bike");
        let player3 = new Player("Salt");
        let player4 = new Player("Boat");
        players.push(player1, player2, player3, player4);
        break;
    }

    for (let i = 0; i < playerSize.length(); i++) {
      let value = playerSize[i].roll();
      playerSize[i].rollValue = value;
    }
  }
}
