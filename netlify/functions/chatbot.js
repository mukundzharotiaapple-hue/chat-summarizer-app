const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt, imageData } = JSON.parse(event.body);
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
    
    const responseBody = await response.text();
    if (!response.ok) {
        console.error("API Error Response:", responseBody);
        return { statusCode: response.status, body: `API Error: ${responseBody}` };
    }

    return {
      statusCode: 200,
      body: responseBody,
    };
  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from the AI service.' }),
    };
  }
};
