import { mount } from '@vue/test-utils';
import AddTrip from '@/views/AddTrip.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Axios
vi.mock('axios');

describe('AddTrip.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(AddTrip);
    });

    it('renders form elements correctly', () => {
        expect(wrapper.find('#destination').exists()).toBe(true);
        expect(wrapper.find('#start-date').exists()).toBe(true);
        expect(wrapper.find('#end-date').exists()).toBe(true);
        expect(wrapper.find('#purpose').exists()).toBe(true);
        expect(wrapper.find('.submit-button').exists()).toBe(true);
    });

    it('submits the form with correct data', async () => {
        const newTrip = {
            destination: 'Paris',
            startDate: '2023-01-01',
            endDate: '2023-01-10',
            purpose: 'Business',
        };

        axios.post.mockResolvedValue({ data: newTrip });

        await wrapper.setData(newTrip);
        await wrapper.find('form').trigger('submit.prevent');

        expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/trips', newTrip);
        expect(wrapper.vm.destination).toBe('');
        expect(wrapper.vm.startDate).toBe('');
        expect(wrapper.vm.endDate).toBe('');
        expect(wrapper.vm.purpose).toBe('');
    });

    it('handles errors when submitting the form', async () => {
        const errorMessage = 'Error adding trip';
        axios.post.mockRejectedValue(new Error(errorMessage));

        await wrapper.setData({
            destination: 'Paris',
            startDate: '2023-01-01',
            endDate: '2023-01-10',
            purpose: 'Business',
        });
        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.destination).toBe('Paris');
        expect(wrapper.vm.startDate).toBe('2023-01-01');
        expect(wrapper.vm.endDate).toBe('2023-01-10');
        expect(wrapper.vm.purpose).toBe('Business');
    });
});