const mongoose = require("mongoose");

const SolarInputSchema = new mongoose.Schema({
  numPanels: { type: Number, required: true },
  panelCapacity: { type: Number, required: true },
  totalCapacity: { type: Number, required: true },
  location: { type: String, required: true },
  weather: { type: Object, required: false }, // Stores weather data
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SolarInput", SolarInputSchema);
