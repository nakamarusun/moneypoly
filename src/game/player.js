const propertyList = require("./propertydata.js");
const gachaMoney = [50, 100, 150, 200];
class Player {
  // each player will have a piece, balance, list of properties they control and their status jialed or not.
  constructor(piece, activeBoard) {
    this.piece = piece;
    this.balance = 1000;
    this.properties = [];
    this.status = 0; // 0 === free, 1 === jailed, 2 === lost
    this.jailCD = 0;
    this.position = 0; // a player's position on the board
    this.rollValue; // saves the player's roll value
    this.activeBoard = activeBoard;
    this.action; // 1 = buy, 2 = upgrade, 3 = gacha, 4 = tax, 5 = jail, 6 = pay
    this.uname; // Username of the user.
    this.rollable = false; // Whether the user can roll or not.
  }

  // method for a player to buy a property, this method checks if the property if owned yet or not
  buy() {
    if (this.status === 2) {
      // return "you have lost this game you cannot act anymore";
      return false;
    } else {
      if (this.activeBoard[this.position].type === "Property") {
        const property = propertyList.find((a) => {
          return a.name === this.activeBoard[this.position].name;
        });
        console.log(property);
        // if property is already owned player can't buy the property
        if (property.status === "owned") {
          // TODO make a popup to say that property is owned or disable the button if there is one
          console.log("Property is already owned");
          return false;
        } else {
          // if property is not owned, function checks if player has enough money to buy the property if they do,
          // property status becomes owned player's balance gets deducted and the property gets pushed into the properties array of the player.
          if (this.balance > property.price) {
            property.status = "owned";
            this.balance = this.balance - property.price;
            property.price = property.price * 2;
            this.properties.push(property);
            property.owner = this.piece;
            return true;
          } else {
            // TODO make a popup saying player does not have enough money
            return false;
          }
        }
      } else {
        console.log("You are not on a property tile");
        return false;
      }
    }
  }

  roll() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const roll = [dice1, dice2];
    return roll;
  }

  // function to mortgage or downgrade a property's level
  sell(property) {
    if (this.status === 2) {
      return "you have lost this game you cannot act anymore";
    } else {
      const prop = propertyList.find((a) => {
        return a.name === this.activeBoard[property].name;
      });
      if (this.properties.includes(prop)) {
        if (prop.level < 1) {
          // TODO make popup saying property already at lowest level
          console.log("Property already at the lowest level");
        } else {
          prop.level -= 1;
          this.balance += prop.price * 0.25;
          prop.price = prop.price / 2;
        }
      } else {
        // TODO make popup saying you don't own this property or smth
        console.log("You don't own this property");
      }
    }
  }

  // function to upgrade a property's level
  upgrade() {
    const prop = propertyList.find((a) => {
      return a.name === this.activeBoard[this.position].name;
    });
    if (this.properties.includes(prop)) {
      if (prop.level > 4) {
        // TODO make popup saying property already at highest level
        console.log("Property already at the highest level");
        return false;
      } else {
        prop.level += 1;
        this.balance -= prop.price;
        prop.price = prop.price * 2;
        return true;
      }
    } else {
      // TODO make popup saying you don't own this property or smth
      console.log("You don't own this property");
      return false;
    }
  }

  // function to move a player's position on the baord
  move() {
    if (!this.rollable) return;
    this.rollable = false;

    if (this.status === 1) {
      const rollJail = this.roll();
      if ((rollJail[0] = rollJail[1])) {
        this.status = 0;
        this.jailCD = 0;
      } else {
        this.jailCD -= 1;
      }
      if (this.jailCD === 0) {
        this.status = 0;
      }
    } else if (this.status === 2) {
      console.log("you have lost this game you cannot act anymore");
      return "you have lost this game you cannot act anymore";
    } else {
      const rollMove = this.roll();
      this.position = this.position + rollMove[1] + rollMove[0];
      this.rollValue = rollMove;
      if (this.position > 39) {
        this.position = this.position - 40;
        this.balance += 200;
        console.log(
          "You passed through the start tile you will be awarded $200"
        );
      }
      this.checkPosition(this.activeBoard);
      return rollMove[0], rollMove[1];
    }
  }

  gachaTile() {
    // gacha ios simplified to add or decrease money
    // roll1 determines if gacha is add or decrease
    // roll1 === 0 is add and roll1 === 1 is decrease
    const roll1 = Math.floor(Math.random() * 2);
    const roll2 = Math.floor(Math.random() * 4);
    if (roll1 === 0) {
      this.balance += gachaMoney[roll2];
      console.log("You have gained $" + gachaMoney[roll2]);
    } else {
      this.balance -= gachaMoney[roll2];
      console.log("You have lost $" + gachaMoney[roll2]);
    }
  }

  // method to check the position of the player, used for identifying if the player is on a special tile
  checkPosition() {
    if (this.activeBoard[this.position].type === "Gacha") {
      this.gachaTile();
      this.action = 3;
    } else if (this.activeBoard[this.position].name === "Instant -100") {
      this.balance -= 100;
      this.action = 4;
    } else if (this.activeBoard[this.position].name === "Go to Jail") {
      this.status = 1;
      this.position = 10;
      this.jailCD = 2;
      this.action = 5;
    } else if (this.activeBoard[this.position].type === "Property") {
      const property = propertyList.find((a) => {
        return a.name === this.activeBoard[this.position].name;
      });
      if (property.owner === undefined || property.owner === "") {
        this.action = 1;
      } else if (property.owner === this.piece) {
        console.log("You are the owner of this property! :)");
        this.action = 2;
      } else {
        this.action = 6;
        console.log(
          "You are not the owner of this property, your balance will be deducted accordingly"
        );
        this.balance -= property.price / 5;
        if (!this.balance >= property.price) {
          console.log(
            "You do not have enough money to pay the player, you have lost this game"
          );
          for (let i = 0; i < this.properties.length; i++) {
            this.properties[i].owner = "";
            this.properties[i].status = "free";
          }
          this.status = 2;
        }
      }
    }
  }
}

module.exports = Player;
