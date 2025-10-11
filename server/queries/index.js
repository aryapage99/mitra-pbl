const pool = require('../config/db');

// User queries
const createUser = async (username, email, hashedPassword) => {
  const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
  const values = [username, email, hashedPassword];
  return pool.query(query, values);
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  return pool.query(query, [email]);
};

const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  return pool.query(query, [id]);
};

// Floor queries
const getAllFloors = async () => {
  const query = 'SELECT * FROM floors ORDER BY floor_number';
  return pool.query(query);
};

const getFloorById = async (id) => {
  const query = 'SELECT * FROM floors WHERE id = $1';
  return pool.query(query, [id]);
};

// Classroom queries
const getClassroomsByFloor = async (floorId) => {
  const query = 'SELECT * FROM classrooms WHERE floor_id = $1 ORDER BY room_number';
  return pool.query(query, [floorId]);
};

const getClassroomById = async (id) => {
  const query = 'SELECT * FROM classrooms WHERE id = $1';
  return pool.query(query, [id]);
};

const getAllClassrooms = async () => {
  const query = 'SELECT c.*, f.floor_number FROM classrooms c JOIN floors f ON c.floor_id = f.id ORDER BY f.floor_number, c.room_number';
  return pool.query(query);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllFloors,
  getFloorById,
  getClassroomsByFloor,
  getClassroomById,
  getAllClassrooms,
};
