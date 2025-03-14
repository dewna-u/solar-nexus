const SolarInput = require("../models/SolarInput.js");
const axios = require("axios");

// Add new solar input data with weather
exports.addSolarInput = async (req, res) => {
  try {
    const { numPanels, panelCapacity, location } = req.body;

    if (!numPanels || !panelCapacity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate total capacity
    const totalCapacity = numPanels * panelCapacity;

    // Fetch weather data
    const azureApiKey = process.env.AZURE_WEATHER_API_KEY;
    if (!azureApiKey) {
      return res.status(500).json({ message: "Azure API key is missing" });
    }

    let weatherData = null;
    try {
      // Convert location to coordinates
      const geoUrl = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${azureApiKey}&query=${encodeURIComponent(location)}`;
      const geoResponse = await axios.get(geoUrl);

      if (!geoResponse.data.results.length) {
        return res.status(400).json({ message: "Invalid location" });
      }

      const { position } = geoResponse.data.results[0];
      const weatherUrl = `https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.1&query=${position.lat},${position.lon}&subscription-key=${azureApiKey}`;
      
      const weatherResponse = await axios.get(weatherUrl);
      weatherData = weatherResponse.data;
    } catch (error) {
      console.error("⚠️ Weather API error:", error.message);
      weatherData = { error: "Failed to fetch weather data" };
    }

    // Save to database
    const newInput = new SolarInput({ numPanels, panelCapacity, totalCapacity, location, weather: weatherData });
    await newInput.save();

    res.status(201).json({ message: "Solar input saved successfully!", data: newInput });
  } catch (error) {
    console.error("🔥 Error saving solar input:", error.message);
    res.status(500).json({ message: "Error saving data", error: error.message });
  }
};

// Get all solar inputs
exports.getAllSolarInputs = async (req, res) => {
  try {
    const inputs = await SolarInput.find();
    res.status(200).json(inputs);
  } catch (error) {
    console.error("🔥 Error retrieving solar inputs:", error.message);
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
};

// Delete a solar input by ID
exports.deleteSolarInput = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInput = await SolarInput.findByIdAndDelete(id);

    if (!deletedInput) {
      return res.status(404).json({ message: "Solar input not found" });
    }

    res.status(200).json({ message: "Solar input deleted successfully!" });
  } catch (error) {
    console.error("🔥 Error deleting solar input:", error.message);
    res.status(500).json({ message: "Error deleting data", error: error.message });
  }
};

// Update a solar input by ID
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
    console.error("🔥 Error updating solar input:", error.message);
    res.status(500).json({ message: "Error updating data", error: error.message });
  }
};
