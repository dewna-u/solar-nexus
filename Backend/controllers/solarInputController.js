const SolarInput = require("../models/SolarInput");

// Add new solar input data
exports.addSolarInput = async (req, res) => {
  try {
    const { capacity, hours, battery } = req.body;
    const newInput = new SolarInput({ capacity, hours, battery });
    await newInput.save();
    res.status(201).json({ message: "Solar input saved successfully!", data: newInput });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error: error.message });
  }
};

// Get all solar inputs
exports.getAllSolarInputs = async (req, res) => {
  try {
    const inputs = await SolarInput.find();
    res.status(200).json(inputs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
};

// Delete a solar input by ID
exports.deleteSolarInput = async (req, res) => {
  try {
    const { id } = req.params;
    await SolarInput.findByIdAndDelete(id);
    res.status(200).json({ message: "Solar input deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error: error.message });
  }
};

// Update a solar input by ID
// Update a solar input by ID
exports.updateSolarInput = async (req, res) => {
    try {
      const { id } = req.params;
      const { capacity, hours, battery } = req.body;
  
      const updatedInput = await SolarInput.findByIdAndUpdate(
        id,
        { capacity, hours, battery },
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
  
  
