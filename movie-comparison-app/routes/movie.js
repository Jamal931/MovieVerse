const express = require('express');
const fetch = require('node-fetch');
const SearchHistory = require('../models/searchHistory');

const router = express.Router();
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Search movies by query
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();

        if (data.Response === 'True') {
            // Save search query to MongoDB
            await SearchHistory.create({ query, results: data.Search.length });

            res.json(data);
        } else {
            res.status(404).json({ error: 'No results found.' });
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
