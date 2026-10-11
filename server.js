
require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is running successfully!",
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return res.status(500).json({
      error: error.message || "AI request failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(
    "Gemini API key loaded:",
    Boolean(process.env.GEMINI_API_KEY)
  );
});
