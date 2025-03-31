const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  benefits: [String],
  selectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Membership", membershipSchema);
