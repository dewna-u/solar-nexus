// routes/chatbot.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const SolarInput = require("../models/SolarInput.js");

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Fetch all solar inputs
    const inputs = await SolarInput.find().lean();
    if (!inputs.length) {
      return res.status(400).json({ error: "No solar input data available" });
    }

    // 2. Build CSV in-memory with safe defaults
    const headers = [
      "numPanels","panelCapacity","totalCapacity","location",
      "d1_morning","d1_noon","d1_night",
      "d2_morning","d2_noon","d2_night",
      "createdAt"
    ];
    const rows = inputs.map(doc => {
      // default forecast if missing
      const fc = doc.forecast || {};
      const d1 = fc.day1 || {};
      const d2 = fc.day2 || {};

      return [
        doc.numPanels || 0,
        doc.panelCapacity || 0,
        doc.totalCapacity || 0,
        `"${doc.location || ""}"`,
        d1.morning || 0,
        d1.noon    || 0,
        d1.night   || 0,
        d2.morning || 0,
        d2.noon    || 0,
        d2.night   || 0,
        `"${(doc.createdAt || new Date()).toISOString()}"`
      ].join(",");
    });
    const csvString = [ headers.join(","), ...rows ].join("\n");

    // 3. Build prompt
    const prompt = `
You are “SolarNexusBot,” an AI assistant for a solar-monitoring dashboard.
Here is the CSV data of all inputs & forecasts:
${csvString}

User says: "${message}"
If they say “hi”, reply: “Welcome to SolarNexus! How can I help you today?”
Otherwise, answer **only** using the data above. dont genarate with special characters like *, #, @, $, %, ^, &, (, ), !, ?, etc. and get data summarise and nice format .
    `.trim();

    // 4. Call Azure OpenAI (DeepSeek-V3)
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "DeepSeek API key is missing" });
    }

    const apiResponse = await axios.post(
      "https://hutta5246460149.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview",
      {
        model: "DeepSeek-V3-0324",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const reply = apiResponse.data.choices[0].message.content;
    return res.json({ reply });

  } catch (err) {
    console.error("❌ Chatbot error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to get response from chatbot" });
  }
});

module.exports = router;
