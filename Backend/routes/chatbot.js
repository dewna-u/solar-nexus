const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
});

module.exports = router;
