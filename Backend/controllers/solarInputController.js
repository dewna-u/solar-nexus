const SolarInput = require("../models/SolarInput.js");
const axios = require("axios");

exports.addSolarInput = async (req, res) => {
  try {
    console.log("📥 Incoming data:", req.body);
    const { numPanels, panelCapacity, location } = req.body;

    if (!numPanels || !panelCapacity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalCapacity = numPanels * panelCapacity;
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY || "2f784c2a0eefce874b45136236d374e8";

    let weatherData = null;
    let forecast = null;

    try {
      // Geocoding
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${openWeatherApiKey}`;
      const geoResponse = await axios.get(geoUrl);

      if (!geoResponse.data.length) {
        return res.status(400).json({ message: "Invalid location" });
      }

      const { lat, lon } = geoResponse.data[0];

      // Forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      weatherData = weatherResponse.data;

      // Extract dates
      const availableDates = weatherData.list.map(item =>
        new Date(item.dt_txt).toISOString().split("T")[0]
      );
      const uniqueDates = [...new Set(availableDates)];
      console.log("🌤️ Forecast dates available:", uniqueDates);

      const target1 = uniqueDates[1]; // Tomorrow
      const target2 = uniqueDates[2]; // Day after tomorrow

      // Forecast Calculation (morning, noon, night)
      const segments = {
        day1: { morning: 0, noon: 0, night: 0 },
        day2: { morning: 0, noon: 0, night: 0 },
      };

      weatherData.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const dayStr = date.toISOString().split("T")[0];
        const hour = date.getHours();
        const cloudFactor = (100 - item.clouds.all) / 100;
        const estimatedEnergy = totalCapacity * (3 / 24) * cloudFactor * 5;

        if (dayStr === target1) {
          if (hour >= 6 && hour < 12) segments.day1.morning += estimatedEnergy;
          else if (hour >= 12 && hour < 16) segments.day1.noon += estimatedEnergy;
          else if (hour >= 16 && hour <= 18) segments.day1.night += estimatedEnergy;
        } else if (dayStr === target2) {
          if (hour >= 6 && hour < 12) segments.day2.morning += estimatedEnergy;
          else if (hour >= 12 && hour < 16) segments.day2.noon += estimatedEnergy;
          else if (hour >= 16 && hour <= 18) segments.day2.night += estimatedEnergy;
        }
      });

      forecast = segments;

    } catch (error) {
      console.error("⚠️ Weather API error:", error.message);
      weatherData = { error: "Failed to fetch weather data" };
    }

    const newInput = new SolarInput({
      numPanels,
      panelCapacity,
      totalCapacity,
      location,
      weather: weatherData,
      forecast,
    });

    await newInput.save();
    console.log("✅ Data saved to MongoDB:", newInput);

    res.status(201).json({ message: "Solar input saved successfully!", data: newInput });
  } catch (error) {
    console.error("🔥 Error saving solar input:", error);
    res.status(500).json({ message: "Error saving data", error: error.message });
  }
};

exports.getAllSolarInputs = async (req, res) => {
  try {
    const inputs = await SolarInput.find();
    res.status(200).json(inputs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
};

exports.deleteSolarInput = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInput = await SolarInput.findByIdAndDelete(id);
    if (!deletedInput) return res.status(404).json({ message: "Solar input not found" });
    res.status(200).json({ message: "Solar input deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error: error.message });
  }
};

exports.updateSolarInput = async (req, res) => {
  try {
    const { id } = req.params;
    const { numPanels, panelCapacity, location } = req.body;

    if (!numPanels || !panelCapacity || !location) {
      return res.status(400).json({ message: "All fields are required for update" });
    }

    const totalCapacity = numPanels * panelCapacity;
    const updatedInput = await SolarInput.findByIdAndUpdate(
      id,
      { numPanels, panelCapacity, totalCapacity, location },
      { new: true, runValidators: true }
    );

    if (!updatedInput) {
      return res.status(404).json({ message: "Solar input not found" });
    }

    res.status(200).json({ message: "Solar input updated successfully!", data: updatedInput });
  } catch (error) {
    res.status(500).json({ message: "Error updating data", error: error.message });
  }
};
