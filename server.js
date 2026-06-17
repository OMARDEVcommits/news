const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// API proxy endpoint for Contentful
app.get('/api/articles', async (req, res) => {
    try {
        const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
        const API_KEY = process.env.CONTENTFUL_API_KEY;

        if (!SPACE_ID || !API_KEY) {
            return res.status(500).json({ error: 'Contentful credentials not configured' });
        }

        const response = await fetch(
            `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=article`,
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Contentful API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to match your frontend expectations
        const articles = data.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            content: item.fields.content,
            excerpt: item.fields.excerpt || item.fields.content.substring(0, 150) + '...',
            image: item.fields.image ? item.fields.image.fields.file.url : null,
            category: item.fields.category || 'General',
            date: item.sys.createdAt,
            author: item.fields.author || 'Staff'
        }));

        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});