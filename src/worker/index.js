// Load environment variables
require("dotenv").config({ path: "./worker.env" });

const fs = require("fs");
const sio = require("socket.io");
const sior = require("socket.io-redis");
const express = require("express");

const engine = require("./engine/engine");
const comm = require("./mastercomm");

// Create the express app
const app = express();

// Allow CORS from master server
app.use(
  require("cors")({
    origin: process.env.MASTERSERVER
  })
);

// Parser
app.use(express.json({ limit: "1mb" })); // JSON decoder
app.use(
  express.urlencoded({
    extended: true
  })
); // URL format decoder

// Register routes
app.use("/io", comm);

require("../redisdb").prefix = `wm${process.env.WORKERNAME}:`;

// Load SSL certificates, if exists
const sslFileAvailable = (process.env.KEY && process.env.CERT) !== undefined;
const serverOpt = sslFileAvailable
  ? {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT)
    }
  : undefined;

// Load either HTTP / HTTPS module
const serverModule = sslFileAvailable ? require("https") : require("http");

// Create HTTP server and listen
const port = process.env.PORT || 8080;
const server = serverModule.createServer(serverOpt, app).listen(port, () => {
  console.log(
    `Listening to localhost:${port}. HTTPS Status: ${sslFileAvailable}`
  );
});

// Listen to WS connections
const io = sio(server, {
  cors: {
    // CORS is a must
    origin: process.env.MASTERSERVER,
    methods: ["GET", "POST"]
  }
});

io.adapter(
  sior({
    host: "localhost",
    port: process.env.REDISPORT || 6379
  })
);

engine(io); // Initialize game server
