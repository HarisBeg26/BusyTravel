const express = require('express');
const router = express.Router();
const { getExpenseStatistics } = require('../routes/statisticsRoute');

router.get('/expense-statistics', async (req, res) => {
    try {
        const statistics = await getExpenseStatistics();
        res.status(200).json(statistics);
    } catch (err) {
        console.error('Error fetching statistics:', err.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});


module.exports = router;
