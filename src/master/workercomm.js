const { getRedis } = require("../redisdb");
const mkdirp = require("mkdirp");
const fs = require("fs");

const inter = require("../interserver/inter").router;
const buyAi = require("./ai/buypredictor");

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

inter.post("/aibuydata", (req, res) => {
  // Create instance file to store all the AI stuff
  mkdirp(path.dirname(buyAi.aiBuyPath), () => {
    fs.writeFile(
      buyAi.aiBuyPath,
      buyAi.aiBuyBase,
      { flag: "wx" },
      function (err) {
        if (err) throw err;
        console.log("Buy AI file created!");

        // Append to AI file
        fs.appendFile(buyAi.aiBuyPath, req.body, () => {
          console.log(
            `Successfully appended AI buy data from worker (${req.header(
              "Worker-Name"
            )})`
          );
          res.sendStatus(200);
        });
      }
    );
  });
});

module.exports = inter;
