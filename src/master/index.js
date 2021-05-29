// Load environment variables
require("dotenv").config({ path: "./master.env" });

const express = require("express");
const path = require("path");
const fs = require("fs");

const gamerouter = require("./routes/game");

// Create the express app
const app = express();

// Static directory
const publicDir = path.join(__dirname, "../../public");

// Serve static files
app.use(
  express.static(publicDir, {
    extensions: ["html", "htm"],
  })
);

// Parser
app.use(express.json({ limit: "1mb" })); // JSON decoder
app.use(
  express.urlencoded({
    extended: true,
  })
); // URL format decoder

// Register routes
app.use("/game", gamerouter);

// Setup redis
require("../redisdb").prefix = "mm:";

// Load SSL certificates, if exists
const sslFileAvailable = (process.env.KEY && process.env.CERT) !== undefined;
const serverOpt = sslFileAvailable
  ? {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT),
    }
  : undefined;

// Load either HTTP / HTTPS module
const serverModule = sslFileAvailable ? require("https") : require("http");

// Create HTTP server and listen
const port = process.env.PORT || 8080;
serverModule.createServer(serverOpt, app).listen(port, () => {
  console.log(
    `Listening to localhost:${port}. HTTPS Status: ${sslFileAvailable}`
  );
});
