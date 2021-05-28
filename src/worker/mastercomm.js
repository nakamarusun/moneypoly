const express = require("express");
const { getRedis } = require("../redisdb");
const { RoomStatus } = require("./roomstatus");

const router = express.Router();

// Creates a new room in the database.
router.post("/new", (req, res) => {
  const cl = getRedis();
  const room = req.body.room;

  cl.get(room, (err, rep) => {
    if (err) return res.sendStatus(500);
    if (rep) return res.sendStatus(500); // If room already existed

    cl.set(room, RoomStatus.READY, (err, rep) => {
      if (err) return res.sendStatus(500);

      // TODO: Prepare the room

      res.sendStatus(202);
    });
  });
});

router.post("/join", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
