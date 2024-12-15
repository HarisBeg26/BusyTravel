const request = require('supertest');
const express = require('express');
const expenseRouter = require('../routes/expenseRoute');
const expenseService = require('../services/expenseService');

// Mock the expenseService methods
jest.mock('../services/expenseService', () => ({
    createExpense: jest.fn(),
    getExpenses: jest.fn(),
    getExpenseById: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRouter);

jest.setTimeout(10000); // Increase global timeout for all tests

describe('Expense Routes', () => {

    it('should create a new expense', async () => {
        const newExpense = { amount: 100, description: 'Flight to Paris', tripId: 1 };

        // Mock the createExpense service method to return an expense with id
        expenseService.createExpense.mockResolvedValue({ id: 1, ...newExpense });

        const response = await request(app).post('/api/expenses').send(newExpense);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body.amount).toBe(100);
    });

    it('should get all expenses', async () => {
        const expenses = [
            { id: 1, amount: 100, description: 'Flight to Paris', tripId: 1 },
            { id: 2, amount: 200, description: 'Hotel in London', tripId: 2 },
        ];

        // Mock the getExpenses service method to return multiple expenses
        expenseService.getExpenses.mockResolvedValue(expenses);

        const response = await request(app).get('/api/expenses');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expenses);
    });

    it('should get an expense by ID', async () => {
        const expenseId = 1;
        const expense = { id: 1, amount: 100, description: 'Flight to Paris', tripId: 1 };

        // Mock the getExpenseById service method to return an expense
        expenseService.getExpenseById.mockResolvedValue(expense);

        const response = await request(app).get(`/api/expenses/${expenseId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expense);
    });

    it('should update an expense by ID', async () => {
        const expenseId = 1;
        const updatedExpense = { amount: 120, description: 'Flight to Rome' };

        // Mock the updateExpense service method to return the updated expense
        expenseService.updateExpense.mockResolvedValue({ id: expenseId, ...updatedExpense });

        const response = await request(app).put(`/api/expenses/${expenseId}`).send(updatedExpense);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', expenseId);
        expect(response.body.amount).toBe(120);
    });

    it('should delete an expense by ID', async () => {
        const expenseId = 1;

        // Mock the deleteExpense service method to return success message
        expenseService.deleteExpense.mockResolvedValue();

        const response = await request(app).delete(`/api/expenses/${expenseId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Expense deleted successfully');
    });

});
