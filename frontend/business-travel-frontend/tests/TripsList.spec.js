import { mount } from '@vue/test-utils';
import TripsList from '@/views/TripsList.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Axios
vi.mock('axios');

describe('TripsList.vue', () => {
    let wrapper;

    beforeEach(() => {
        const trips = [
            { id: 1, purpose: 'Business', destination: 'New York', startDate: '2023-01-01', endDate: '2023-01-05' },
            { id: 2, purpose: 'Vacation', destination: 'Paris', startDate: '2023-02-01', endDate: '2023-02-10' },
        ];
        axios.get.mockResolvedValue({ data: trips });

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

        // Set trips data and select the trip
        wrapper.setData({ trips: [trip], selectedTrip: trip });

        // Trigger a click event to select the trip (this will ensure selectedTrip is populated)
        await wrapper.find('li').trigger('click');

        // Now find the edit button and ensure it exists
        const editButton = wrapper.find('.btn-edit');
        expect(editButton.exists()).toBe(true); // Check if the button exists

        // Mock the axios.put call to resolve with the updated trip data
        axios.put.mockResolvedValue({ data: updatedTrip });

        // Trigger click on the edit button
        await editButton.trigger('click');

        // Ensure that the trip's purpose is updated
        expect(wrapper.vm.trips[0].purpose).toBe('Updated Business');
    });
});