const expenseController = require('../controllers/expenseController');
const expenseService = require('../services/expenseService');

jest.mock('../services/expenseService', () => ({
    createExpense: jest.fn(),
    getExpenses: jest.fn(),
    getExpenseById: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
}));

describe('Expense Controller', () => {

    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} }; // Default empty request object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }; // Mock response object
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an expense and return status 201', async () => {
        const newExpense = { amount: 100, description: 'Flight to Paris', tripId: 1 };
        req.body = newExpense;

        expenseService.createExpense.mockResolvedValue({ id: 1, ...newExpense });

        await expenseController.createExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...newExpense });
    });

    it('should handle error in createExpense and return status 500', async () => {
        req.body = { amount: 100, description: 'Flight to Paris', tripId: 1 };

        expenseService.createExpense.mockRejectedValue(new Error('Database error'));

        await expenseController.createExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should get all expenses and return status 200', async () => {
        const expenses = [
            { id: 1, amount: 100, description: 'Flight to Paris', tripId: 1 },
            { id: 2, amount: 200, description: 'Hotel in London', tripId: 2 },
        ];
        expenseService.getExpenses.mockResolvedValue(expenses);

        await expenseController.getAllExpenses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expenses);
    });

    it('should handle error in getAllExpenses and return status 500', async () => {
        expenseService.getExpenses.mockRejectedValue(new Error('Database error'));

        await expenseController.getAllExpenses(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should get an expense by ID and return status 200', async () => {
        const expense = { id: 1, amount: 100, description: 'Flight to Paris', tripId: 1 };
        req.params.id = 1;

        expenseService.getExpenseById.mockResolvedValue(expense);

        await expenseController.getExpenseById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expense);
    });

    it('should handle error in getExpenseById and return status 500', async () => {
        req.params.id = 1;
        expenseService.getExpenseById.mockRejectedValue(new Error('Expense not found'));

        await expenseController.getExpenseById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Expense not found' });
    });

    it('should update an expense by ID and return status 200', async () => {
        const updatedExpense = { amount: 120, description: 'Flight to Rome' };
        req.params.id = 1;
        req.body = updatedExpense;

        expenseService.updateExpense.mockResolvedValue({ id: 1, ...updatedExpense });

        await expenseController.updateExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...updatedExpense });
    });

    it('should handle error in updateExpense and return status 500', async () => {
        req.params.id = 1;
        req.body = { amount: 120, description: 'Flight to Rome' };

        expenseService.updateExpense.mockRejectedValue(new Error('Database error'));

        await expenseController.updateExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should delete an expense by ID and return status 200', async () => {
        req.params.id = 1;

        expenseService.deleteExpense.mockResolvedValue();

        await expenseController.deleteExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expense deleted successfully' });
    });

    it('should handle error in deleteExpense and return status 500', async () => {
        req.params.id = 1;

        expenseService.deleteExpense.mockRejectedValue(new Error('Database error'));

        await expenseController.deleteExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});
