require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoute');
const statisticsRoutes = require('./routes/statisticsRoute');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parses incoming JSON requests

app.use(cors());

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Routes
app.use('/api/trips', tripRoutes); // Register API routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/statistics', statisticsRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export the app for testing
