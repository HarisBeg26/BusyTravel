import { mount } from '@vue/test-utils';
import AddExpense from '@/views/AddExpense.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Axios
vi.mock('axios');

describe('AddExpense.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AddExpense);
    });

    it('renders form elements correctly', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, destination: 'Paris' }] });
        await wrapper.vm.fetchTrips();
        expect(wrapper.find('#amount').exists()).toBe(true);
        expect(wrapper.find('#category').exists()).toBe(true);
        expect(wrapper.find('#tripId').exists()).toBe(true);
    });

    it('handles errors when fetching trips', async () => {
        const errorMessage = 'Failed to fetch trips';
        axios.get.mockRejectedValue(new Error(errorMessage));
        await wrapper.vm.fetchTrips();
        expect(wrapper.vm.error).toBe(errorMessage);
        expect(wrapper.find('.error').text()).toContain(errorMessage);
    });
});