const fetch = require('node-fetch');

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the data from the frontend
  const body = JSON.parse(event.body);
  const { prompt, imageData } = body;

  // Get the secret API key from the environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt }];
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: imageData,
      },
    });
  }

  const payload = {
    contents: [{ parts: parts }],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        return { statusCode: response.status, body: `API Error: ${errorBody}` };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from the AI service.' }),
    };
  }
};