// routes/players.js

const express = require("express");
const router = express.Router();

router.get("/activities", async (req, res) => {
  try {
    res.status(200).json({
      data: 'données tests'
    });
  } catch (err) {
    res.status(400).json({
      message: "Oops, there's a problem...",
      err
    });
  }
});

module.exports = router;
