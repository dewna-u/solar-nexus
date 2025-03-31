const SolarInput = require("../models/SolarInput.js");
const axios = require("axios");

// Add new solar input data with weather
exports.addSolarInput = async (req, res) => {
  try {
    const { numPanels, panelCapacity, location } = req.body;
    if (!numPanels || !panelCapacity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const totalCapacity = numPanels * panelCapacity;
    const azureApiKey = process.env.AZURE_WEATHER_API_KEY;

    if (!azureApiKey) {
      console.error("❌ Azure API key is missing");
      return res.status(500).json({ message: "Azure API key is missing" });
    }

    let weatherCondition = "Unknown";
    try {
      const geoUrl = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${azureApiKey}&query=${encodeURIComponent(location)}`;
      const geoResponse = await axios.get(geoUrl);
      console.log("🌍 Geo API Response:", JSON.stringify(geoResponse.data, null, 2));

      if (!geoResponse.data?.results?.length) {
        return res.status(400).json({ message: "Invalid location. Please enter a valid city or district." });
      }

      const { position } = geoResponse.data.results[0];
      if (!position?.lat || !position?.lon) {
        return res.status(400).json({ message: "Could not determine location coordinates." });
      }

      console.log(`📍 Coordinates: ${position.lat}, ${position.lon}`);

      const weatherUrl = `https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.1&query=${position.lat},${position.lon}&subscription-key=${azureApiKey}`;
      const weatherResponse = await axios.get(weatherUrl);
      console.log("🌦️ Weather API Response:", JSON.stringify(weatherResponse.data, null, 2));

      if (weatherResponse.status === 200 && weatherResponse.data?.forecasts?.length) {
        const forecast = weatherResponse.data.forecasts[0];
        if (weatherResponse.data.summary?.phrase) {
          weatherCondition = weatherResponse.data.summary.phrase;
        } else if (forecast?.day?.iconPhrase) {
          weatherCondition = forecast.day.iconPhrase;
        }
      }
    } catch (error) {
      console.error("⚠️ Weather API error:", error.response?.data || error.message);
      return res.status(500).json({ message: "Error fetching weather data", error: error.response?.data || error.message });
    }

    const newInput = new SolarInput({ numPanels, panelCapacity, totalCapacity, location, weather: weatherCondition });
    try {
      await newInput.save();
      console.log("✅ Solar input saved:", newInput);
      res.status(201).json({ message: "Solar input saved successfully!", data: newInput });
    } catch (dbError) {
      console.error("🔥 Database error:", dbError.message);
      res.status(500).json({ message: "Error saving data", error: dbError.message });
    }
  } catch (error) {
    console.error("🔥 General error:", error.message);
    res.status(500).json({ message: "Unexpected server error", error: error.message });
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
