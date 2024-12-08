const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Define all CRUD routes
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTripById);
router.get('/', tripController.getTrips);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
