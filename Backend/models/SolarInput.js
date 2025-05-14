// models/SolarInput.js
const mongoose = require("mongoose");

const SolarInputSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  numPanels:     { type: Number, required: true },
  panelCapacity: { type: Number, required: true },
  totalCapacity: { type: Number, required: true },
  location:      { type: String, required: true },
  weather:       { type: Object },
  forecast: {
    day1: {
      morning: { type: Number, default: 0 },
      noon:    { type: Number, default: 0 },
      night:   { type: Number, default: 0 },
    },
    day2: {
      morning: { type: Number, default: 0 },
      noon:    { type: Number, default: 0 },
      night:   { type: Number, default: 0 },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SolarInput", SolarInputSchema);