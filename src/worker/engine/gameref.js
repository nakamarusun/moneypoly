const { getRedis } = require("../../redisdb");
const Board = require("../../game/board");

// Temporary reference to store moneypoly game object
const roomBoard = {};

// Get a new moneypoly game

/* players:[
    {
        n: 
    }
]
*/
/**
 *
 * @param {[Object]} players
 * @returns {Board}
 */
module.exports.createBoard = function (players) {
  const p = players.players;
  const b = new Board();
  b.initBoard(40);

  // Insert names
  const names = [];
  p.forEach((item, i) => {
    names.push(item.n);
  });

  // Create the game.
  b.initGame(names);

  //   b.players[0].move();
  return b;
};

/**
 *
 * @param {string} room
 * @returns {Board} board object
 */
module.exports.getBoard = function (room) {
  // Try to get from object
  if (room in roomBoard) return roomBoard[room];

  // Try to get from redis
  const cl = getRedis();
  cl.hget(room, "boardref", (err, rep) => {
    if (err) return undefined;

    // If not in redis, make the board. and store it.
    if (!rep) {
      return undefined;
    }

    // Load the data from redis, and insert it to roomBoard
    // TODO: player object assign too.
    roomBoard[room] = Object.assign(new Board(), JSON.parse(rep));
    return roomBoard[room];
  });
};

/**
 *
 * @param {string} room
 * @param {Board} obj
 */
module.exports.setBoard = async function (room, obj) {
  const cl = getRedis();
  roomBoard[room] = obj;
  cl.hset(room, "boardref", JSON.stringify(obj));
};
