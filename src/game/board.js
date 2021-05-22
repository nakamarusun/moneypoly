import propertyList from './propertydata';
import Player from './Player';
const PLAYERS = ["Hat", "Bike", "Salt", "Boat"];
makeBoardTile = (name, type) => {
    return {name: name, type: type}; //type would be property, gacha tile(?), or others
}
export default class Board {
    constructor(){
        this.board;
    }


    initBoard(boardSize){
        let board = []
        for (let i = 0; i < boardSize; i++){
            board.push(makeBoardTile("", ""));
        } 
        //TODO add actually board tiles

        this.board = board;
    }

    //function gets called when game starts
    initGame(playerSize){
        let players = [];
        if(playerSize < 2 || playerSize > 4){
            console.log("invalid amount of players");
            return;
        }
        
        for(let i = 0; i < playerSize; i++){
            var player = new Player(PLAYERS[i]);
            player.rollValue = player.roll();
            players.push(player);
        }
       
        players.sort((a, b) => {
            return a.rollValue < b.rollValue
        })
        console.log(players);
    }


}