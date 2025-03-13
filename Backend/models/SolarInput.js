const mongoose = require("mongoose");

const SolarInputSchema = new mongoose.Schema({
  capacity: { type: Number, required: true },
  hours: { type: Number, required: true },
  battery: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SolarInput", SolarInputSchema);
