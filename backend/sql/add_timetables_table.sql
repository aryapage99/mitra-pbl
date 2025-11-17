-- Create timetables table for permanent schedules
CREATE TABLE IF NOT EXISTS timetables (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(20) NOT NULL,
    room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('classroom', 'lab')),
    capacity INTEGER,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    program VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure valid time range
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_timetables_room ON timetables(room_id);
CREATE INDEX IF NOT EXISTS idx_timetables_day ON timetables(day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetables_program ON timetables(program);
CREATE INDEX IF NOT EXISTS idx_timetables_room_day ON timetables(room_id, day_of_week);

-- Add a comment to the table
COMMENT ON TABLE timetables IS 'Permanent timetable schedules for classrooms and labs';
