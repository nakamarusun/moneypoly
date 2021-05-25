const express = require("express");
const jwt = require("jsonwebtoken");

const EXPIRETIME = 30 * 1000;

/**
 *
 * @param {Number} expires expires in epoch time
 * @returns Token string that will expire in `expires` seconds.
 */
function genToken(expires = EXPIRETIME) {
  const payload = {
    exp: Date.now() + expires
  };

  return jwt.sign(payload, process.env.JWTKEY);
}

function authToken(token) {
  try {
    return jwt.verify(token, process.env.JWTKEY);
  } catch (err) {
    return false;
  }
}

// Authenticates the request with the key.
function authMiddleware(req, res, next) {
  // Check token validity
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  // Verify token
  const verify = authToken(token);
  if (verify && verify.exp > Date.now()) {
    next();
  } else {
    return res.sendStatus(403);
  }
}

const inter = express.Router();
inter.use(authMiddleware);

module.exports.router = inter;
module.exports.genToken = genToken;
module.exports.authToken = authToken;
