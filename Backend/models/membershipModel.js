// models/Membership.js
const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  benefits: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure a user cannot subscribe to the same plan twice
MembershipSchema.index({ userId: 1, planId: 1 }, { unique: true });

module.exports = mongoose.model("Membership", MembershipSchema);
