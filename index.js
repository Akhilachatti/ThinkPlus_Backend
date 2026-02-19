require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect DB
connectDB();

const app = express();

// ----------------------
// ✅ CORS CONFIGURATION
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",                   // Local Vite frontend
  "https://think-plus-frontend.vercel.app/"         // ⬅️ Replace with your Vercel URL after deployment
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ----------------------
// API ROUTES
// ----------------------
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/recommendation", require("./routes/recommendationRoutes"));
app.use("/api/topics", require("./routes/topicRoutes"));

// ----------------------
// SERVER LISTEN
// ----------------------
const PORT = process.env.PORT || 5000; // Render uses dynamic port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
