# Mitra Backend API

Backend REST API for the Mitra Interactive Room Allocator system built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Role-based Authorization**: Student and Teacher roles
- **PostgreSQL Database**: Persistent data storage
- **RESTful API**: Clean and organized endpoints
- **CORS Support**: Cross-origin requests from frontend
- **Environment Configuration**: Secure environment variables

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   └── User.js             # User model and database queries
├── routes/
│   ├── auth.js             # Authentication routes
│   └── users.js            # User management routes
├── sql/
│   └── init.sql            # Database schema initialization
├── .env.example            # Environment variables template
├── .env                    # Environment variables (created from template)
├── .gitignore
├── package.json
├── server.js               # Main application entry point
└── README.md
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create Database**:
   ```sql
   createdb mitra_db
   ```
3. **Run the initialization script**:
   ```bash
   psql -d mitra_db -f sql/init.sql
   ```

### 3. Environment Configuration

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file** with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mitra_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=24h
   
   FRONTEND_URL=http://localhost:3000
   ```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token validity

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### User Routes (`/api/users`)

#### GET `/api/users`
Get all users (teachers only)

#### GET `/api/users/:id`
Get user by ID (authenticated users)

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Notes

⚠️ **Important**: This is a demo application with simplified security:

- Passwords are stored in **plaintext** (not recommended for production)
- For production use, implement:
  - Password hashing (bcrypt)
  - Rate limiting
  - Input validation/sanitization
  - HTTPS enforcement
  - Stronger JWT secrets

## Testing the API

### Using curl:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman:

1. Import the API endpoints
2. Set base URL: `http://localhost:5000`
3. For protected routes, add Authorization header: `Bearer your_jwt_token`

## Frontend Integration

Update your React frontend to connect to this backend:

1. Install axios in frontend: `npm install axios`
2. Update API base URL to: `http://localhost:5000`
3. Include JWT token in authorization headers
4. Handle authentication state management

## Development Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests (placeholder)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | mitra_db |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **CORS Issues**:
   - Check `FRONTEND_URL` in `.env`
   - Verify frontend is running on correct port

3. **JWT Errors**:
   - Check `JWT_SECRET` is set
   - Verify token format in requests

## Next Steps

- Add room booking endpoints
- Implement room availability checking
- Add schedule management
- Create admin dashboard APIs
- Add email notifications
- Implement file upload for room images

## License

This project is part of the Mitra PBL system.