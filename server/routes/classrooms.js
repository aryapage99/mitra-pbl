const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// Classroom routes
router.get('/', classroomController.getAllClassrooms);
router.get('/floor/:floorId', classroomController.getClassroomsByFloor);
router.get('/:id', classroomController.getClassroomById);

module.exports = router;
