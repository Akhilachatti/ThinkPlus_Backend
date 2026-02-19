exports.getProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await QuizAttempt.find({ userId })
      .sort({ attemptedAt: -1 })
      .limit(5);  // 🔥 last 5 attempts

    const formatted = attempts.map((a) => ({
      date: a.attemptedAt.toISOString().split("T")[0],
      score: a.score,
    }));

    res.json({
      attempts: formatted,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Progress fetch failed" });
  }
};
