// Module to schedule and do stuff.
const { getRedis } = require("../redisdb");
const { RoomStatus } = require("./roomstatus");

// Interval of time to check and free rooms.
const FREEROOMSSECONDS = 60;

function freeRooms() {
  const cl = getRedis();
  cl.lrange("rml", 0, -1, (err, rep) => {
    if (err || !rep) return;

    // Clear room if they have expired.
    for (const room of rep) {
      cl.hmget(room, "status", "expire", (err, repl) => {
        if (err || !rep) return;
        // If the room is not full, then schedule for deletion
        if (repl[0] !== RoomStatus.FULL && repl[1] < Date.now()) {
          cl.del(room);
          cl.lrem("rml", room);
          // TODO: send query to master server to delete the rooms too
        }
      });
    }
  });
}

module.exports.initSchedules = function () {
  setInterval(freeRooms, FREEROOMSSECONDS * 1000);
};
