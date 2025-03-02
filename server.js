require("dotenv").config(); // ✅ Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// ✅ Define CORS properly
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ MongoDB Connection with Retry Mechanism
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in the environment variables!");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB Atlas");
    console.log("🗄️ Using Database:", mongoose.connection.name); // Debugging line

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("❌ Server startup error:", err);
});

module.exports = app;
