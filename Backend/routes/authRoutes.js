const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication middleware (defined directly in this file)
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
