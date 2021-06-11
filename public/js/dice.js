

// eslint-disable-next-line no-unused-vars
function rollDice() {
    let total = 0
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach(die => {
      toggleClasses(die);
      die.dataset.roll = getRandomNumber(1, 6);
      total = total + parseInt(die.dataset.roll)
    });
    console.log(total)
    move(piece1, total)
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
  
const piece1 = document.getElementById("piece-1");
const piece2 = document.getElementById("piece-2");
const piece3 = document.getElementById("piece-3");
const piece4 = document.getElementById("piece-4");

function move(piece, randomNumber) {
  piece.style.transform = `translate(
      ${randomNumber*50}px,
      ${0}px)`
}


