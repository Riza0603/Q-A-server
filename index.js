// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai"); // Updated OpenAI library import
require('dotenv').config();  // Load environment variables from .env file

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI with your API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Using API key from .env
  apiBaseUrl: "https://api.openai.com/v1",
});

// Test Route to check server
app.get("/", (req, res) => {
  res.send("Welcome to the AI-Powered Q&A Backend!");
});

// Route to handle Q&A based on input
app.post("/ask", async (req, res) => {
  const { question, documentContent } = req.body;

  if (!question || !documentContent) {
    return res.status(400).json({ error: "Question and document content are required!" });
  }

  try {
    // Use OpenAI to get a response
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-4" if available in your account
      prompt: `Document: ${documentContent}\nQuestion: ${question}`,
      max_tokens: 150,
    });

    const answer = response.choices[0].text;
    res.json({ answer });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to get a response from the AI." });
  }
});

// Start the server
const PORT = process.env.PORT || 3001; // Make sure it matches your frontend API call
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
