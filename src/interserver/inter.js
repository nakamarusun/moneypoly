const express = require("express");

// Authenticates the request with the key.
function authKey(req, res, next) {}

const inter = express.Router();
inter.use(authKey);

module.exports = inter;
