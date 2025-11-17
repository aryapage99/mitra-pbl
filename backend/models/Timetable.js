const db = require('../config/database');

class Timetable {
  // Get all timetables with optional filters
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM timetables WHERE 1=1';
      const params = [];
      let paramCount = 1;

      // Add filters
      if (filters.roomId) {
        query += ` AND room_id = $${paramCount}`;
        params.push(filters.roomId);
        paramCount++;
      }

      if (filters.roomType) {
        query += ` AND room_type = $${paramCount}`;
        params.push(filters.roomType);
        paramCount++;
      }

      if (filters.dayOfWeek) {
        query += ` AND day_of_week = $${paramCount}`;
        params.push(filters.dayOfWeek);
        paramCount++;
      }

      if (filters.program) {
        query += ` AND program ILIKE $${paramCount}`;
        params.push(`%${filters.program}%`);
        paramCount++;
      }

      query += ' ORDER BY room_id, day_of_week, start_time';

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get timetables for a specific room
  static async getByRoom(roomId) {
    try {
      const result = await db.query(
        'SELECT * FROM timetables WHERE room_id = $1 ORDER BY day_of_week, start_time',
        [roomId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get timetables for a specific room and day
  static async getByRoomAndDay(roomId, dayOfWeek) {
    try {
      const result = await db.query(
        'SELECT * FROM timetables WHERE room_id = $1 AND day_of_week = $2 ORDER BY start_time',
        [roomId, dayOfWeek]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get timetables for a specific program
  static async getByProgram(program) {
    try {
      const result = await db.query(
        'SELECT * FROM timetables WHERE program ILIKE $1 ORDER BY day_of_week, start_time',
        [`%${program}%`]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get timetables for a specific day
  static async getByDay(dayOfWeek) {
    try {
      const result = await db.query(
        'SELECT * FROM timetables WHERE day_of_week = $1 ORDER BY room_id, start_time',
        [dayOfWeek]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get unique list of programs
  static async getPrograms() {
    try {
      const result = await db.query(
        'SELECT DISTINCT program FROM timetables WHERE program IS NOT NULL ORDER BY program'
      );
      return result.rows.map(row => row.program);
    } catch (error) {
      throw error;
    }
  }

  // Get unique list of rooms
  static async getRooms() {
    try {
      const result = await db.query(
        'SELECT DISTINCT room_id, room_type, capacity FROM timetables ORDER BY room_id'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const totalEntries = await db.query('SELECT COUNT(*) as count FROM timetables');
      const totalRooms = await db.query('SELECT COUNT(DISTINCT room_id) as count FROM timetables');
      const totalPrograms = await db.query('SELECT COUNT(DISTINCT program) as count FROM timetables');
      const classroomCount = await db.query('SELECT COUNT(DISTINCT room_id) as count FROM timetables WHERE room_type = $1', ['classroom']);
      const labCount = await db.query('SELECT COUNT(DISTINCT room_id) as count FROM timetables WHERE room_type = $1', ['lab']);

      return {
        totalEntries: parseInt(totalEntries.rows[0].count),
        totalRooms: parseInt(totalRooms.rows[0].count),
        totalPrograms: parseInt(totalPrograms.rows[0].count),
        classrooms: parseInt(classroomCount.rows[0].count),
        labs: parseInt(labCount.rows[0].count)
      };
    } catch (error) {
      throw error;
    }
  }

  // Find by ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM timetables WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Timetable;
