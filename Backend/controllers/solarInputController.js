// controllers/solarInputController.js

const SolarInput = require("../models/SolarInput.js");
const axios = require("axios");

exports.addSolarInput = async (req, res) => {
  try {
    const { numPanels, panelCapacity, location } = req.body;
    if (!numPanels || !panelCapacity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1) Total capacity
    const totalCapacity = numPanels * panelCapacity;

    // 2) Read OpenWeather API key
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!openWeatherApiKey) {
      return res.status(500).json({ message: "OpenWeather API key missing" });
    }

    // 3) Geocode location
    const geo = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct` +
      `?q=${encodeURIComponent(location)}&limit=1&appid=${openWeatherApiKey}`
    );
    if (!geo.data.length) {
      return res.status(400).json({ message: "Invalid location" });
    }
    const { lat, lon } = geo.data[0];

    // 4) Fetch 5-day / 3-hour forecast
    const weatherResp = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`
    );
    const list = weatherResp.data.list || [];

    // 5) Compute tomorrow & day-after based on server date
    const todayDate = new Date();
    const toISO = (d) => d.toISOString().split("T")[0];
    const today = toISO(todayDate);
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(todayDate.getDate() + 1);
    const day1 = toISO(tomorrow);
    const dayAfter = new Date(todayDate);
    dayAfter.setDate(todayDate.getDate() + 2);
    const day2 = toISO(dayAfter);

    // 6) Prepare segments
    const forecast = {
      day1: { morning: 0, noon: 0, night: 0 },
      day2: { morning: 0, noon: 0, night: 0 },
    };

    // 7) Accumulate kWh = kW × 3h × cloudFactor
    list.forEach((item) => {
      const [dateStr, timeStr] = item.dt_txt.split(" ");
      const hour = Number(timeStr.split(":")[0]);
      const cloudFactor = (100 - item.clouds.all) / 100;
      const energy = totalCapacity * 3 * cloudFactor;

      let seg = null;
      if (hour >= 6 && hour < 12) seg = "morning";
      else if (hour >= 12 && hour < 18) seg = "noon";
      else if (hour >= 18 && hour < 24) seg = "night";

      if (seg && dateStr === day1) forecast.day1[seg] += energy;
      if (seg && dateStr === day2) forecast.day2[seg] += energy;
    });

    // 8) Round
    ["day1", "day2"].forEach((d) =>
      ["morning", "noon", "night"].forEach((p) => {
        forecast[d][p] = Number(forecast[d][p].toFixed(2));
      })
    );

    // 9) Persist
    const newInput = new SolarInput({
      numPanels,
      panelCapacity,
      totalCapacity,
      location,
      weather: weatherResp.data,
      forecast,
    });
    await newInput.save();

    return res.status(201).json({ message: "Saved!", data: newInput });
  } catch (err) {
    console.error("🔥 Error saving solar input:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// controllers/solarInputController.js

exports.getAllSolarInputs = async (req, res) => {
  try {
    // Fetch all inputs, oldest first
    const inputs = await SolarInput.find().sort({ createdAt: 1 });
    // Return the full array
    return res.status(200).json(inputs);
  } catch (error) {
    console.error("🔥 Error retrieving solar inputs:", error);
    return res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};


exports.deleteSolarInput = async (req, res) => {
  try {
    const deleted = await SolarInput.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Solar input not found" });
    }
    return res
      .status(200)
      .json({ message: "Solar input deleted successfully!" });
  } catch (error) {
    console.error("🔥 Error deleting solar input:", error);
    return res.status(500).json({
      message: "Error deleting data",
      error: error.message,
    });
  }
};

exports.updateSolarInput = async (req, res) => {
  try {
    const { numPanels, panelCapacity, location } = req.body;
    if (!numPanels || !panelCapacity || !location) {
      return res
        .status(400)
        .json({ message: "All fields are required for update" });
    }

    const totalCapacity = numPanels * panelCapacity;
    const updated = await SolarInput.findByIdAndUpdate(
      req.params.id,
      { numPanels, panelCapacity, totalCapacity, location },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Solar input not found" });
    }
    return res.status(200).json({
      message: "Solar input updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error("🔥 Error updating solar input:", error);
    return res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
};
