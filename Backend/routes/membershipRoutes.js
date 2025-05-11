const express = require("express");
const router = express.Router();
const Membership = require("../models/Membership");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify token and extract user
const verifyToken = (req, res, next) => {
  // Log headers for debugging
  console.log("Auth Header:", req.header("Authorization"));
  
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// @route   POST /api/membership
// @desc    Save membership plan to database
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { id, name, price, benefits } = req.body;

    if (!id || !name || !price || !benefits) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMembership = new Membership({ id, name, price, benefits });
    await newMembership.save();

    res.status(201).json({ message: "Membership plan saved successfully" });
  } catch (error) {
    console.error("Error saving membership:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/membership/change
// @desc    Change user's membership plan (for downgrades)
// @access  Private
router.put("/change", verifyToken, async (req, res) => {
  try {
    const { newPlanId } = req.body;
    const userId = req.userId;
    
    if (!newPlanId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Convert plan ID to membership type name
    let membershipType;
    switch(newPlanId) {
      case "weekly":
        membershipType = "Weekly";
        break;
      case "monthly":
        membershipType = "Monthly";
        break;
      case "yearly":
        membershipType = "Yearly";
        break;
      default:
        return res.status(400).json({ message: "Invalid plan ID" });
    }
    
    // Update the user's membership type
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { membershipType },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: "Membership plan changed successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        membershipType: updatedUser.membershipType
      }
    });
  } catch (error) {
    console.error("Error changing membership:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/membership/current
// @desc    Get user's current membership
// @access  Private
router.get("/current", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If user has no membership type or it's "Free", return default free plan
    if (!user.membershipType || user.membershipType === "Free") {
      return res.status(200).json({
        userId: user._id,
        id: "free", // Add an ID for free plan
        name: "Free",
        price: "LKR 0",
        amount: 0,
        status: "Active",
        membershipType: "Free"
      });
    }
    
    // Convert membership type name to plan details
    let membershipPlan = {};
    
    switch(user.membershipType) {
      case "Weekly":
        membershipPlan = {
          id: "weekly",
          name: "Weekly",
          price: "LKR 750",
          amount: 750,
          status: "Active"
        };
        break;
      case "Monthly":
        membershipPlan = {
          id: "monthly",
          name: "Monthly",
          price: "LKR 2250",
          amount: 2250,
          status: "Active"
        };
        break;
      case "Yearly":
        membershipPlan = {
          id: "yearly",
          name: "Yearly",
          price: "LKR 33000",
          amount: 33000,
          status: "Active"
        };
        break;
    }
    
    res.status(200).json({
      userId: user._id,
      ...membershipPlan
    });
  } catch (error) {
    console.error("Error fetching membership:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
