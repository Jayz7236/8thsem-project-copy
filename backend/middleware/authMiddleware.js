const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        console.log("🔍 Received Token:", token); 

        if (!token) {
            console.error("❌ No token received");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        
        // Attach user details to request object
        req.user = decoded;

        console.log("✅ User Authenticated:", req.user); 

        next();
    } catch (error) {
        console.error("❌ Auth Error:", error.message);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;
