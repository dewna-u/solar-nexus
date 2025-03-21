// controllers/membershipController.js
const Membership = require("../models/membershipModel");

// Get Membership Details
exports.getMembershipDetails = async (req, res) => {
  try {
    const membership = await Membership.findOne({ userId: req.params.userId });
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Membership Plan
exports.changeMembershipPlan = async (req, res) => {
  try {
    const { userId, type, price, nextPaymentDate } = req.body;
    const membership = await Membership.findOneAndUpdate(
      { userId },
      { type, price, nextPaymentDate, status: "Active" },
      { new: true }
    );
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel Membership
exports.cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOneAndUpdate(
      { userId: req.params.userId },
      { status: "Cancelled" },
      { new: true }
    );
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json({ message: "Membership has been cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
