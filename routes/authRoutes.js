const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Sign-In Route
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🛠 Received Sign-In Request");
        console.log("📩 Email from request:", email);
        console.log("🔑 Password from request:", password);

        if (!email || !password) {
            console.warn("❌ Missing email or password");
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("🔍 Checking database for email:", email);

        // Find user in database
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.warn("❌ User not found in DB:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ User found in database:", user.email);
        
        // 🛠 **DEBUG: Log Passwords Before Comparison**
        console.log("🔍 Comparing Entered Password:", password);
        console.log("🔍 Comparing Hashed Password in DB:", user.password);

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("🔍 Password Match Result:", isMatch ? "✅ Matched" : "❌ Not Matched");

        if (!isMatch) {
            console.warn("❌ Password mismatch for user:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Login successful!");
        res.status(200).json({ message: "Sign-In Successful!" });

    } catch (error) {
        console.error("🔥 Server error during sign-in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ Sign-Up Route (Fix)
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("📝 Signing up:", email);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn("❌ User already exists:", email);
            return res.status(409).json({ error: "User already exists" });
        }

        // ✅ Create the user (mongoose will auto-hash the password)
        const newUser = new User({ email, password });
        await newUser.save();

        console.log("✅ User registered successfully:", email);

        res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error("🔥 Server error during sign-up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
