require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const solarInputRoutes = require("./routes/solarInputs.js");
const membershipRoutes = require("./routes/membershipRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Solar Nexus API");
});
app.use("/api/solarInputs", solarInputRoutes);
app.use("/api/membership", membershipRoutes); // Add membership routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
