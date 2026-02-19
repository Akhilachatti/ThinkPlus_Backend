const express = require("express");
const router = express.Router();
const { getProgress } = require("../controllers/progressController");
const protect = require("../Middleware/authMiddleware");

router.get("/", protect, getProgress);



module.exports = router;
