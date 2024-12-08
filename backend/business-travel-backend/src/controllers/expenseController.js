const expenseService = require('../services/expenseService');

exports.createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error in createExpense controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expense = await expenseService.getExpenses();
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getExpenseById = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateExpense = async (req, res) => {
    try {
        const updatedExpense = await expenseService.updateExpense(req.params.id, req.body);
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteExpense = async (req, res) => {
    try {
        await expenseService.deleteExpense(req.params.id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};