const express = require("express");
const router = express.Router();
const Membership = require("../models/membershipModel");

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

module.exports = router;
