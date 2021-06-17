const { getRedis } = require("../redisdb");
const { RoomStatus } = require("./roomstatus");

const inter = require("../interserver/inter").router;

// Creates a new room in the database.
inter.post("/new", (req, res) => {
  const cl = getRedis();
  const room = req.body.room;

  cl.hget(room, "status", (err, rep) => {
    if (err) return res.sendStatus(500);
    if (rep) return res.sendStatus(500); // If room already existed

    cl.hmset(
      room,
      "status",
      RoomStatus.READY,
      "created",
      Date.now(),
      (err, rep) => {
        if (err) return res.sendStatus(500);

        // Insert room in the array
        cl.sadd("rml", room);

        res.sendStatus(202);
      }
    );
  });
});

// Creates a new room in the database.
inter.post("/keeprooms", (req, res) => {
  const cl = getRedis();

  // Active rooms in the other server
  const otherRooms = req.body;
  cl.smembers("rml", (err, rep) => {
    if (err || !rep) return;
    for (const room of rep) {
      cl.hmget(room, "status", "created", (err, resp) => {
        if (err || !resp) return;

        if (!otherRooms.includes(room)) {
          // Dont delete rooms that has game started,
          // or the room has been created within 30 seconds
          if (
            parseInt(resp[0]) === RoomStatus.STARTED ||
            Date.now() < parseInt(resp[1]) + 30000
          )
            return;
          console.log("Deleting room " + room);
          cl.srem("rml", room);
          cl.del(room);
        }
      });
    }
  });

  res.sendStatus(200);
});

inter.post("/join", (req, res) => {
  res.sendStatus(200);
});

module.exports = inter;
