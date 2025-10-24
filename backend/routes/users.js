const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users (teacher only)
router.get('/', authenticateToken, authorizeRole(['teacher']), async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID (authenticated users)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;