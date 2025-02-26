require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes"); // Import auth routes

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*", // Or specify frontend URL like "http://localhost:5173"
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow frontend cookies and auth headers
};

app.use(cors(corsOptions));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yogaDB";  
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Default Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;  // Use environment variable or default to 3000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


// For Vercel Deployment
module.exports = app;
