const express = require("express");

const { getRedis } = require("../../redisdb");
const { genAlphanum } = require("../../util");

const router = express.Router();

// Room id length
const IDLENGTH = 5;

// Helper function to create a new user id
function newRoomId(cl, req, res) {
  const id = genAlphanum(IDLENGTH);

  // Check for same ids
  cl.exists(id, (err, rep) => {
    if (err) throw err;

    // If id existed, recreate id
    if (rep) {
      newRoomId(cl, req, res);
      return;
    }
    // TODO: Use redis namespaces
    cl.set(id, "yes");

    // Send request to the worker server
    // TODO: Round Robin time

    // Send back the room id and server.
    res.send({
      room: id
    });
  });
}

router.post("/new", (req, res) => {
  const cl = getRedis();
  newRoomId(cl, req, res);
});

router.post("/join", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
