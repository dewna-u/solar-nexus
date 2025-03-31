const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  membershipType: {type: String, required: true},
  cardNumber: String,
  expiry: String,
  cvv: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
