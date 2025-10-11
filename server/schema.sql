-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create floors table
CREATE TABLE IF NOT EXISTS floors (
  id SERIAL PRIMARY KEY,
  floor_number INTEGER NOT NULL UNIQUE,
  floor_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
  id SERIAL PRIMARY KEY,
  floor_id INTEGER REFERENCES floors(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample floors
INSERT INTO floors (floor_number, floor_name) VALUES
  (1, 'Ground Floor'),
  (2, 'First Floor'),
  (3, 'Second Floor')
ON CONFLICT (floor_number) DO NOTHING;

-- Insert sample classrooms
INSERT INTO classrooms (floor_id, room_number, capacity) VALUES
  (1, '101', 30),
  (1, '102', 35),
  (1, '103', 40),
  (2, '201', 30),
  (2, '202', 35),
  (2, '203', 40),
  (3, '301', 30),
  (3, '302', 35),
  (3, '303', 40);
