-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id VARCHAR(50) NOT NULL,
    room_label VARCHAR(255) NOT NULL,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('classroom', 'lab')),
    floor INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(3,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure no overlapping bookings for same room
    CONSTRAINT no_overlap UNIQUE (room_id, booking_date, start_time),
    
    -- Ensure duration limits: classroom max 1 hour, lab max 2 hours
    CONSTRAINT duration_limit CHECK (
        (room_type = 'classroom' AND duration_hours <= 1) OR
        (room_type = 'lab' AND duration_hours <= 2)
    ),
    
    -- Ensure end_time is after start_time
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_room_date ON bookings(room_id, booking_date);

-- Insert some sample bookings for testing
INSERT INTO bookings (teacher_id, room_id, room_label, room_type, floor, booking_date, start_time, end_time, duration_hours) 
VALUES 
-- Assuming teacher with id 2 exists (from init.sql)
(2, '501', 'Classroom 501', 'classroom', 5, CURRENT_DATE, '09:00:00', '10:00:00', 1),
(2, 'lab528', 'Lab 528', 'lab', 5, CURRENT_DATE, '11:00:00', '13:00:00', 2),
(2, '502', 'Classroom 502', 'classroom', 5, CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:00:00', 1)
ON CONFLICT DO NOTHING;
