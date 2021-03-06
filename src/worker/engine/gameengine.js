const { getRedis } = require("../../redisdb");
const { RoomStatus } = require("../roomstatus");
const { dcClientError, notif } = require("./sockutil");
const { genToken } = require("../../interserver/inter");
const { getBoard, setBoard, createBoard, deleteRoom } = require("./gameref");
const superagent = require("superagent");
const { getAIBuyPrediction, getRowValues } = require("./gameai");
// const util = require("../../util");

const BOTNAMES = [
  "Duncan",
  "Jordy",
  "Shayla",
  "Bobby",
  "Jane",
  "Eileen",
  "Augustin",
  "Antoinette",
  "Mikoto",
  "Saito",
  "Nikolav"
];

// Socket io reference
let io;

function bindEvents(sock) {
  sock.on("kickplayer", kickplayer);
  sock.on("startgame", startGame);
  sock.on("disconnect", onDisconnect);
  sock.on("addbot", addBot);

  sock.on("game:roll", gameRoll);
  sock.on("game:next", gameNext);
  sock.on("game:buy", gameBuy);
  sock.on("game:upgrade", gameUpgrade);
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

function runAI(board, player, room) {
  // Run the bots
  while (!Number.isInteger(player) && player.isBot) {
    player.move(board);
    if (player.action === 1) {
      // Run the AI
      if (getAIBuyPrediction(getRowValues(board))) {
        player.buy(board);
      }
    } else if (player.action === 2) {
      if (getAIBuyPrediction(getRowValues(board))) {
        player.upgrade(board);
      }
    }
    broadcastGameboard(room, board);
    player = board.nextTurn();
  }
  return player;
}

// Called when player sends a roll command.
function gameRoll() {
  console.log("Roll");
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;

  getBoard(room)
    .then((res) => {
      const player = res.checkTurn();

      // Can't roll if not rollable or not the player calling it.
      if (!player.rollable || player.uname !== uname) {
        console.log("Cannot roll");
        return notif(this, 1, "Cannot roll.");
      }

      // // If in jail, move the player.
      // if (player.status === 1) {
      //   player.move(res);
      // }

      // Check jail
      const pStatus = player.status;

      // Move the player in the board
      console.log(player.move(res));

      // Check if player is no longer in jail. If out of jail, move the player again.
      if (pStatus === 1 && player.status === 0) {
        player.move(res);
      }

      // player.checkPosition();

      // Emit to player
      broadcastGameboard(room, res);

      // Save board
      setBoard(room, res);
    })
    .catch((errP) => {
      console.log(errP);
    });
}

// TODO: Resolve action once action is done.

function gameNext() {
  console.log("Next");
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;

  getBoard(room)
    .then(async (res) => {
      const player = res.checkTurn();

      // Can't next if not turn or not the player calling it.
      if (player.uname !== uname) return notif(this, 1, "Can not next");

      // Already checks if the next player lost or not.
      let p = res.nextTurn();

      // Run the bots
      p = runAI(res, p, room);

      if (Number.isInteger(p)) {
        // Broadcast the winner
        console.log("We got a winner!");

        // Push the final guy
        res.losers.push(res.players[p].uname);

        // Emit leaderboard
        io.in(room).emit("winner", res.losers);

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

        // Emit the AI data gathered to the master server.
        const cl = getRedis();
        cl.hget(room, "aidata", (err, resp) => {
          if (err || !resp) return deleteRoom(room);
          console.log("Sending ai buy data to master");
          const turl = process.env.MASTERSERVER + "/io/aibuydata";
          superagent
            .post(turl)
            .set({
              Authorization: "Bearer " + genToken(),
              "Content-Type": "application/json",
              Accept: "application/json",
              "Worker-Name": process.env.WORKERNAME
            })
            .send({ data: resp })
            .end((err) => {
              if (err) console.log("Error sending ai data to main");
              console.log("Deleting room reference");
              // Delete all room references
              deleteRoom(room);
            });
        });
      } else {
        // Save board
        setBoard(room, res);
      }

      // Emit to player
      broadcastGameboard(room, res);
    })
    .catch((errP) => {
      console.log(errP);
    });
}

function gameBuy(data) {
  console.log("Buy");
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;

  getBoard(room)
    .then((res) => {
      const player = res.checkTurn();

      // Can't next if not turn or not the player calling it.
      if (player.uname !== uname) return notif(this, 1, "Not allowed");

      // Get AI data
      const aiData = getRowValues(res);

      // If buy
      if (data.act) {
        const canBuy = res.checkTurn().buy(res);
        if (!canBuy) notif(this, 1, "Cannot buy this property!");

        // Push data
        aiData.push(canBuy ? 1 : 0);
      } else {
        // Push data
        aiData.push(0);
      }

      // Push data to redis
      const cl = getRedis();
      cl.hget(room, "aidata", (err, res) => {
        if (err) return;
        cl.hset(room, "aidata", res + aiData + "\n");
      });

      gameNext.bind(this)();
    })
    .catch((errP) => {
      console.log(errP);
    });
}

function gameUpgrade(data) {
  console.log("Upgrade");
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;

  getBoard(room)
    .then((res) => {
      const player = res.checkTurn();

      // Can't next if not turn or not the player calling it.
      if (player.uname !== uname) return notif(this, 1, "Not allowed");

      // Get AI data
      const aiData = getRowValues(res);

      // If buy
      if (data.act) {
        const canBuy = res.checkTurn().upgrade(res);
        if (!canBuy) notif(this, 1, "Cannot upgrade this property!");

        // Push data
        aiData.push(canBuy ? 1 : 0);
      } else {
        // Push data
        aiData.push(0);
      }

      // Push data to redis
      const cl = getRedis();
      cl.hget(room, "aidata", (err, res) => {
        if (err) return;
        cl.hset(room, "aidata", res + aiData + "\n");
      });

      gameNext.bind(this)();
    })
    .catch((errP) => {
      console.log(errP);
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

    cl.hmset(room, "status", RoomStatus.STARTED, "aidata", "\n");

    // Create board object
    const game = createBoard({
      players: obj.players
    });

    // Run the bots
    const p = game.checkTurn();
    runAI(game, p, room);

    // Save the board to reference manager
    setBoard(room, game);

    // Start the game here
    io.in(room).emit("startgame");
    broadcastGameboard(room, game);
  });
}

function addBot() {
  const botName =
    "[BOT] " + BOTNAMES[Math.floor(Math.random() * BOTNAMES.length)];
  const room = this.handshake.query.room;
  const cl = getRedis();

  console.log(`Room called addBot: ${room}`);

  // Gets the board data to see whether the command is valid.
  cl.hget(room, "status", (err, rep) => {
    if (err || !rep) return;

    // Check the status if not started and full
    const status = parseInt(rep);
    if (status === RoomStatus.FULL && status === RoomStatus.STARTED) return;

    cl.hget(room, "data", (err, rep) => {
      if (err || !rep) return;

      // Parse the data
      const obj = JSON.parse(rep);

      // Add bot to the game
      obj.players.push({
        n: botName,
        b: true
      });
      // Save
      cl.hset(room, "data", JSON.stringify(obj));

      // Incr player count
      cl.hincrby(room, "count", 1, (err, rep) => {
        if (err || !rep) return;
        // Set room status to full
        if (rep >= 4) cl.hset(room, "status", RoomStatus.FULL);
      });

      // Send player list to room
      sendPlayerList(obj, io.in(room));
    });
  });
}

function onDisconnect(reason) {
  // Confirm if the sending player is the host.
  const uname = this.handshake.query.uname;
  const room = this.handshake.query.room;
  const cl = getRedis();

  console.log(this.id + " Disconnected");

  // Clear the database entry
  cl.hmget(room, "status", "data", (err, rep) => {
    if (err || !rep) return;

    // If game hasnt started yet
    if (parseInt(rep[0]) !== RoomStatus.STARTED) {
      try {
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
      } catch (err) {
        console.log(err);
      }
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
  cl.hmget(room, "status", "count", (err, rep) => {
    if (err || !rep) return;

    const status = parseInt(rep[0]);
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
      cl.hmset(room, "data", JSON.stringify(obj), "count", 1);

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
    } else if (status === RoomStatus.FULL || parseInt(rep[1]) >= 3) {
      dcClientError(sock, "Room is full!");
    } else if (status === RoomStatus.STARTED) {
      // Check if player is already in the game. If not, reject.
      cl.hget(room, "data", (err, rep) => {
        if (err || !rep) return;

        // Parse the data
        const obj = JSON.parse(rep);

        // If player with the same name is not found, then reject.
        if (
          !obj.players.find((x) => {
            return x.n === uname;
          })
        ) {
          dcClientError(sock, "Error connecting");
        }

        // TODO: Handle a user with the same name is already in the game.

        // Tell the client the game has started.
        sendPlayerList(obj, sock);
        sock.emit("startgame");
        getBoard(room)
          .then((board) => {
            sock.emit("updateboard", board.returnBoard());
          })
          .catch((errP) => {
            console.log(errP);
          });
      });
    }
  });
};
