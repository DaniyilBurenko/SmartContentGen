const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3001; // Default to port 3001 if not specified

app.use(express.json()); // Middleware to handle JSON requests

// Example route for generating content
app.post('/generate-content', async (req, res) => {
  const { contentType, audience, tone, keywords, platform } = req.body;

  // Create the prompt for OpenAI
  const prompt = `Write a ${tone} ${contentType} for ${platform} targeting ${audience} including the following keywords: ${keywords}.`;

  try {
    // Send request to OpenAI API
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use the API key from the environment variable
      },
    });

    // Send the generated content back to the client
    res.json({ content: response.data.choices[0].text.trim() }); // Trim whitespace
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send('Error generating content'); // Send a server error response
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});