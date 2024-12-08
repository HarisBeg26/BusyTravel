const express = require('express');
const bodyParser = require('body-parser');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoute');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parses incoming JSON requests

app.use(cors());

// Routes
app.use('/api/trips', tripRoutes); // Register API routes
app.use('/api/expenses', expenseRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
