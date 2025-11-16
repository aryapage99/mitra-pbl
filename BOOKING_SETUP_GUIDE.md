# Booking System Setup Guide

This guide will help you set up the new booking functionality for the Mitra Interactive Room Allocator.

## 🎯 Overview

The booking system now includes:
- ✅ Database table for storing bookings
- ✅ Backend API for creating, viewing, and deleting bookings
- ✅ Duration limits: 1 hour for classrooms, 2 hours for labs
- ✅ Teacher-only booking capabilities
- ✅ Booking history page for teachers
- ✅ Real-time room schedule viewing for all users

## 📋 Setup Steps

### 1. Update the Database

Run the SQL migration to create the bookings table:

```cmd
cd c:\dev\mitra-pbl\backend
```

Then execute the SQL file in PostgreSQL:

```cmd
psql -U postgres -d mitra_db -f sql\add_bookings_table.sql
```

Or manually run the SQL in your PostgreSQL client:
- Open `backend/sql/add_bookings_table.sql`
- Execute it in your `mitra_db` database

### 2. Verify Database Setup

Check if the table was created:

```sql
\dt bookings
SELECT * FROM bookings;
```

### 3. Start the Backend Server

```cmd
cd c:\dev\mitra-pbl\backend
npm start
```

The backend should now be running on `http://localhost:5000`

### 4. Start the Frontend

Open a new terminal:

```cmd
cd c:\dev\mitra-pbl\frontend
npm start
```

The frontend should open at `http://localhost:3000`

## 🎮 How to Use

### For Teachers:

1. **Login** as a teacher account
2. **Book a Room**:
   - Click on any classroom or lab
   - Click the "Book" button on the room card
   - Select a date (today or future)
   - Click "Book 1 hour" or "Book 2 hours" (labs only) for available slots
   - Confirmation message will appear

3. **View Your Bookings**:
   - Click the profile icon (👤) in the top right
   - Select "My Bookings"
   - See all upcoming and past bookings
   - Cancel upcoming bookings if needed

### For Students:

1. **Login** as a student account
2. **View Room Schedules**:
   - Click on any classroom or lab
   - View the schedule showing booked and available slots
   - See which teacher has booked each slot

## 🔍 Testing the System

### Test Data

The migration includes sample bookings. To test with your own teacher account:

1. Login as a teacher (create one if needed)
2. Try booking a classroom for 1 hour
3. Try booking a lab for 2 hours
4. Try to book an overlapping slot (should fail)
5. View your bookings in the profile
6. Cancel a booking

### API Endpoints

Test the API directly if needed:

**Create Booking:**
```
POST http://localhost:5000/api/bookings/create
Headers: Authorization: Bearer <token>
Body: {
  "roomId": "501",
  "roomLabel": "Classroom 501",
  "roomType": "classroom",
  "floor": 5,
  "bookingDate": "2025-11-20",
  "startTime": "10:00:00",
  "endTime": "11:00:00"
}
```

**Get My Bookings:**
```
GET http://localhost:5000/api/bookings/my-bookings
Headers: Authorization: Bearer <token>
```

**Get Room Bookings:**
```
GET http://localhost:5000/api/bookings/room/501?date=2025-11-20
```

**Delete Booking:**
```
DELETE http://localhost:5000/api/bookings/:id
Headers: Authorization: Bearer <token>
```

## 🔒 Business Rules Implemented

1. **Duration Limits:**
   - Classrooms: Maximum 1 hour per booking
   - Labs: Maximum 2 hours per booking

2. **Access Control:**
   - Only teachers can create and delete bookings
   - Students can view all schedules
   - Teachers can only delete their own bookings

3. **Conflict Prevention:**
   - No overlapping bookings for the same room
   - Database constraints ensure data integrity

4. **Time Slots:**
   - Available from 9:00 AM to 4:00 PM
   - Hourly slots for easy booking

## 📊 Database Schema

**Bookings Table:**
- `id`: Primary key (auto-increment)
- `teacher_id`: Foreign key to users table
- `room_id`: Room identifier (e.g., "501", "lab528")
- `room_label`: Display name
- `room_type`: "classroom" or "lab"
- `floor`: Floor number
- `booking_date`: Date of booking
- `start_time`: Start time
- `end_time`: End time
- `duration_hours`: Duration in hours
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Constraints:**
- Unique constraint on (room_id, booking_date, start_time)
- Check constraint for duration limits
- Check constraint for valid time range
- Foreign key constraint on teacher_id

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database connection error:**
- Check PostgreSQL is running
- Verify `.env` file has correct database credentials
- Test connection: `psql -U postgres -d mitra_db`

### Frontend Issues

**API calls failing:**
- Check backend is running on port 5000
- Verify CORS settings in backend
- Check browser console for errors

**Booking not appearing:**
- Refresh the page
- Check network tab in browser dev tools
- Verify JWT token is being sent

## 📁 New Files Created

**Backend:**
- `backend/sql/add_bookings_table.sql` - Database migration
- `backend/models/Booking.js` - Booking model
- `backend/controllers/bookingController.js` - Booking business logic
- `backend/routes/bookings.js` - Booking API routes
- Updated: `backend/middleware/auth.js` - Added requireTeacher middleware
- Updated: `backend/server.js` - Added booking routes

**Frontend:**
- `frontend/src/services/bookingService.js` - Booking API service
- `frontend/src/components/profile/BookingHistory.js` - Booking history page
- Updated: `frontend/src/components/ui/Modals.js` - Real booking functionality
- Updated: `frontend/src/components/ui/Navigation.js` - Added "My Bookings" menu
- Updated: `frontend/src/App.js` - Added booking history navigation

## 🎉 Success!

Your booking system is now fully functional! Teachers can book rooms with proper duration limits, view their booking history, and cancel bookings. Students can view all room schedules in real-time.

## 📝 Next Steps (Optional Enhancements)

Consider adding:
- Email notifications for new bookings
- Recurring bookings (weekly classes)
- Booking approval workflow
- Room capacity management
- Export bookings to calendar (iCal)
- Analytics dashboard for room utilization
