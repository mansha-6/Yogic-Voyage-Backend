const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/yogaDB"; // Ensure correct DB name

console.log("🔗 Connecting to MongoDB...");

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      console.log("⚠️ Test user already exists!");
      mongoose.connection.close();
      return;
    }

    console.log("🔑 Hashing password...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    console.log("🛠 Creating test user...");
    await User.create({ email: "test@example.com", password: hashedPassword });

    console.log("✅ Test user created successfully!");
    console.log("🔌 Closing MongoDB connection...");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error:", err));
