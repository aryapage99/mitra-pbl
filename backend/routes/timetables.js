const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { authenticateToken } = require('../middleware/auth');

// All timetable routes require authentication
router.use(authenticateToken);

// Get all timetables (with optional filters: roomId, roomType, dayOfWeek, program)
router.get('/', timetableController.getAllTimetables);

// Get list of all programs
router.get('/programs', timetableController.getPrograms);

// Get list of all rooms
router.get('/rooms', timetableController.getRooms);

// Get statistics
router.get('/stats', timetableController.getStats);

// Get timetable for a specific room (with optional day filter)
router.get('/room/:roomId', timetableController.getRoomTimetable);

// Get timetable for a specific program
router.get('/program/:program', timetableController.getProgramTimetable);

// Get timetable for a specific day
router.get('/day/:day', timetableController.getDayTimetable);

module.exports = router;
