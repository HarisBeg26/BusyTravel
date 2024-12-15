import { mount } from '@vue/test-utils';
import ExpensesList from '@/views/ExpensesList.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Axios
vi.mock('axios');

describe('ExpensesList.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(ExpensesList);
    });

    it('renders form elements correctly', () => {
        expect(wrapper.find('.header').exists()).toBe(true);
        expect(wrapper.find('.btn-add').exists()).toBe(true);
        expect(wrapper.find('.btn-delete').exists()).toBe(true);
        expect(wrapper.find('ul').exists()).toBe(true);
        expect(wrapper.find('.detail-panel').exists()).toBe(true);
    });

    it('fetches expenses on mount', async () => {
        const expenses = [
            { id: 1, description: 'Expense 1', amount: 100, category: 'Travel', trip_id: 1 },
            { id: 2, description: 'Expense 2', amount: 200, category: 'Food', trip_id: 2 },
        ];
        axios.get.mockResolvedValue({ data: expenses });

        await wrapper.vm.fetchExpenses();
        expect(wrapper.vm.expenses).toEqual(expenses);
    });

    it('selects an expense', async () => {
        const expense = { id: 1, description: 'Expense 1', amount: 100, category: 'Travel', trip_id: 1 };
        wrapper.setData({ expenses: [expense] });

        await wrapper.find('li').trigger('click');
        expect(wrapper.vm.selectedExpense).toEqual(expense);
    });

    it('redirects to add expense page', async () => {
        const push = vi.fn();
        wrapper.vm.$router = { push };

        await wrapper.find('.btn-add').trigger('click');
        expect(push).toHaveBeenCalledWith('/add-expense');
    });

    it('deletes an expense', async () => {
        const expense = { id: 1, description: 'Expense 1', amount: 100, category: 'Travel', trip_id: 1 };
        wrapper.setData({ expenses: [expense], selectedExpense: expense });
        axios.delete.mockResolvedValue({});

        await wrapper.find('.btn-delete').trigger('click');
        expect(wrapper.vm.expenses).toEqual([]);
    });

    it('edits an expense', async () => {
        const expense = { id: 1, description: 'Expense 1', amount: 100, category: 'Travel', trip_id: 1 };
        const updatedExpense = { ...expense, description: 'Updated Expense' };
        wrapper.setData({ expenses: [expense], selectedExpense: expense });
        axios.put.mockResolvedValue({ data: updatedExpense });

        await wrapper.find('.btn-edit').trigger('click');
        expect(wrapper.vm.expenses[0].description).toBe('Updated Expense');
    });
});