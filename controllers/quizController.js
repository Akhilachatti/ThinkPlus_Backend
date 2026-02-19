const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const generateRecommendation = require("../services/recommendationService");

exports.getQuestionsByTopic = async (req, res) => {
  try {
    const questions = await Question.find({
      topicId: req.params.topicId,
    }).select("-correctAnswer");

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 get from token
    const { topicId, answers } = req.body;

    const questions = await Question.find({ topicId });

    let correctCount = 0;
    let incorrectQuestions = [];

    questions.forEach((question) => {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      if (userAnswer && userAnswer.selectedOption === question.correctAnswer) {
        correctCount++;
      } else {
        incorrectQuestions.push({
          questionText: question.questionText,
          correctAnswer: question.correctAnswer,
        });
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    await QuizAttempt.create({
      userId,
      topicId,
      score,
      difficulty: "Auto",
      incorrectQuestions,
    });

    const recommendation = await generateRecommendation(userId);

    res.json({
      score,
      ...recommendation,
    });
  } catch (error) {
    res.status(500).json({ message: "Quiz submission failed" });
  }
};
