require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ----------------------
// ✅ CORS CONFIGURATION
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://think-plus-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ❌ REMOVE THIS (Express 5 breaks on "*")
// app.options("*", cors());

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);