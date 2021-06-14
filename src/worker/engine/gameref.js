const { getRedis } = require("../../redisdb");
const Board = require("../../game/board");

// Temporary reference to store moneypoly game object
const roomBoard = {};

// Get a new moneypoly game
function startMoneypoly() {
  const b = new Board();
  b.initBoard(40);
  b.initGame(4);

  b.players[0].move();
  return b;
}

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
      roomBoard[room] = startMoneypoly();
      cl.hset(room, "boardref", JSON.stringify(roomBoard[room]));
      return roomBoard[room];
    }

    // Load the data from redis, and insert it to roomBoard
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
