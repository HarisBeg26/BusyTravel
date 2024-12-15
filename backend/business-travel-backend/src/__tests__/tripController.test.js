const tripController = require('../controllers/tripController');
const tripService = require('../services/tripService');

jest.mock('../services/tripService', () => ({
    createTrip: jest.fn(),
    getTrips: jest.fn(),
    getTripById: jest.fn(),
    updateTrip: jest.fn(),
    deleteTrip: jest.fn(),
}));

describe('Trip Controller', () => {

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

    it('should create a trip and return status 201', async () => {
        const newTrip = { destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-05' };
        req.body = newTrip;

        tripService.createTrip.mockResolvedValue({ id: 1, ...newTrip });

        await tripController.createTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...newTrip });
    });

    it('should handle error in createTrip and return status 500', async () => {
        req.body = { destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-05' };

        tripService.createTrip.mockRejectedValue(new Error('Database error'));

        await tripController.createTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should get all trips and return status 200', async () => {
        const trips = [
            { id: 1, destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-05' },
            { id: 2, destination: 'London', startDate: '2024-12-10', endDate: '2024-12-15' },
        ];
        tripService.getTrips.mockResolvedValue(trips);

        await tripController.getTrips(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(trips);
    });

    it('should handle error in getTrips and return status 500', async () => {
        tripService.getTrips.mockRejectedValue(new Error('Database error'));

        await tripController.getTrips(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should get a trip by ID and return status 200', async () => {
        const trip = { id: 1, destination: 'Paris', startDate: '2024-12-01', endDate: '2024-12-05' };
        req.params.id = 1;

        tripService.getTripById.mockResolvedValue(trip);

        await tripController.getTripById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should handle error in getTripById and return status 500', async () => {
        req.params.id = 1;
        tripService.getTripById.mockRejectedValue(new Error('Trip not found'));

        await tripController.getTripById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Trip not found' });
    });

    it('should update a trip by ID and return status 200', async () => {
        const updatedTrip = { destination: 'Rome', startDate: '2024-12-01', endDate: '2024-12-05' };
        req.params.id = 1;
        req.body = updatedTrip;

        tripService.updateTrip.mockResolvedValue({ id: 1, ...updatedTrip });

        await tripController.updateTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...updatedTrip });
    });

    it('should handle error in updateTrip and return status 500', async () => {
        req.params.id = 1;
        req.body = { destination: 'Rome', startDate: '2024-12-01', endDate: '2024-12-05' };

        tripService.updateTrip.mockRejectedValue(new Error('Database error'));

        await tripController.updateTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should delete a trip by ID and return status 200', async () => {
        req.params.id = 1;

        tripService.deleteTrip.mockResolvedValue();

        await tripController.deleteTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Trip deleted successfully' });
    });

    it('should handle error in deleteTrip and return status 500', async () => {
        req.params.id = 1;

        tripService.deleteTrip.mockRejectedValue(new Error('Database error'));

        await tripController.deleteTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});
