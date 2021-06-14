const { getRedis } = require("../redisdb");

const inter = require("../interserver/inter").router;

// Frees the room in the master database.
inter.post("/delrooms", (req, res) => {
  const cl = getRedis();

  // Active rooms in the other server
  const otherRooms = req.body;
  console.log(req.body);
  for (const room of otherRooms) {
    cl.lrem("rml", 1, room);
    cl.del(room);
  }

  res.sendStatus(200);
});

module.exports = inter;
