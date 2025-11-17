# Admin Features Setup and Usage Guide

## Overview
The admin system provides comprehensive management capabilities for classroom and lab booking slots. Admins can create, modify, and delete time slots, as well as manage existing bookings made by teachers.

## Setup Instructions

### 1. Database Migration
Before using admin features, run the migration to set up the necessary database tables and user roles:

```bash
cd backend
node scripts/migrate-admin-slots.js
```

This will:
- Update the user role constraints to include 'admin'
- Create the `slots` table for managing time slots
- Create an admin user with email `admin@college.edu` and password `admin123`
- Add sample slots for testing

### 2. Start the Application
Ensure both backend and frontend are running:

```bash
# Backend
cd backend
npm start

# Frontend (in separate terminal)
cd frontend
npm start
```

## Admin Features

### 1. Admin Dashboard Access
- Login with admin credentials: `admin@college.edu` / `admin123`
- Click on the profile icon (👤) in the top right
- Select "Admin Dashboard" from the dropdown menu

### 2. Dashboard Overview
The admin dashboard provides:
- **Summary Statistics**: Total bookings, slots, available slots, and rooms
- **Three Main Tabs**:
  - Bookings Overview
  - Slot Management
  - Create Slot

### 3. Bookings Overview Tab
**Features:**
- View all bookings grouped by room
- See teacher email, date, time, and duration for each booking
- **Admin Powers:**
  - Delete any booking (override teacher permissions)
  - View complete booking history across all users

**Use Cases:**
- Monitor room utilization
- Resolve scheduling conflicts
- Cancel bookings when needed

### 4. Slot Management Tab
**Features:**
- View all created slots grouped by room
- See slot availability status
- **Admin Powers:**
  - Enable/Disable slot availability
  - Delete slots completely
  - View slot creation details

**Use Cases:**
- Manage available time slots for booking
- Temporarily disable slots for maintenance
- Remove outdated or incorrect slots

### 5. Create Slot Tab
**Features:**
- Create new time slots for any room
- **Required Information:**
  - Room ID (e.g., R101, L201)
  - Room Label (e.g., "Classroom 101", "Physics Lab")
  - Room Type (classroom or lab)
  - Floor number
  - Date
  - Start and end times

**Validation:**
- Prevents overlapping slots for the same room and date
- Calculates duration automatically
- Ensures end time is after start time

## Admin Capabilities Summary

### Slot Management
✅ **Create new time slots** - Define available booking periods
✅ **Delete slots** - Remove slots completely from the system
✅ **Enable/Disable slots** - Control slot availability without deletion
✅ **View all slots** - Monitor all created slots across rooms

### Booking Management
✅ **View all bookings** - See bookings made by all teachers
✅ **Delete any booking** - Override teacher permissions to cancel bookings
✅ **Room-wise booking view** - Organized display by room for easy management

### User Management
✅ **View all users** - Access to user list (via API)
✅ **Admin role privileges** - Special permissions for all management tasks

## API Endpoints

### Admin-Only Endpoints (require admin authentication)
```
GET /api/admin/dashboard        # Get complete dashboard data
GET /api/admin/slots           # Get all slots
POST /api/admin/slots          # Create new slot
DELETE /api/admin/slots/:id    # Delete slot
PATCH /api/admin/slots/:id/availability  # Update slot availability
DELETE /api/admin/bookings/:id # Delete any booking
GET /api/admin/users          # Get all users
```

### General Endpoints (used by frontend)
```
GET /api/bookings/available-slots  # Get available slots for booking
```

## Security Features

1. **Role-Based Access Control**: Only users with 'admin' role can access admin endpoints
2. **Authentication Required**: All admin operations require valid JWT token
3. **Middleware Protection**: Admin-specific middleware checks user role
4. **Frontend Role Checking**: Admin UI only shows for admin users

## Integration with Existing System

The admin system integrates seamlessly with existing booking functionality:

1. **Teachers can still book available slots** - No changes to teacher workflow
2. **Admin-created slots become available for booking** - Slots appear in room booking interface
3. **Admin actions are immediate** - Slot/booking changes reflect instantly
4. **Audit trail maintained** - All actions track the admin user who performed them

## Testing the Admin System

1. Login as admin: `admin@college.edu` / `admin123`
2. Access Admin Dashboard from profile menu
3. Test each tab:
   - **Overview**: Check if sample bookings appear
   - **Slots**: View and manage sample slots created during migration
   - **Create**: Try creating a new slot for tomorrow

## Troubleshooting

### Common Issues:

1. **Admin option not visible**: Ensure you're logged in with admin role user
2. **Migration failed**: Check database connection and permissions
3. **Slot creation fails**: Verify no time conflicts exist
4. **Dashboard not loading**: Check backend logs for authentication issues

### Database Verification:
```sql
-- Check if admin user exists
SELECT * FROM users WHERE role = 'admin';

-- Check if slots table exists
SELECT * FROM slots LIMIT 5;

-- Verify user role constraints
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'users' AND constraint_type = 'CHECK';
```

## Future Enhancements

Potential features for future development:
- Bulk slot creation (multiple dates/times)
- Email notifications for booking cancellations
- Advanced reporting and analytics
- Room maintenance scheduling
- Teacher permissions management
- Booking approval workflows