const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Sign-In Route
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("❌ Missing email or password");
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        console.log("🔍 Checking email:", email);

        // Find user in DB
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ User found. Stored hashed password:", `"${user.password}"`);
        console.log("🔍 Entered Password (trimmed):", `"${password.trim()}"`);
        console.log("🛠 Comparing bcrypt.compare(password, user.password)...");

        // Compare input password with stored hash
        const isMatch = await bcrypt.compare(password.trim(), user.password);

        console.log("🔄 bcrypt.compare result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Password matched! Logging in...");
        res.status(200).json({ message: "Sign-In Successful!" });

    } catch (error) {
        console.error("🔥 Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// ✅ Sign-Up Route
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        console.log("🔑 Received Plain Password:", password);

        // ❌ Do NOT hash password here (Mongoose will do it in `pre("save")`)
        const newUser = new User({ email, password });

        await newUser.save();
        console.log("✅ User registered successfully:", email);
        console.log("✅ Stored Hashed Password in DB (After Saving):", newUser.password);

        res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error("🔥 Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
