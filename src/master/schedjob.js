// Module to schedule and do stuff.
const { getRedis } = require("../redisdb");

const { genToken } = require("../interserver/inter");

const superagent = require("superagent");

// Interval of time to check and free rooms.
const FREEROOMSSECONDS = 60;

// Free list to send to workers
let freeList = {};

function freeRooms() {
  console.log("Free room: Initiating free room");
  freeList = {};
  for (const server of process.env.WORKERS.split(",")) {
    freeList[server] = [];
  }

  const cl = getRedis();
  cl.lrange("rml", 0, -1, (err, rep) => {
    if (err || !rep) return;

    const rooms = rep;
    for (const room of rooms) {
      cl.hmget(room, "server", "expire", (err, resp) => {
        if (err || !resp) return;
        // If not expired yet, then insert the server to "keep list"
        if (resp[1] > Date.now()) {
          try {
            freeList[resp[0]].push(room);
          } catch (err) {
            console.log("No server: " + resp[0]);
          }
        } else {
          // If expired, delete from redis.
          // TODO: Move this to the response to the delete request
          cl.del(room);
          cl.lrem("rml", 1, room);
        }
      });
    }
  });

  // Send requests to workers to keep rooms.
  setTimeout(() => {
    for (const server in freeList) {
      const reqUrl = server + "/io/keeprooms";
      superagent
        .post(reqUrl)
        .set({
          Authorization: "Bearer " + genToken(),
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .send(JSON.stringify(freeList[server]))
        .end();
    }
  }, 5000);
}

module.exports.initSchedules = function () {
  setInterval(freeRooms, FREEROOMSSECONDS * 1000);
};

module.exports.freeRooms = freeRooms;
