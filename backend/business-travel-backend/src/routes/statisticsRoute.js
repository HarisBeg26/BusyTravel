// routes/statisticsRoute.js
const express = require('express');
const router = express.Router();
const { getExpenseStatistics } = require('../services/statisticsService');

router.get('/expense-statistics', async (req, res) => {
    try {
        const statistics = await getExpenseStatistics();
        res.json(statistics); // Return the statistics data
    } catch (err) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});

module.exports = router;
