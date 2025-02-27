const bcrypt = require("bcryptjs");

const plainPassword = "yourpassword";  // Replace with the actual password you used
const storedHashedPassword = "$2b$10$UuFpWrs2w2rL0.FWSWCD8uzUzbSgim7gyL83CG1xwHB8cbmuJru5q"; // Your DB hash

// Hash the plain password again
bcrypt.hash(plainPassword, 10).then((newHashedPassword) => {
    console.log("Newly Hashed Password:", newHashedPassword);

    // Compare the stored hashed password with the new one
    bcrypt.compare(plainPassword, storedHashedPassword).then((isMatch) => {
        console.log("Password Match Test:", isMatch ? "✅ MATCHED" : "❌ DID NOT MATCH");
    }).catch(err => console.error("Error comparing passwords:", err));
});
