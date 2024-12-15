import { mount } from '@vue/test-utils';
import TripsList from '@/views/TripsList.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Axios
vi.mock('axios');

describe('TripsList.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TripsList, {
            global: {
                mocks: {
                    $router: {
                        push: vi.fn(),
                    },
                },
            },
        });
    });

    it('renders form elements correctly', () => {
        expect(wrapper.find('.header').exists()).toBe(true);
        expect(wrapper.find('.btn-add').exists()).toBe(true);
        expect(wrapper.find('.btn-delete').exists()).toBe(true);
        expect(wrapper.find('ul').exists()).toBe(true);
        expect(wrapper.find('.detail-panel').exists()).toBe(true);
    });

    it('fetches trips on mount', async () => {
        const trips = [
            { id: 1, purpose: 'Business', destination: 'New York', startDate: '2023-01-01', endDate: '2023-01-05' },
            { id: 2, purpose: 'Vacation', destination: 'Paris', startDate: '2023-02-01', endDate: '2023-02-10' },
        ];
        axios.get.mockResolvedValue({ data: trips });

        await wrapper.vm.fetchTrips();
        expect(wrapper.vm.trips).toEqual(trips);
    });

    it('selects a trip', async () => {
        const trip = { id: 1, purpose: 'Business', destination: 'New York', startDate: '2023-01-01', endDate: '2023-01-05' };
        wrapper.setData({ trips: [trip] });

        await wrapper.find('li').trigger('click');
        expect(wrapper.vm.selectedTrip).toEqual(trip);
    });

    it('redirects to add trip page', async () => {
        const push = vi.fn();
        wrapper.vm.$router = { push };

        await wrapper.find('.btn-add').trigger('click');
        expect(push).toHaveBeenCalledWith('/add-trip');
    });

    it('deletes a trip', async () => {
        const trip = { id: 1, purpose: 'Business', destination: 'New York', startDate: '2023-01-01', endDate: '2023-01-05' };
        wrapper.setData({ trips: [trip], selectedTrip: trip });
        axios.delete.mockResolvedValue({});

        await wrapper.find('.btn-delete').trigger('click');
        expect(wrapper.vm.trips).toEqual([]);
    });

    it('edits a trip', async () => {
        const trip = { id: 1, purpose: 'Business', destination: 'New York', startDate: '2023-01-01', endDate: '2023-01-05' };
        const updatedTrip = { ...trip, purpose: 'Updated Business' };
        wrapper.setData({ trips: [trip], selectedTrip: trip });
        axios.put.mockResolvedValue({ data: updatedTrip });

        await wrapper.find('.btn-edit').trigger('click');
        expect(wrapper.vm.trips[0].purpose).toBe('Updated Business');
    });
});