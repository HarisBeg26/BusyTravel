const tripService = require('../services/tripService');

exports.createTrip = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);

        const trip = await tripService.createTrip(req.body);
        res.status(201).json(trip);
    } catch (error) {
        console.error("Error in createTrip controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.getTrips = async (req, res) => {
    try {
        const trips = await tripService.getTrips();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getTripById = async (req, res) => {
    try {
        const trip = await tripService.getTripById(req.params.id);
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateTrip = async (req, res) => {
    try {
        const updatedTrip = await tripService.updateTrip(req.params.id, req.body);
        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteTrip = async (req, res) => {
    try {
        await tripService.deleteTrip(req.params.id);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};