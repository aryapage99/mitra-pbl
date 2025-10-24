const db = require('../config/database');

class User {
  static async findByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { email, password, role } = userData;
    try {
      const result = await db.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
        [email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const result = await db.query(
        'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, userData) {
    const { email, role } = userData;
    try {
      const result = await db.query(
        'UPDATE users SET email = $1, role = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, role, updated_at',
        [email, role, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const result = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;