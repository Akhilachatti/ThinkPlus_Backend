const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  questionText: String,
  options: [String],
  correctAnswer: String,
});

module.exports = mongoose.model("Question", questionSchema);
