const QuizAttempt = require("../models/QuizAttempt");
const Topic = require("../models/Topic");

// 🔥 K-Means Inspired Clustering
const assignCluster = (avgScore) => {
  const centroids = [
    { value: 30, level: "Beginner" },
    { value: 60, level: "Intermediate" },
    { value: 85, level: "Advanced" },
  ];

  let closest = centroids[0];
  let minDistance = Math.abs(avgScore - centroids[0].value);

  centroids.forEach((centroid) => {
    const distance = Math.abs(avgScore - centroid.value);
    if (distance < minDistance) {
      minDistance = distance;
      closest = centroid;
    }
  });

  return closest.level;
};

const generateRecommendation = async (userId) => {
  const attempts = await QuizAttempt.find({ userId })
    .sort({ attemptedAt: -1 })
    .limit(3);

  if (attempts.length === 0) {
    return {
      currentLevel: "Beginner",
      difficultyAdjustment: "Maintain",
      currentTopicRecommendation: {
        message:
          "Start practicing topics to receive personalized recommendations.",
        weakAreas: [],
      },
      overallAnalysis: {
        strongTopics: [],
        weakTopics: [],
      },
    };
  }

  // 🎯 Average Score (Recent Attempts)
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const avgScore = totalScore / attempts.length;

  const currentLevel = assignCluster(avgScore);

  // 🎯 Difficulty Adjustment
  let difficultyAdjustment;
  if (currentLevel === "Beginner") difficultyAdjustment = "Decrease";
  else if (currentLevel === "Intermediate") difficultyAdjustment = "Maintain";
  else difficultyAdjustment = "Increase";

  // 🎯 Current Attempt Recommendation
  const latestAttempt = attempts[0];

  let message;
  let weakAreas = [];

  if (latestAttempt.score >= 75) {
    message =
      "You have sufficient knowledge in this subject. Try exploring other subjects.";
  } else if (latestAttempt.score >= 50) {
    message = "You need improvement in these areas:";
    weakAreas = latestAttempt.incorrectQuestions;
  } else {
    message =
      "You need to improve more. Practice again and strengthen your fundamentals.";
    weakAreas = latestAttempt.incorrectQuestions;
  }

  // 🎯 Overall Topic Analysis
  const allAttempts = await QuizAttempt.find({ userId });

  const topicPerformance = {};

  allAttempts.forEach((attempt) => {
    if (!topicPerformance[attempt.topicId]) {
      topicPerformance[attempt.topicId] = [];
    }
    topicPerformance[attempt.topicId].push(attempt.score);
  });

  let weakTopicIds = [];
  let strongTopicIds = [];

  for (let topicId in topicPerformance) {
    const scores = topicPerformance[topicId];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avg < 50) weakTopicIds.push(topicId);
    if (avg >= 75) strongTopicIds.push(topicId);
  }

  const weakTopics = await Topic.find({ _id: { $in: weakTopicIds } });
  const strongTopics = await Topic.find({ _id: { $in: strongTopicIds } });

  return {
    currentLevel,
    difficultyAdjustment,
    currentTopicRecommendation: {
      message,
      weakAreas,
    },
    overallAnalysis: {
      strongTopics: strongTopics.map((t) => t.topicName),
      weakTopics: weakTopics.map((t) => t.topicName),
    },
  };
};

module.exports = generateRecommendation;
