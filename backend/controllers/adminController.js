const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');
const db = require('../config/database');

// Admin Dashboard - Get all bookings with room grouping
const getDashboard = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();
    const slots = await Slot.getAllSlots();

    // Group bookings by room
    const bookingsByRoom = {};
    bookings.forEach(booking => {
      const roomKey = booking.room_id;
      if (!bookingsByRoom[roomKey]) {
        bookingsByRoom[roomKey] = {
          roomInfo: {
            id: booking.room_id,
            label: booking.room_label,
            type: booking.room_type,
            floor: booking.floor
          },
          bookings: []
        };
      }
      bookingsByRoom[roomKey].bookings.push({
        id: booking.id,
        teacherEmail: booking.teacher_email,
        teacherId: booking.teacher_id,
        date: booking.booking_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        duration: booking.duration_hours,
        createdAt: booking.created_at
      });
    });

    // Group slots by room
    const slotsByRoom = {};
    slots.forEach(slot => {
      const roomKey = slot.room_id;
      if (!slotsByRoom[roomKey]) {
        slotsByRoom[roomKey] = {
          roomInfo: {
            id: slot.room_id,
            label: slot.room_label,
            type: slot.room_type,
            floor: slot.floor
          },
          slots: []
        };
      }
      slotsByRoom[roomKey].slots.push({
        id: slot.id,
        date: slot.slot_date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        duration: slot.duration_hours,
        isAvailable: slot.is_available,
        createdBy: slot.created_by_email,
        createdAt: slot.created_at
      });
    });

    res.status(200).json({
      success: true,
      data: {
        bookingsByRoom,
        slotsByRoom,
        summary: {
          totalBookings: bookings.length,
          totalSlots: slots.length,
          availableSlots: slots.filter(s => s.is_available).length,
          totalRooms: Object.keys(bookingsByRoom).length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Create new slot
const createSlot = async (req, res) => {
  try {
    const { roomId, roomLabel, roomType, floor, slotDate, startTime, endTime } = req.body;
    const createdBy = req.user.userId;

    // Validate required fields
    if (!roomId || !roomLabel || !roomType || !floor || !slotDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Calculate duration in hours
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours <= 0) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check for overlapping slots
    const hasOverlap = await Slot.checkOverlap(roomId, slotDate, startTime, endTime);
    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message: 'This time slot overlaps with an existing slot'
      });
    }

    const newSlot = await Slot.create({
      roomId,
      roomLabel,
      roomType,
      floor,
      slotDate,
      startTime,
      endTime,
      durationHours,
      createdBy
    });

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      data: newSlot
    });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create slot'
    });
  }
};

// Delete any booking (admin override)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Store teacher_id and room_id before deletion
    const teacherId = booking.teacher_id;
    const roomId = booking.room_id;

    // Admin can delete any booking using adminDelete method
    const result = await Booking.adminDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if teacher has any remaining bookings
    const remainingBookings = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE teacher_id = $1',
      [teacherId]
    );
    
    // If teacher has no more bookings, remove from teacher table
    if (parseInt(remainingBookings.rows[0].count) === 0) {
      await db.query(
        'DELETE FROM teacher WHERE teacher_id = $1',
        [teacherId]
      );
    }

    // Check if room has any remaining active bookings
    const roomBookings = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE room_id = $1',
      [roomId]
    );
    
    // If no more bookings for this room, set status to available
    if (parseInt(roomBookings.rows[0].count) === 0) {
      await db.query(
        'UPDATE room SET status = $1 WHERE room_id = $2',
        ['available', roomId]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
};

// Delete slot
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.delete(id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slot'
    });
  }
};

// Update slot availability
const updateSlotAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable must be a boolean value'
      });
    }

    const updatedSlot = await Slot.updateAvailability(id, isAvailable);
    if (!updatedSlot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slot availability updated successfully',
      data: updatedSlot
    });
  } catch (error) {
    console.error('Error updating slot availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slot availability'
    });
  }
};

// Get all users (for admin user management)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get all slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.getAllSlots();
    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slots'
    });
  }
};

module.exports = {
  getDashboard,
  createSlot,
  deleteBooking,
  deleteSlot,
  updateSlotAvailability,
  getAllUsers,
  getAllSlots
};