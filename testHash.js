const bcrypt = require("bcryptjs");

const enteredPassword = "Test@1234";  // Replace with your actual input password
const storedHashedPassword = "$2a$10$LhI8zWrFn4og2ixzdaqKY..cjT.hprcvI1amXEzRwOXkKt45guZ0G";  // Replace with stored hash from MongoDB

bcrypt.compare(enteredPassword, storedHashedPassword).then(isMatch => {
    console.log("✅ bcrypt.compare result:", isMatch ? "Password matches!" : "❌ Password does not match!");
});
