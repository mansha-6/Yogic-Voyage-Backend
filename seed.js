const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/yoga_users"; // ✅ Ensure correct DB name

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      console.log("⚠️ Test user already exists!");
      mongoose.connection.close();
      return;
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Insert user
    await User.create({ email: "test@example.com", password: hashedPassword });

    console.log("✅ Test user created successfully!");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error:", err));
