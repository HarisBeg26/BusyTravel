const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Define all CRUD routes for expenses
router.post('/', expenseController.createExpense);    // Create a new expense
router.get('/', expenseController.getAllExpenses);    // Get all expenses
router.get('/:id', expenseController.getExpenseById); // Get a specific expense by ID
router.put('/:id', expenseController.updateExpense);  // Update an existing expense by ID
router.delete('/:id', expenseController.deleteExpense); // Delete an expense by ID

module.exports = router;
