import Property from './property';
class Player {
    //each player will have a piece, balance, list of properties they control and their status jialed or not.
    constructor(piece) {
        this.piece = piece;
        this.balance = 400;
        this.properties = [];
        this.status = "free"; //other status is "jailed"
    }
    //method for a player to buy a property, this method checks if the property if owned yet or not
    buy = (property) => {
        //if property is already owned player can't buy the property
        if(property.status === "owned"){
            //TODO make a popup to say that property is owned or disable the button if there is one
        }
        else{
            //if property is not owned, function checks if player has enough money to buy the property if they do,
            //property status becomes owned player's balance gets deducted and the property gets pushed into the properties array of the player.
            if(this.balance > property.price){
                property.status = "owned";
                this.balance = this.balance - property.price;
                this.properties.push(property);
            }
            else{
                //TODO make a popup saying player does not have enough money
            }

        }
    }

    roll = () => {
        let roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
        return roll;
    }



};