// eslint-disable-next-line no-unused-vars
const Board = require("../../game/board");

const { spawn } = require("child_process");

const propertyList = require("../../game/propertydata.js");

/**
 * Gets the row values for input to the AI
 * @param {Board} board
 * @returns {[]}
 */
function getRowValues(board) {
  const builder = [];

  const current = board.checkTurn();

  // Get money left
  builder.push(current.balance);

  // Get property cost
  const currentProperty = board.board[current.position];
  const prop = propertyList.find((a) => {
    return a.name === currentProperty.name;
  });
  if (!prop) return undefined;
  builder.push(prop.price);

  // Get opponent average balance
  let bal = 0.0;
  for (const player of board.players) {
    bal += player.balance;
  }
  bal /= board.players.length;
  builder.push(bal);

  // Get distance to go
  builder.push(40 - current.position);

  // Get distance to opponent's property
  // TODO
  builder.push(40);

  return builder;
}

/**
 *
 * @param {array} rowValues
 * @returns {Promise<boolean>}
 */
function getAIBuyPrediction(rowValues) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.env.PYTHON, [
      process.env.BUYMODELPATH,
      process.env.BUYMODELSCRIPT,
      ...rowValues
    ]);
    proc.stdout.on("data", function (data) {
      const res = data.toString();
      resolve(res.trim() === "1");
    });
    proc.stderr.on("data", (data) => {
      console.log("Error getting AI result, using random fallback");
      resolve(Math.random() > 0.5);
    });
  });
}

module.exports.getRowValues = getRowValues;
module.exports.getAIBuyPrediction = getAIBuyPrediction;
