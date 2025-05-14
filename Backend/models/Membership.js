// Membership.js
const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: Number, required: true },
  benefits: [String],
  status: { 
    type: String, 
    enum: ['Active', 'Cancelled', 'Expired'], 
    default: 'Active' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  selectedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
}, {
  timestamps: true
});

// Index for faster queries by userId
membershipSchema.index({ userId: 1 });

module.exports = mongoose.model("Membership", membershipSchema);