require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const solarInputRoutes = require("./routes/solarInputs.js");
const membershipRoutes = require("./routes/membershipRoutes"); // Assuming you have membership routes
const connectDB = require("./config/db.js"); // Import the connectDB function

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Solar Nexus API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/solarInputs", solarInputRoutes);
app.use("/api/membership", membershipRoutes); // Add membership routes

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
