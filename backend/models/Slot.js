const db = require('../config/database');

class Slot {
  // Create a new slot
  static async create(slotData) {
    const { 
      roomId, 
      roomLabel, 
      roomType, 
      floor, 
      slotDate, 
      startTime, 
      endTime, 
      durationHours,
      createdBy 
    } = slotData;

    try {
      const result = await db.query(
        `INSERT INTO slots 
        (room_id, room_label, room_type, floor, slot_date, start_time, end_time, duration_hours, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [roomId, roomLabel, roomType, floor, slotDate, startTime, endTime, durationHours, createdBy]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all slots
  static async getAllSlots() {
    try {
      const result = await db.query(
        `SELECT s.*, u.email as created_by_email 
        FROM slots s
        JOIN users u ON s.created_by = u.id
        ORDER BY s.slot_date DESC, s.start_time DESC`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get slots by room and date
  static async getSlotsByRoomAndDate(roomId, slotDate) {
    try {
      const result = await db.query(
        `SELECT s.*, u.email as created_by_email 
        FROM slots s
        JOIN users u ON s.created_by = u.id
        WHERE s.room_id = $1 AND s.slot_date = $2 
        ORDER BY s.start_time ASC`,
        [roomId, slotDate]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get available slots for booking
  static async getAvailableSlots(roomId = null, slotDate = null) {
    try {
      let query = `SELECT s.*, u.email as created_by_email 
                  FROM slots s
                  JOIN users u ON s.created_by = u.id
                  WHERE s.is_available = true`;
      const params = [];

      if (roomId) {
        params.push(roomId);
        query += ` AND s.room_id = $${params.length}`;
      }

      if (slotDate) {
        params.push(slotDate);
        query += ` AND s.slot_date = $${params.length}`;
      }

      query += ` ORDER BY s.slot_date ASC, s.start_time ASC`;

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update slot availability
  static async updateAvailability(id, isAvailable) {
    try {
      const result = await db.query(
        'UPDATE slots SET is_available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [isAvailable, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a slot
  static async delete(id) {
    try {
      const result = await db.query(
        'DELETE FROM slots WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find slot by ID
  static async findById(id) {
    try {
      const result = await db.query(
        `SELECT s.*, u.email as created_by_email 
        FROM slots s
        JOIN users u ON s.created_by = u.id
        WHERE s.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check for overlapping slots
  static async checkOverlap(roomId, slotDate, startTime, endTime, excludeSlotId = null) {
    try {
      let query = `
        SELECT * FROM slots 
        WHERE room_id = $1 
        AND slot_date = $2 
        AND (
          (start_time < $4 AND end_time > $3)
        )
      `;
      const params = [roomId, slotDate, startTime, endTime];

      if (excludeSlotId) {
        query += ' AND id != $5';
        params.push(excludeSlotId);
      }

      const result = await db.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Slot;