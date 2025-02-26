const bcrypt = require("bcryptjs");

const enteredPassword = "your_actual_password";  // Use the password entered during signup
const hashedPassword = "$2a$10$rx/JXfr64VSjO66lVIJh7.rTCvucxl.bzqu5BFRlr2kE7Siy4hGkG";  // Exact hash from MongoDB

bcrypt.compare(enteredPassword, hashedPassword).then(match => {
    console.log(match ? "✅ Password matches" : "❌ Password does not match");
});
