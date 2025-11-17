const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

// All booking routes require authentication
router.use(authenticateToken);

// Create a new booking (teachers only)
router.post('/create', requireTeacher, bookingController.createBooking);

// Get all bookings for the logged-in teacher
router.get('/my-bookings', requireTeacher, bookingController.getMyBookings);

// Get all bookings for a specific room (with optional date filter)
// Both students and teachers can view room bookings
router.get('/room/:roomId', bookingController.getRoomBookings);

// Get available slots for booking
router.get('/available-slots', bookingController.getAvailableSlots);

// Get a specific booking by ID
router.get('/:id', bookingController.getBookingById);

// Delete a booking (teachers only, own bookings)
router.delete('/:id', requireTeacher, bookingController.deleteBooking);

module.exports = router;
