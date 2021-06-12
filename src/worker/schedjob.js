// Module to schedule and do stuff.
const { getRedis } = require("../redisdb");
const { RoomStatus } = require("./roomstatus");

const { genToken } = require("../interserver/inter");

const superagent = require("superagent");

// Interval of time to check and free rooms.
const FREEROOMSSECONDS = 60;

// Room which is not in the server
let delRoomSet = [];

function freeRooms() {
  console.log("Free room: Initiating free room");

  delRoomSet = [];
  const cl = getRedis();
  cl.lrange("rml", 0, -1, (err, rep) => {
    if (err || !rep) return;

    // Clear room if they have expired.
    for (const room of rep) {
      cl.hmget(room, "status", "expire", (err, repl) => {
        if (err || !rep) return;
        // If the room is not full, then schedule for deletion
        if (repl[0] !== RoomStatus.FULL && repl[1] < Date.now()) {
          delRoomSet.push(room);
          cl.del(room);
          cl.lrem("rml", 1, room);
        }
      });
    }
  });

  // Schedule a HTTP request to master server which rooms are active.
  setTimeout(() => {
    if (delRoomSet.length === 0) return;
    const reqUrl = process.env.MASTERSERVER + "/io/roomreport";
    superagent
      .post(reqUrl)
      .set({
        Authorization: "Bearer " + genToken(),
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send(JSON.stringify(delRoomSet))
      .end();
    console.log(`Free room: ${delRoomSet}`);
  }, 5000);
}

module.exports.initSchedules = function () {
  setInterval(freeRooms, FREEROOMSSECONDS * 1000);
};

module.exports.freeRooms = freeRooms;
