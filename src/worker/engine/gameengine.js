const { getRedis } = require("../../redisdb");
const { RoomStatus } = require("../roomstatus");
const { dcClientError, notif } = require("./sockutil");
const { genToken } = require("../../interserver/inter");
const { getBoard, setBoard, createBoard } = require("./gameref");
const superagent = require("superagent");
// const util = require("../../util");

// Socket io reference
let io;

function bindEvents(sock) {
  sock.on("kickplayer", kickplayer);
  sock.on("startgame", startGame);
  sock.on("disconnect", onDisconnect);
  // sock.on("addbot", undefined); // TODO

  sock.on("game:roll", gameRoll);
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

function broadcastGameboard(room, board) {
  io.in(room).emit("updateboard", board.returnBoard());
}

/**
 * Game stuff
 */
// Called when player sends a roll command.
function gameRoll() {
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;

  getBoard(room).then((res) => {
    const player = res.checkTurn();

    // Can't roll if not rollable.
    if (!res.checkTurn().rollable) return notif(this, 1, "Cannot roll.");

    // Move the player in the board
    player.move();
    player.checkPosition();

    // Emit to player
    broadcastGameboard(room, res);

    // Save board
    setBoard(room, res);
  });
}

/**
 * Waiting room stuff
 */
function startGame() {
  const room = this.handshake.query.room;
  const cl = getRedis();
  // Check if player is enough to start the game.

  cl.hmget(room, "count", "data", "boardref", (err, rep) => {
    if (err || !rep) return;
    if (rep[0] < 2) return; // Not enough player
    if (rep[2]) return; // Game has started

    // Check if the sending player is the host.
    const obj = JSON.parse(rep[1]);
    if (obj.host !== this.handshake.query.uname) return;

    cl.hset(room, "status", RoomStatus.STARTED);

    // Create request to master to delete the room.
    const turl = process.env.MASTERSERVER + "/io/delrooms";
    superagent
      .post(turl)
      .set({
        Authorization: "Bearer " + genToken(),
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send([room])
      .end();

    // Create board object
    const game = createBoard({
      players: obj.players
    });

    // Save the board to reference manager
    setBoard(room, game);

    // Start the game here
    io.in(room).emit("startgame"); // Useless for now
    broadcastGameboard(room, game);
  });
}

function onDisconnect(reason) {
  // Confirm if the sending player is the host.
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;
  const cl = getRedis();

  // Clear the database entry
  cl.hmget(room, "status", "data", (err, rep) => {
    if (err || !rep) return;

    // If game hasnt started yet
    if (parseInt(rep[0]) !== RoomStatus.STARTED) {
      const obj = JSON.parse(rep[1]);
      // Erase player from data
      obj.players.splice(obj.players.indexOf(uname), 1);
      // Save object
      cl.hset(room, "data", JSON.stringify(obj));
      // Decrement player count
      cl.hincrby(room, "count", -1, (err, rep) => {
        if (err || !rep) return;
        // Set room status to full
        cl.hset(room, "status", RoomStatus.POPULATED);
      });

      // Resend object
      sendPlayerList(obj, io.in(room));
    } else {
      // If game has started
      // TODO: Handle disconnect when game is going on
    }
  });
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

      // Decrement player count
      cl.hincrby(room, "count", -1, (err, rep) => {
        if (err || !rep) return;
        // Set room status to full
        cl.hset(room, "status", RoomStatus.POPULATED);
      });
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
      cl.hset(room, "data", JSON.stringify(obj), "count", 1);

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

          // Incr player count
          cl.hincrby(room, "count", 1, (err, rep) => {
            if (err || !rep) return;
            // Set room status to full
            if (rep >= 4) cl.hset(room, "status", RoomStatus.FULL);
          });
        }

        // Send player list to room
        sendPlayerList(obj, io.in(room));
      });
    } else if (status === RoomStatus.FULL || status === RoomStatus.STARTED) {
      dcClientError(sock, "Room is full!");
    }
  });
};
