const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const db = require('../config/database');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { roomId, roomLabel, roomType, floor, bookingDate, startTime, endTime } = req.body;
    const teacherId = req.user.userId;

    // Validate required fields
    if (!roomId || !roomLabel || !roomType || !floor || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Calculate duration in hours
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);

    // Validate duration based on room type
    if (roomType === 'classroom' && durationHours > 1) {
      return res.status(400).json({
        success: false,
        message: 'Classrooms can only be booked for a maximum of 1 hour'
      });
    }

    if (roomType === 'lab' && durationHours > 2) {
      return res.status(400).json({
        success: false,
        message: 'Labs can only be booked for a maximum of 2 hours'
      });
    }

    if (durationHours <= 0) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check for overlapping bookings
    const hasOverlap = await Booking.checkOverlap(roomId, bookingDate, startTime, endTime);
    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for this room'
      });
    }

    // Create the booking
    const booking = await Booking.create({
      teacherId,
      roomId,
      roomLabel,
      roomType,
      floor,
      bookingDate,
      startTime,
      endTime,
      durationHours
    });

    // Get teacher details from users table
    const userResult = await db.query(
      'SELECT email FROM users WHERE id = $1',
      [teacherId]
    );
    const teacherEmail = userResult.rows[0]?.email;

    // Add/update teacher in teacher table (upsert based on teacher_id)
    if (teacherEmail) {
      // Extract name from email (part before @)
      const teacherName = teacherEmail.split('@')[0];
      
      await db.query(
        `INSERT INTO teacher (teacher_id, name, email) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (teacher_id) 
         DO UPDATE SET 
           name = EXCLUDED.name,
           email = EXCLUDED.email`,
        [teacherId, teacherName, teacherEmail]
      );
    }

    // Add/update room in room table with booked status
    await db.query(
      `INSERT INTO room (room_id, room_number, type, status) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (room_id) 
       DO UPDATE SET 
         room_number = EXCLUDED.room_number,
         type = EXCLUDED.type,
         status = 'booked'`,
      [roomId, roomId, roomType, 'booked']
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle database constraint violations
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({
        success: false,
        message: 'Duration limit exceeded for this room type'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get all bookings for the logged-in teacher
const getMyBookings = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const bookings = await Booking.findByTeacher(teacherId);

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get all bookings for a specific room and date
const getRoomBookings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date } = req.query;

    if (!date) {
      // Get all bookings for the room
      const bookings = await Booking.findByRoom(roomId);
      return res.status(200).json({
        success: true,
        data: bookings
      });
    }

    // Get bookings for specific date
    const bookings = await Booking.findByRoomAndDate(roomId, date);
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching room bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room bookings',
      error: error.message
    });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.userId;

    // Check if booking exists
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking belongs to the logged-in teacher
    if (booking.teacher_id !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own bookings'
      });
    }

    // Store room_id before deletion
    const roomId = booking.room_id;

    // Delete the booking
    const deletedBooking = await Booking.delete(id, teacherId);
    
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already deleted'
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
      message: 'Booking deleted successfully',
      data: deletedBooking
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Get available slots for booking
const getAvailableSlots = async (req, res) => {
  try {
    const { roomId, date } = req.query;
    
    const slots = await Slot.getAvailableSlots(roomId, date);
    
    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getRoomBookings,
  deleteBooking,
  getBookingById,
  getAvailableSlots
};
