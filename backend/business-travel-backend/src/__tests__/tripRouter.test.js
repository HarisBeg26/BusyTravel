const request = require('supertest');
const express = require('express');
const tripRouter = require('../routes/tripRoutes');
const tripController = require('../controllers/tripController');
const tripService = require('../services/tripService');

// Mock the tripService methods
jest.mock('../services/tripService', () => ({
    createTrip: jest.fn(),
    getTrips: jest.fn(),
    getTripById: jest.fn(),
    updateTrip: jest.fn(),
    deleteTrip: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/trips', tripRouter);

jest.setTimeout(10000); // Increase global timeout for all tests

describe('Trip Routes', () => {

    it('should create a new trip', async () => {
        const newTrip = { destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-10' };

        // Mock the createTrip service method to return a trip with id
        tripService.createTrip.mockResolvedValue({ id: 1, ...newTrip });

        const response = await request(app).post('/api/trips').send(newTrip);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body.destination).toBe('Paris');
    });

    it('should get a trip by ID', async () => {
        const tripId = 1;
        const trip = { id: 1, destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-10' };

        // Mock the getTripById service method to return a trip
        tripService.getTripById.mockResolvedValue(trip);

        const response = await request(app).get(`/api/trips/${tripId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(trip);
    });

    it('should get all trips', async () => {
        const trips = [
            { id: 1, destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-10' },
            { id: 2, destination: 'London', startDate: '2024-12-05', endDate: '2024-12-15' },
        ];

        // Mock the getTrips service method to return multiple trips
        tripService.getTrips.mockResolvedValue(trips);

        const response = await request(app).get('/api/trips');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(trips);
    });

    it('should update a trip by ID', async () => {
        const tripId = 1;
        const updatedTrip = { destination: 'Rome', startDate: '2024-12-01', endDate: '2024-12-10' };

        // Mock the updateTrip service method to return the updated trip
        tripService.updateTrip.mockResolvedValue({ id: tripId, ...updatedTrip });

        const response = await request(app).put(`/api/trips/${tripId}`).send(updatedTrip);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', tripId);
        expect(response.body.destination).toBe('Rome');
    });

    it('should delete a trip by ID', async () => {
        const tripId = 1;

        // Mock the deleteTrip service method to return success message
        tripService.deleteTrip.mockResolvedValue();

        const response = await request(app).delete(`/api/trips/${tripId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Trip deleted successfully');
    });

});
