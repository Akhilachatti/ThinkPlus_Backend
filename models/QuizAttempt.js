const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
  },
  incorrectQuestions: [
    {
      questionText: String,
      correctAnswer: String,
    },
  ],
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
