const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floorController');

// Floor routes
router.get('/', floorController.getAllFloors);
router.get('/:id', floorController.getFloorById);

module.exports = router;
