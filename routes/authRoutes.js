const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Sign-In Route
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validate input fields
        if (!email || !password) {
            console.warn("❌ Missing email or password");
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("🔍 Checking email:", email);

        // ✅ Find user in DB (Include password for validation)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.warn("❌ User not found");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ User found. Checking password...");

        // ✅ Compare input password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.warn("❌ Password does not match");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Password matched! Logging in...");

        res.status(200).json({ message: "Sign-In Successful!" });

    } catch (error) {
        console.error("🔥 Server error during sign-in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Sign-Up Route
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validate input fields
        if (!email || !password) {
            console.warn("❌ Missing email or password");
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("🔍 Checking if user exists:", email);

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.warn("❌ User already exists");
            return res.status(409).json({ error: "User already exists" });
        }

        console.log("🔑 Hashing password...");

        // ✅ Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create and save new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        console.log("✅ User registered successfully:", email);

        res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error("🔥 Server error during sign-up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
