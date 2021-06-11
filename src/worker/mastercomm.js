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
      "expire",
      Date.now() + process.env.ROOMEXPIRE * 1000,
      (err, rep) => {
        if (err) return res.sendStatus(500);

        // Insert room in the array
        cl.lpush("rml", room);

        // TODO: Prepare the room

        res.sendStatus(202);
      }
    );
  });
});

inter.post("/join", (req, res) => {
  res.sendStatus(200);
});

module.exports = inter;
