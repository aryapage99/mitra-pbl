-- Create the mitra_db database (run this first)
-- CREATE DATABASE mitra_db;

-- Connect to mitra_db and run the following:

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample users for testing
INSERT INTO users (email, password, role) VALUES 
('student@college.edu', 'password123', 'student'),
('teacher@college.edu', 'password123', 'teacher'),
('admin@college.edu', 'admin123', 'teacher')
ON CONFLICT (email) DO NOTHING;