const express = require('express');
const router = express.Router();
const cards = require('../data/cards.json');

router.post('/', (req, res) => {
    const searchTerm = req.body.searchTerm.toLowerCase();
    const searchResults = cards.filter((card) => card.name.toLowerCase().includes(searchTerm));

    res.json(searchResults);
});

module.exports = router;