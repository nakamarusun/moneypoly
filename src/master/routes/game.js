const express = require("express");
const superagent = require("superagent");
const validator = require("validator");
const { getRedis } = require("../../redisdb");
const { genAlphanum } = require("../../util");

const { aiBuyPath } = require("../ai/buypredictor");

const { genToken } = require("../../interserver/inter");

const IDLENGTH = 5; // Room id length
const WORKERPREFIX = "/io";

// List of workers available for this server to contact.
const WORKERS = process.env.WORKERS.split(",");

const router = express.Router();

// Helper function to create a new user id
// This will repeat if an identical id is created.
function newRoomId(cl, req, res) {
  const id = genAlphanum(IDLENGTH);

  // Check for same ids
  cl.exists(id, (err, rep) => {
    if (err) return res.sendStatus(500);
    if (rep) return newRoomId(cl, req, res); // If id existed, recreate id

    const server = WORKERS[Math.floor(Math.random() * WORKERS.length)]; // Select random server

    // Send request to the worker server
    const reqUrl = server + WORKERPREFIX + "/new";
    superagent
      .post(reqUrl)
      .set({
        Authorization: "Bearer " + genToken(),
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send({
        room: id
      })
      .end((err, resp) => {
        // TODO: Handle server reject / error
        if (err || resp.statusCode === 500) return res.sendStatus(500);

        cl.hmset(
          id,
          "server",
          server,
          "expire",
          Date.now() + process.env.ROOMEXPIRE * 1000,
          (err, rep) => {
            if (err) return res.sendStatus(500);

            // TODO: Make sure the server is available
            console.log("Room allocated: " + id);

            // Send back the room id and server.
            res.status(201);
            res.send({
              room: id,
              server: server
            });
          }
        );
        // Add to room list
        cl.lpush("rml", id);
      });
  });
}

// Responds with a room code, and the server associated with it.
router.post("/new", (req, res) => {
  // Check if post is valid
  try {
    if (req.body.room !== "newroom") throw Error;
  } catch (err) {
    return res.sendStatus(400);
  }

  const cl = getRedis();
  newRoomId(cl, req, res);
});

// Responds with a server that hosts the game.
router.post("/join", (req, res) => {
  if (!("room" in req.body)) return res.sendStatus(404);
  if (!validator.isAlphanumeric(req.body.room)) return res.sendStatus(404); // AlNum checks

  // Room
  const room = req.body.room.toLowerCase();

  const cl = getRedis();
  cl.hget(room, "server", (err, rep) => {
    if (err) return res.sendStatus(500);
    if (!rep) return res.sendStatus(204);

    res.status(200);
    res.send({
      server: rep
    });
  });
});

router.get("/buymodel", (req, res) => {
  res.sendFile(aiBuyPath);
});

module.exports = router;
