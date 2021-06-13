const { getRedis } = require("../../redisdb");
const { RoomStatus } = require("../roomstatus");
const { dcClientError } = require("./sockutil");
// const util = require("../../util");

// Socket io reference
let io;

function bindEvents(sock) {
  sock.on("kickplayer", kickplayer);
  // sock.on("addbot", undefined); // TODO
}

function sendPlayerList(obj, sock) {
  const arrLoad = [];

  for (const pl of obj.players) {
    arrLoad.push({
      name: pl.n,
      bot: pl.b,
      host: pl.n === obj.host
    });
  }

  const payload = { players: arrLoad };
  sock.emit("updateplayerlist", payload);
}

function kickplayer(data) {
  // Confirm if the sending player is the host.
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;
  const cl = getRedis();

  cl.hget(room, "data", (err, rep) => {
    if (err || !rep) return;

    const obj = JSON.parse(rep);
    // If the host issues this command
    if (obj.host === uname) {
      // Erase player from data
      obj.players.splice(data.player, 1);

      // Save object
      cl.hset(room, "data", JSON.stringify(obj));
    }

    // Resend object
    sendPlayerList(obj, io.in(room));
  });
}

module.exports.initGame = function (_io) {
  io = _io;
};

// On connect
module.exports.onConnect = function (sock) {
  // Bind events
  bindEvents(sock);

  const room = sock.handshake.query.room;
  const uname = sock.handshake.query.uname;
  const cl = getRedis();

  // Insert player into the data object.
  cl.hget(room, "status", (err, rep) => {
    if (err || !rep) return;

    const status = parseInt(rep);
    // If no player, make the current player the host.
    if (status === RoomStatus.READY) {
      cl.hset(room, "status", RoomStatus.POPULATED);

      const obj = {
        host: uname,
        players: [
          {
            n: uname, // Username
            b: false // Bot or not
          }
        ]
      };
      cl.hset(room, "data", JSON.stringify(obj));

      // Send player list to room
      sendPlayerList(obj, io.in(room));
    } else if (status === RoomStatus.POPULATED) {
      cl.hget(room, "data", (err, rep) => {
        if (err || !rep) return;

        // Parse the data
        const obj = JSON.parse(rep);

        // TODO: Check player ID sent from server

        // If player is not already in the room, add the data.
        if (
          !obj.players.find((x) => {
            return x.n === uname;
          })
        ) {
          // Add player
          obj.players.push({
            n: uname,
            b: false
          });
          cl.hset(room, "data", JSON.stringify(obj));
        }

        // Send player list to room
        sendPlayerList(obj, io.in(room));
      });
    } else if (status === RoomStatus.FULL) {
      dcClientError(sock, "Room is full");
    }
  });
};
