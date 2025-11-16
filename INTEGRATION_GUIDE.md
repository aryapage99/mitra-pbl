# Mitra Full-Stack Integration Guide

This guide helps you set up and run both the backend and frontend for the Mitra Interactive Room Allocator system.

## 🗂️ Project Structure

```
c:\dev\mitra-pbl\
├── backend/                    # Node.js + Express + PostgreSQL API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sql/
│   └── server.js
└── frontend/                   # React Application
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── services/
    │   └── styles/
    └── public/
```

## 🚀 Quick Start Guide

### Prerequisites

1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory**:
   ```cmd
   cd c:\dev\mitra-pbl\backend
   ```

2. **Install dependencies**:
   ```cmd
   npm install
   ```

3. **Set up PostgreSQL database**:
   ```sql
   createdb mitra_db
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mitra_db
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   ```

5. **Initialize database**:
   ```cmd
   npm run setup-db
   ```

6. **Start the backend server**:
   ```cmd
   npm run dev
   ```
   
   Backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
   ```cmd
   cd c:\dev\mitra-pbl\frontend
   ```

2. **Install dependencies**:
   ```cmd
   npm install
   ```

3. **Start the frontend**:
   ```cmd
   npm start
   ```
   
   Frontend will run on: `http://localhost:3000`

## 🔐 Authentication Integration

<!-- ### How It Works -->
1. **User Registration/Login**:
   - Frontend sends credentials to backend API
   - Backend validates and returns JWT token
   - Token stored in localStorage for session management

2. **Protected Routes**:
   - JWT token sent with each API request
   - Backend middleware validates tokens
   - Expired tokens automatically clear user session

### Test Accounts

The database setup creates sample accounts:

| Email | Password | Role |
|-------|----------|------|
| `student@college.edu` | `password123` | Student |
| `teacher@college.edu` | `password123` | Teacher |
| `admin@college.edu` | `admin123` | Teacher |

### API Endpoints

**Authentication** (`/api/auth`):
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (requires auth)
- `GET /verify` - Verify token validity

**Users** (`/api/users`):
- `GET /` - Get all users (teachers only)
- `GET /:id` - Get user by ID (authenticated users)

## 🔧 Key Features Implemented

### Backend Features
- ✅ User authentication with JWT tokens
- ✅ Role-based authorization (Student/Teacher)
- ✅ PostgreSQL database integration
- ✅ CORS configuration for frontend
- ✅ Environment-based configuration
- ✅ Error handling and validation

### Frontend Features
- ✅ React Context for state management
- ✅ Axios for API communication
- ✅ JWT token handling
- ✅ Loading states and error handling
- ✅ Role-based UI (booking buttons for teachers only)
- ✅ Automatic token expiration handling

## 🧪 Testing the Integration

### 1. Registration Flow
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Enter email, password, and select role
4. Should automatically log you in after registration

### 2. Login Flow
1. Use existing test accounts
2. Should redirect to main application
3. Profile icon shows user email and role

### 3. Role-Based Features
- **Students**: Can view rooms but see "Teacher Access" on booking buttons
- **Teachers**: Can click "Book Slot" to open booking modal

### 4. Token Persistence
1. Login successfully
2. Refresh the page
3. Should remain logged in (token persisted in localStorage)

### 5. API Testing
Test backend directly:
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database `mitra_db` exists

2. **Frontend can't connect to backend**:
   - Check backend is running on port 5000
   - Verify `REACT_APP_API_URL` in frontend `.env`
   - Check browser console for CORS errors

3. **Authentication not working**:
   - Check network tab for API calls
   - Verify JWT_SECRET is set in backend `.env`
   - Check browser's localStorage for token

4. **Database connection errors**:
   ```bash
   # Test PostgreSQL connection
   psql -d mitra_db -c "SELECT * FROM users;"
   ```

### Debug Mode

**Backend Debug**:
```cmd
# Add debug logging
DEBUG=* npm run dev
```

**Frontend Debug**:
- Open browser Developer Tools
- Check Console for errors
- Check Network tab for API calls
- Check Application > localStorage for tokens

## 🚀 Next Steps

### Immediate Enhancements
1. **Add password hashing** (bcrypt)
2. **Implement room booking backend**
3. **Add form validation**
4. **Improve error messaging**

### Future Features
1. **Email verification**
2. **Password reset functionality**
3. **Real-time room availability**
4. **Calendar integration**
5. **Admin dashboard**

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mitra_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Technical Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **Context API** - State management
- **localStorage** - Token persistence

This integration provides a solid foundation for the Mitra room allocation system with proper authentication and role-based access control!