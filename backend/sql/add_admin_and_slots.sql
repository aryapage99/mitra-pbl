-- Migration script to add slots table and update user roles
-- Run this after the initial database setup

-- Update users table to support admin role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'));

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

-- Update existing admin user or create if doesn't exist
INSERT INTO users (email, password, role) VALUES 
('admin@college.edu', 'admin123', 'admin')
ON CONFLICT (email) 
DO UPDATE SET role = 'admin';

-- Add some sample slots for testing
INSERT INTO slots (room_id, room_label, room_type, floor, slot_date, start_time, end_time, duration_hours, created_by)
SELECT 
    'R101', 'Classroom 101', 'classroom', '1', 
    CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00', 1.00,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO slots (room_id, room_label, room_type, floor, slot_date, start_time, end_time, duration_hours, created_by)
SELECT 
    'R101', 'Classroom 101', 'classroom', '1', 
    CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00', 1.00,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO slots (room_id, room_label, room_type, floor, slot_date, start_time, end_time, duration_hours, created_by)
SELECT 
    'L201', 'Physics Lab', 'lab', '2', 
    CURRENT_DATE + INTERVAL '1 day', '14:00:00', '16:00:00', 2.00,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'admin')
ON CONFLICT DO NOTHING;