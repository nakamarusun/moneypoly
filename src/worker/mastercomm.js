const express = require("express");

const router = express.Router();

router.post("/new", (req, res) => {
  res.sendStatus(200);
});

router.post("/join", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
