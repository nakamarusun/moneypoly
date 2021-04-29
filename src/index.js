// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");

// Create the express app
const app = express();

// Static directory
const publicDir = path.join(__dirname, "./../public");

// Serve static files
app.use(express.static(publicDir));

// Load SSL certificates, if exists
const sslFileAvailable = (process.env.KEY && process.env.CERT) !== undefined;
const serverOpt = sslFileAvailable
  ? {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT)
    }
  : undefined;

// Load either HTTP / HTTPS module
const serverModule =
  sslFileAvailable === undefined ? require("http") : require("https");

// Create HTTP server and listen
const port = process.env.PORT || 8080;
const server = serverModule.createServer(serverOpt, app).listen(port, () => {
  console.log(`Listening to ${port}. HTTPS Status: ${sslFileAvailable}`);
});

// Listen to WS connections
require("socket.io")().listen(server);
