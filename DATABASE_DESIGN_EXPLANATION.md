# Database Design Decision: Single Bookings Table

## Question
Should bookings be stored as:
1. One table for all bookings?
2. Separate tables per floor?
3. Separate tables per classroom?

## Answer: **ONE TABLE FOR ALL BOOKINGS** ✅

## Why This is the Best Approach

### 1. **Query Efficiency**
- ✅ Single query to get all bookings for a teacher
- ✅ Easy to search across all rooms and floors
- ✅ Simple joins with users table
- ❌ Multiple tables would require UNION queries or multiple requests

### 2. **Data Integrity**
- ✅ Constraints work across all bookings (no double-booking)
- ✅ Foreign key relationships are straightforward
- ✅ Single point of truth for all booking data
- ❌ Multiple tables would need complex triggers to prevent conflicts

### 3. **Scalability**
- ✅ Easy to add new floors or rooms (just insert new records)
- ✅ Indexes handle performance as data grows
- ✅ No schema changes needed for new rooms
- ❌ Multiple tables would require creating new tables and updating code

### 4. **Maintenance**
- ✅ Single table to backup, optimize, and maintain
- ✅ Simple to add new columns for features
- ✅ Easy to understand data structure
- ❌ Multiple tables increase complexity exponentially

### 5. **Application Logic**
- ✅ One model class handles all bookings
- ✅ Consistent API endpoints
- ✅ Simpler code, fewer bugs
- ❌ Multiple tables require routing logic and multiple models

## Our Implementation

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    room_id VARCHAR(50) NOT NULL,
    room_label VARCHAR(255) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,        -- Floor info stored in each record
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(3,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Optimization

To ensure the single table remains fast even with thousands of bookings, we added indexes:

```sql
-- Indexes for fast queries
CREATE INDEX idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_room_date ON bookings(room_id, booking_date);
```

### What These Indexes Do:
- **Teacher index**: Fast "My Bookings" queries
- **Room index**: Fast schedule lookups per room
- **Date index**: Fast date-range queries
- **Composite index**: Super fast room+date queries (most common use case)

## Real-World Comparison

### Single Table (Our Choice)
```javascript
// Get all teacher's bookings across all floors
SELECT * FROM bookings WHERE teacher_id = 123;

// Get room schedule
SELECT * FROM bookings WHERE room_id = '501' AND booking_date = '2025-11-20';

// Check for conflicts
SELECT * FROM bookings 
WHERE room_id = '501' 
AND booking_date = '2025-11-20' 
AND start_time < '11:00' 
AND end_time > '10:00';
```

### Multiple Tables (Not Recommended)
```javascript
// Get all teacher's bookings - REQUIRES MULTIPLE QUERIES!
SELECT * FROM bookings_floor_4 WHERE teacher_id = 123
UNION
SELECT * FROM bookings_floor_5 WHERE teacher_id = 123;

// Need to know which table to query
// More application logic needed
// More potential for bugs
```

## When Would Multiple Tables Make Sense?

Only in extreme cases:
- **Millions of bookings** with different retention policies per floor
- **Completely separate systems** for different buildings
- **Different security/access requirements** per floor

For a college building with 2-3 floors and dozens of rooms, a single table is perfect.

## Conclusion

**One bookings table** gives you:
- ✅ Simple, maintainable code
- ✅ Fast queries with proper indexes
- ✅ Easy to add features
- ✅ No data duplication
- ✅ Strong data integrity

This is the industry-standard approach and exactly what we've implemented for your Mitra system.
