const express = require("express");
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUser, deleteUser, forgotpassword, resetPassword } = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication middleware (defined directly in this file)
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Token:", token); // Debugging line to check the token

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
router.get("/users", authMiddleware, getAllUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/forgotpassword", forgotpassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
