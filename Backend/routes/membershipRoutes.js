// routes/membership.js
const express    = require("express");
const router     = express.Router();
const auth       = require("../middleware/authMiddleware");
const Membership = require("../models/Membership");

// @route   POST /api/membership
// @desc    Save membership plan to database for the logged-in user
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // accept either planId or legacy id
    const planId  = req.body.planId || req.body.id;
    const name    = req.body.name;
    const price   = req.body.price;
    const amount  = req.body.amount;
    const benefits= req.body.benefits;

    if (!planId || !name || !price || !amount || !benefits) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMembership = new Membership({
      userId,
      planId,
      name,
      price,
      amount,
      benefits,
    });

    await newMembership.save();
    res.status(201).json({ message: "Membership saved", membership: newMembership });
  } catch (error) {
    console.error("Error saving membership:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
