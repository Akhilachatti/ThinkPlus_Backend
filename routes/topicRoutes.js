const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");

router.get("/", async (req, res) => {
  const topics = await Topic.find();
  res.json(topics);
});

module.exports = router;
