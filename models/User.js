const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Ensure password is hashed only when modified
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Prevents re-hashing

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
