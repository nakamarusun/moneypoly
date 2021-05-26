import Property from './property.js';
import Board from './board.js';
import {propertyList} from './propertydata.js'
let board1 = new Board();
let gachaMoney = [50, 100, 150, 200];
board1.initBoard(39);
export default class Player {
  // each player will have a piece, balance, list of properties they control and their status jialed or not.
  constructor(piece) {
    this.piece = piece;
    this.balance = 400;
    this.properties = [];
    this.status = "free"; // other status is "jailed"
    this.position = 0; // a player's position on the board
    this.rollValue; // saves the player's roll value
  }

  // method for a player to buy a property, this method checks if the property if owned yet or not
  buy(property) {
    if(board1.board[this.position].type === "Property"){
      let property = propertyList.find((a) => {return a.name === board1.board[this.position].name});
      // if property is already owned player can't buy the property
      if (property.status === "owned") {
        // TODO make a popup to say that property is owned or disable the button if there is one
        console.log("Property is already owned");
      } else {
        // if property is not owned, function checks if player has enough money to buy the property if they do,
        // property status becomes owned player's balance gets deducted and the property gets pushed into the properties array of the player.
        if (this.balance > property.price) {
          property.status = "owned";
          this.balance = this.balance - property.price;
          this.properties.push(property);
        } else {
          // TODO make a popup saying player does not have enough money
        }
      }
    }
    else{
      console.log("You are not on a property tile");
    }
  }

  roll() {
    const roll = Math.floor(Math.random() * 6) + 1 + (Math.floor(Math.random() * 6) + 1);
    return roll;
  }

    //function to mortgage or downgrade a property's level
    sell = (property) => {
      let property = propertyList.find((a) => {return a.name === board1.board[this.position].name});
        if (this.properties.includes(property)){
            if (property.level < 1){
                //TODO make popup saying property already at lowest level
                console.log("Property already at the lowest level");
            }
            else{
                property.level -= 1;
                this.balance += (property.price * 0.5);
                property.price = (property.price / 2);
            }
        }
        else {
            //TODO make popup saying you don't own this property or smth
            console.log("You don't own this property");
        } 
    }
  

    //function to upgrade a property's level
    upgrade = (property) => {
        if (this.properties.includes(property)){
            if (property.level > 4){
                //TODO make popup saying property already at highest level
                console.log("Property already at the highest level");
            }
            else{
                property.level += 1;
                this.balance -= (property.price);
                property.price = (property.price * 2);
            }
        }
        else {
            //TODO make popup saying you don't own this property or smth
            console.log("You don't own this property");
        } 
    }

    //function to move a player's position on the baord
    move = () => {
        this.position += this.roll();
        if(this.position > 39){
            this.position = this.position - 40;
            this.balance += 200;
        }
        return this.position; 
    }

    gachaTile = () => {
      //gacha ios simplified to add or decrease money
      //roll1 determines if gacha is add or decrease
      //roll1 === 0 is add and roll1 === 1 is decrease
      const roll1 = Math.floor(Math.random() * 2);
      const roll2 = Math.floor(Math.random() * 4);
      if(roll1 === 0){
        this.balance += gachaMoney[roll2];
      }
      else{
        this.balance -= gachaMoney[roll2];
      }
    }

    checkPosition = () => {
      return this.position;
    }
  }
