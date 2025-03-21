const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  benefits: { type: [String], required: true },
});

module.exports = mongoose.model("Membership", MembershipSchema);
