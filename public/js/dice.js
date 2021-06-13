class Piece {

  constructor(pieceHTML, xOffset, yOffset) {
    this.$piece = pieceHTML
    this.boxLength = 96
    this.rectLength = 57
    this.position = 29
    this.jail = false

    this.xOffset = xOffset
    this.yOffset = yOffset
    this.move(0)
  }
  
  positionPiece(x, y) {
    this.$piece.style.transform = `translate(
      ${x}px,
      ${y}px)`
    console.log(this.position)
  }

  jailPiece() {
    this.$piece.style.animation = "toJail 2s both";

  }

 

  move(randomNumber) {
    const num = this.position + randomNumber
    this.position = (num) > 39 ?
          (num) - 40 : num

    const coef = Math.floor((this.position)/10)
    const place = this.position % 10

    

    switch (coef) {
      case 0:
        this.positionPiece(
          this.rectLength * place + (place > 0 ? this.xOffset : 0),
          0
        )
        break;
      case 1:
        this.positionPiece(
          this.rectLength * 10 + this.xOffset,
          -this.rectLength * place - (place > 0 ? this.yOffset : 0)
        )
        if (this.position === 10) {
          this.position = 30;
          this.jail = true;
          this.jailPiece();
        }
        break;
      case 2:
        this.positionPiece(
          (this.rectLength * 10 + this.xOffset) - (this.rectLength * place),
          -this.rectLength * 10 - this.yOffset
        )
        
        break;
      case 3:
        
        this.positionPiece(
          0,
          (-this.rectLength * 10 - this.yOffset) + this.rectLength * place
        )

        if (this.position === 30){
          document.getElementById("piece-1").style.transform = `translate(-7px, -598px)`;
          document.getElementById("piece-2").style.transform = `translate(-40px, -630px)`;
          document.getElementById("piece-3").style.transform = `translate(-7px, -594px)`;
          document.getElementById("piece-4").style.transform = `translate(0px, -660px)`;
      }
        break;
    }
    
    
  }

}

const piece1 = new Piece(document.getElementById("piece-1"), 34, 18);
const piece2 = new Piece(document.getElementById("piece-2"), 17, 18);
const piece3 = new Piece(document.getElementById("piece-3"), 34, 24);
const piece4 = new Piece(document.getElementById("piece-4"), 17, 24);

// eslint-disable-next-line no-unused-vars
function rollDice(turn) {
  let total = 0
  const dice = [...document.querySelectorAll(".die-list")];
  dice.forEach(die => {
    toggleClasses(die);
    die.dataset.roll = getRandomNumber(1, 6);
    total = total + parseInt(die.dataset.roll)
  });
  // if(turn === 1){
  //   piece1.move(total)
  // }
  // else if(turn === 2){
  //   piece2.move(total)
  // }
  // else if(turn === 3){
  //   piece3.move(total)
  // }
  // else if(turn === 4){
  //   piece4.move(total)
  // }
  console.log(total)
  piece1.move(1)
  piece2.move(1)
  piece3.move(1)
  piece4.move(1)
}


  
function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
  
  document.getElementById("roll-button").addEventListener("click", rollDice);