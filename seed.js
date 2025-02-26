const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/yogaDB"; // ✅ Ensure correct DB name

(async function createTestUser() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    if (!User) {
      throw new Error("❌ User model is not defined. Check your schema!");
    }

    // ✅ Check if the test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });

    if (existingUser) {
      console.warn("⚠️ Test user already exists! Skipping creation.");
    } else {
      console.log("🔑 Hashing password...");
      const hashedPassword = await bcrypt.hash("123456", 10);

      console.log("📝 Creating test user...");
      await User.create({ email: "test@example.com", password: hashedPassword });

      console.log("✅ Test user created successfully!");
    }
  } catch (error) {
    console.error("🔥 Error:", error);
  } finally {
    console.log("🔌 Closing MongoDB connection...");
    mongoose.connection.close();
  }
})();
