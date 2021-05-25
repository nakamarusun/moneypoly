// Load environment variables
require("dotenv").config({ path: "./worker.env" });

const fs = require("fs");
const engine = require("./engine");
const sio = require("socket.io");
const sior = require("socket.io-redis");

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
const server = serverModule.createServer(serverOpt).listen(port, () => {
  console.log(
    `Listening to localhost:${port}. HTTPS Status: ${sslFileAvailable}`
  );
});

// Register routes

// Listen to WS connections
const io = sio().listen(server);
io.adapter(
  sior({
    host: "localhost",
    port: process.env.REDISPORT || 6379
  })
);

engine(io); // Initialize game server
console.log("Server started!");
