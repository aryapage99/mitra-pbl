# Setup Guide - Booking & Timetable Systems

This guide covers the setup process for the new booking and timetable viewing features.

## Prerequisites

- PostgreSQL database running (connection configured in `backend/.env`)
- Node.js and npm installed
- Both backend and frontend folders initialized

## Step 1: Install Dependencies

Navigate to the backend folder and install the new `csv-parser` dependency:

```cmd
cd backend
npm install
```

This will install `csv-parser` along with any other missing dependencies.

## Step 2: Run Database Migrations

Execute the SQL migration files to create the necessary tables:

### For Bookings Table:
```cmd
psql -U postgres -d mitra_db -f sql\add_bookings_table.sql
```

### For Timetables Table:
```cmd
psql -U postgres -d mitra_db -f sql\add_timetables_table.sql
```

**Note:** Replace `postgres` with your PostgreSQL username and `mitra_db` with your database name if different.

### Alternative: If psql is not in PATH

You can execute the SQL files directly in your PostgreSQL client (pgAdmin, DBeaver, etc.) by opening and running:
- `backend/sql/add_bookings_table.sql`
- `backend/sql/add_timetables_table.sql`

## Step 3: Import Timetable Data from CSV

Run the import script to parse the CSV files and populate the timetables table:

```cmd
node scripts\import-timetables.js
```

This script will:
- Read both CSV files from `backend/allocation/` directory
- Parse classroom and lab schedules
- Insert data into the `timetables` table
- Display progress and summary

**Expected Output:**
```
Importing classroom allocations...
Processing room: 102, program: BCA-I, day: Monday, time: 08:30-09:30
Processing room: 102, program: BCA-I, day: Monday, time: 09:30-10:30
...
Imported 150 classroom entries

Importing lab allocations...
Processing room: LAB-1, program: BCA-II, day: Tuesday, time: 08:30-10:30
...
Imported 75 lab entries

✅ Timetable import completed successfully!
Total entries: 225
```

## Step 4: Verify Database Setup

Check that all tables were created and populated correctly:

```sql
-- Check bookings table structure
\d bookings

-- Check timetables table structure
\d timetables

-- Count timetable entries
SELECT COUNT(*) FROM timetables;

-- Sample timetables data
SELECT * FROM timetables LIMIT 5;
```

## Step 5: Start the Application

### Start Backend:
```cmd
cd backend
npm start
```

Backend should start on `http://localhost:5000`

### Start Frontend (in a new terminal):
```cmd
cd frontend
npm start
```

Frontend should open at `http://localhost:3000`

## Step 6: Test the Features

### Testing Booking System:

1. **Login as a Teacher:**
   - Use a teacher account (role: 'teacher')

2. **Create a Booking:**
   - Navigate to the floor map
   - Click any classroom or lab
   - Select the "Book This Room" tab
   - Choose a date and time slot
   - Select duration (1 hour for classroom, up to 2 hours for lab)
   - Click "Confirm Booking"

3. **View Bookings:**
   - Click your profile picture → "My Booking History"
   - See all upcoming and past bookings
   - Delete bookings if needed

4. **Test Validation:**
   - Try booking a classroom for 2 hours (should fail)
   - Try booking a lab for 3 hours (should fail)
   - Try booking the same room twice at the same time (should detect conflict)

### Testing Timetable System:

1. **Access Timetables:**
   - Login as a teacher
   - Click profile picture → "View Timetables"

2. **Test Filters:**
   - **Search:** Type a program name like "BCA" or room like "102"
   - **Program Dropdown:** Select a specific program (e.g., "BCA-I")
   - **Room Dropdown:** Select a specific room
   - **Day Dropdown:** Select a specific day of the week
   - **Room Type:** Toggle between "All", "Classrooms", "Labs"

3. **Verify Display:**
   - Check that timetables are grouped by day
   - Verify time slots display correctly
   - Ensure program names and room numbers are accurate
   - Test that multiple filters work together

## Troubleshooting

### Issue: CSV Import Fails

**Error:** `Cannot find module 'csv-parser'`
- **Solution:** Run `npm install` in the backend directory

**Error:** `ENOENT: no such file or directory`
- **Solution:** Verify CSV files exist in `backend/allocation/` directory
- Check file names match exactly (including spaces)

**Error:** Database connection error
- **Solution:** Check `.env` file for correct database credentials
- Ensure PostgreSQL is running

### Issue: Bookings Table Not Found

**Error:** `relation "bookings" does not exist`
- **Solution:** Run the booking migration: `psql -U postgres -d mitra_db -f sql\add_bookings_table.sql`

### Issue: No Timetables Showing

**Problem:** Timetables page is empty
- **Check:** Run import script: `node scripts\import-timetables.js`
- **Verify:** Query database: `SELECT COUNT(*) FROM timetables;`
- **Debug:** Check browser console for API errors

### Issue: Authentication Errors

**Error:** "Not authorized"
- **Solution:** Ensure you're logged in as a teacher
- Student accounts cannot access booking or timetable features

## Database Schema Reference

### Bookings Table:
```sql
- id: SERIAL PRIMARY KEY
- teacher_id: INTEGER (FK to users)
- room_id: VARCHAR(50)
- room_name: VARCHAR(100)
- room_type: VARCHAR(20) ('classroom' or 'lab')
- booking_date: DATE
- start_time: TIME
- end_time: TIME
- duration_hours: INTEGER
- created_at: TIMESTAMP
- UNIQUE(room_id, booking_date, start_time)
```

### Timetables Table:
```sql
- id: SERIAL PRIMARY KEY
- room_id: VARCHAR(50)
- room_name: VARCHAR(100)
- room_type: VARCHAR(20)
- day_of_week: VARCHAR(10)
- start_time: TIME
- end_time: TIME
- program_name: VARCHAR(100)
- created_at: TIMESTAMP
```

## API Endpoints Reference

### Booking Endpoints:
- `POST /api/bookings/create` - Create new booking (teachers only)
- `GET /api/bookings/my-bookings` - Get logged-in teacher's bookings
- `GET /api/bookings/room/:roomId` - Get all bookings for a room
- `DELETE /api/bookings/:id` - Delete a booking (owner only)

### Timetable Endpoints:
- `GET /api/timetables` - Get all timetables (supports query filters)
- `GET /api/timetables/programs` - Get list of all programs
- `GET /api/timetables/rooms` - Get list of all rooms
- `GET /api/timetables/stats` - Get timetable statistics
- `GET /api/timetables/room/:roomId` - Get timetable for specific room
- `GET /api/timetables/program/:program` - Get timetable for specific program
- `GET /api/timetables/day/:day` - Get timetable for specific day

## Next Steps

Once setup is complete:
1. Import additional CSV files as needed using the import script
2. Test the booking system with real teacher accounts
3. Gather feedback on timetable filtering and display
4. Consider adding export functionality for bookings
5. Implement email notifications for booking confirmations

## Support

For issues or questions:
- Check backend console logs for API errors
- Check browser console (F12) for frontend errors
- Verify PostgreSQL logs for database issues
- Review `backend/.env` for configuration problems
