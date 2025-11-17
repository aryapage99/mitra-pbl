const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(adminAuth);

// Admin Dashboard Routes
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.get('/slots', adminController.getAllSlots);

// Slot Management Routes
router.post('/slots', adminController.createSlot);
router.delete('/slots/:id', adminController.deleteSlot);
router.patch('/slots/:id/availability', adminController.updateSlotAvailability);

// Booking Management Routes (Admin Override)
router.delete('/bookings/:id', adminController.deleteBooking);

module.exports = router;