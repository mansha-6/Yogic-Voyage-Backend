const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) return res.status(401).json({ error: "Access denied. No token provided!" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Store user data in request
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token!" });
    }
};

module.exports = authenticateToken;
