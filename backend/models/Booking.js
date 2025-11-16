const db = require('../config/database');

class Booking {
  // Create a new booking
  static async create(bookingData) {
    const { 
      teacherId, 
      roomId, 
      roomLabel, 
      roomType, 
      floor, 
      bookingDate, 
      startTime, 
      endTime, 
      durationHours 
    } = bookingData;

    try {
      const result = await db.query(
        `INSERT INTO bookings 
        (teacher_id, room_id, room_label, room_type, floor, booking_date, start_time, end_time, duration_hours) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [teacherId, roomId, roomLabel, roomType, floor, bookingDate, startTime, endTime, durationHours]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find all bookings by teacher
  static async findByTeacher(teacherId) {
    try {
      const result = await db.query(
        `SELECT b.*, u.email as teacher_email 
        FROM bookings b
        JOIN users u ON b.teacher_id = u.id
        WHERE b.teacher_id = $1 
        ORDER BY b.booking_date DESC, b.start_time DESC`,
        [teacherId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Find all bookings for a specific room on a specific date
  static async findByRoomAndDate(roomId, bookingDate) {
    try {
      const result = await db.query(
        `SELECT b.*, u.email as teacher_email 
        FROM bookings b
        JOIN users u ON b.teacher_id = u.id
        WHERE b.room_id = $1 AND b.booking_date = $2 
        ORDER BY b.start_time ASC`,
        [roomId, bookingDate]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Find all bookings for a specific room (all dates)
  static async findByRoom(roomId) {
    try {
      const result = await db.query(
        `SELECT b.*, u.email as teacher_email 
        FROM bookings b
        JOIN users u ON b.teacher_id = u.id
        WHERE b.room_id = $1 
        ORDER BY b.booking_date DESC, b.start_time ASC`,
        [roomId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Find booking by ID
  static async findById(id) {
    try {
      const result = await db.query(
        `SELECT b.*, u.email as teacher_email 
        FROM bookings b
        JOIN users u ON b.teacher_id = u.id
        WHERE b.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a booking
  static async delete(id, teacherId) {
    try {
      const result = await db.query(
        'DELETE FROM bookings WHERE id = $1 AND teacher_id = $2 RETURNING *',
        [id, teacherId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check for overlapping bookings
  static async checkOverlap(roomId, bookingDate, startTime, endTime, excludeBookingId = null) {
    try {
      let query = `
        SELECT * FROM bookings 
        WHERE room_id = $1 
        AND booking_date = $2 
        AND (
          (start_time < $4 AND end_time > $3)
        )
      `;
      const params = [roomId, bookingDate, startTime, endTime];

      if (excludeBookingId) {
        query += ' AND id != $5';
        params.push(excludeBookingId);
      }

      const result = await db.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings (for admin purposes)
  static async getAllBookings() {
    try {
      const result = await db.query(
        `SELECT b.*, u.email as teacher_email 
        FROM bookings b
        JOIN users u ON b.teacher_id = u.id
        ORDER BY b.booking_date DESC, b.start_time DESC`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;
