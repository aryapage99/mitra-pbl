const Booking = require('../models/Booking');

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

    // Delete the booking
    const deletedBooking = await Booking.delete(id, teacherId);
    
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already deleted'
      });
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

module.exports = {
  createBooking,
  getMyBookings,
  getRoomBookings,
  deleteBooking,
  getBookingById
};
