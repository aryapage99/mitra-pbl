-- Create the mitra_db database (run this first)
-- CREATE DATABASE mitra_db;

-- Connect to mitra_db and run the following:

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create slots table for admin-managed time slots
CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    room_label VARCHAR(100) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    floor VARCHAR(10) NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(3,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for slots table
CREATE INDEX IF NOT EXISTS idx_slots_room_date ON slots(room_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_availability ON slots(is_available);

-- Insert some sample users for testing
INSERT INTO users (email, password, role) VALUES 
('student@college.edu', 'password123', 'student'),
('teacher@college.edu', 'password123', 'teacher'),
('admin@college.edu', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;