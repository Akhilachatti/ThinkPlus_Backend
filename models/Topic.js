const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topicName: String,
  difficultyLevel: String, // Beginner, Intermediate, Advanced
});

module.exports = mongoose.model("Topic", topicSchema);
