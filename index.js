const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // Load API key from .env file

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI API with your API key from the .env file
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Test Route
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
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // Or use "gpt-4" if available in your account
            messages: [
                { role: "system", content: "You are an AI assistant helping with document-based questions." },
                { role: "user", content: `Document: ${documentContent}\nQuestion: ${question}` },
            ],
        });

        const answer = response.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error("Error with OpenAI API:", error.message);
        res.status(500).json({ error: "Failed to get a response from the AI." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
