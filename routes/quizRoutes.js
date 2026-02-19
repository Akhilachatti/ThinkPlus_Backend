const express = require("express");
const router = express.Router();
const {
  getQuestionsByTopic,
  submitQuiz,
} = require("../controllers/quizController");

const protect = require("../Middleware/authMiddleware");

router.get("/:topicId", protect, getQuestionsByTopic);
router.post("/submit", protect, submitQuiz);

module.exports = router;
