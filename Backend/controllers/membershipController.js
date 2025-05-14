// controllers/membershipController.js
const Membership = require("../models/Membership");

// Get the logged-in user’s membership
exports.getMembershipDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({ message: "No membership found for this user" });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error("Error fetching membership:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change (or create) the user’s membership plan
exports.changeMembershipPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, name, price, amount, benefits, nextPaymentDate } = req.body;

    // Validate required fields
    if (!planId || !name || !price || !amount || !benefits) {
      return res.status(400).json({ message: "Missing required plan fields" });
    }

    // Upsert the membership document
    const updated = await Membership.findOneAndUpdate(
      { userId },
      {
        userId,
        planId,
        name,
        price,
        amount,
        benefits,
        status: "Active",
        ...(nextPaymentDate && { nextPaymentDate }),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error changing membership plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel the logged-in user’s membership
exports.cancelMembership = async (req, res) => {
  try {
    const userId = req.user.id;
    const cancelled = await Membership.findOneAndUpdate(
      { userId },
      { status: "Cancelled" },
      { new: true }
    );
    if (!cancelled) {
      return res.status(404).json({ message: "No membership to cancel" });
    }
    res.status(200).json({ message: "Membership has been cancelled", membership: cancelled });
  } catch (error) {
    console.error("Error cancelling membership:", error);
    res.status(500).json({ message: "Server error" });
  }
};
