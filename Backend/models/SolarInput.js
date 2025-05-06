//models/SolarInput.js
const mongoose = require("mongoose");

const SolarInputSchema = new mongoose.Schema({
  numPanels: { type: Number, required: true },
  panelCapacity: { type: Number, required: true },
  totalCapacity: { type: Number, required: true },
  location: { type: String, required: true },
  weather: { type: Object, required: false }, // Stores weather API response
  forecast: {
    day1: {
      morning: { type: Number, default: 0 },
      noon: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },
    day2: {
      morning: { type: Number, default: 0 },
      noon: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SolarInput", SolarInputSchema);
