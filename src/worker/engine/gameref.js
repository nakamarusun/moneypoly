const { getRedis } = require("../../redisdb");
const { promisify } = require("util");
const Board = require("../../game/board");
const Player = require("../../game/player");

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
 * @returns {Promise<Board>} board
 */
module.exports.getBoard = async function (room) {
  // Try to get from object
  if (room in roomBoard) return roomBoard[room];

  // Try to get from redis
  const cl = getRedis();
  const pr = promisify(cl.hget).bind(cl);
  const rep = await pr(room, "boardref");

  // If not in redis, make the board. and store it.
  if (!rep) {
    return Promise.reject(rep);
  }

  // Load the data from redis
  const obj = JSON.parse(rep);

  // Parse player
  for (const i in obj.players) {
    obj.players[i] = Object.assign(new Player(), obj.players[i]);
  }

  // Parse board
  roomBoard[room] = Object.assign(new Board(), obj);

  // insert it to roomBoard
  return roomBoard[room];
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
