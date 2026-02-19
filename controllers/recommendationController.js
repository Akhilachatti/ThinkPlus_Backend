const generateRecommendation = require("../services/recommendationService");
const Recommendation = require("../models/Recommendation");

exports.getRecommendation = async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 from token

    const data = await generateRecommendation(userId);

    await Recommendation.create({
      userId,
      currentLevel: data.currentLevel,
      difficultyAdjustment: data.difficultyAdjustment,
      currentTopicRecommendation: data.currentTopicRecommendation,
      overallAnalysis: data.overallAnalysis,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Recommendation failed" });
  }
};
