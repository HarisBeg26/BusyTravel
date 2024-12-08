const express = require('express');
const bodyParser = require('body-parser');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parses incoming JSON requests

// Routes
app.use('/api/trips', tripRoutes); // Register API routes

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
