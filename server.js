// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Wit.ai API endpoint
const WIT_AI_URL = 'https://api.wit.ai/message';
const WIT_AI_SERVER_TOKEN = '5KBEPBHH7N3GN5YR3SSXR47BAYQSTSKF';

// Route to handle voice and chat commands
app.post('/wit-ai', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await axios.get(WIT_AI_URL, {
            params: {
                v: '20250428',
                q: query,
            },
            headers: {
                Authorization: `Bearer ${WIT_AI_SERVER_TOKEN}`,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Wit.ai API:', error.message);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Serve static files
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});