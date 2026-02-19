const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  currentLevel: String,
  difficultyAdjustment: String,

  currentTopicRecommendation: {
    message: String,
    weakAreas: [
      {
        questionText: String,
        correctAnswer: String,
      },
    ],
  },

  overallAnalysis: {
    strongTopics: [String],
    weakTopics: [String],
  },

  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
