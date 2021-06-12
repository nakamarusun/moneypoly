const { getRedis } = require("../redisdb");

const inter = require("../interserver/inter").router;

// Creates a new room in the database.
inter.post("/roomreport", (req, res) => {
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
