# Mitra PBL - Classroom Management System

A full-stack PERN (PostgreSQL, Express, React, Node.js) application for managing classroom floor plans and classroom information.

## Features

- User authentication (Login/Signup)
- Floor selection interface
- Classroom browsing by floor
- Responsive design

## Project Structure

```
mitra-pbl/
├── server/              # Backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── queries/         # Database queries
│   ├── routes/          # API routes
│   ├── schema.sql       # Database schema
│   ├── server.js        # Server entry point
│   └── package.json     # Server dependencies
│
├── client/              # Frontend React app
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   └── package.json     # Client dependencies
│
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/aryapage99/mitra-pbl.git
cd mitra-pbl
```

### 2. Set up PostgreSQL Database

Create a PostgreSQL database:

```bash
createdb mitra_pbl
```

Run the schema to create tables:

```bash
psql -d mitra_pbl -f server/schema.sql
```

### 3. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=mitra_pbl
JWT_SECRET=your_jwt_secret_key_here
```

Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:5000

### 4. Client Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory (optional):

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the client:

```bash
npm start
```

The client will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Floors
- `GET /api/floors` - Get all floors
- `GET /api/floors/:id` - Get floor by ID

### Classrooms
- `GET /api/classrooms` - Get all classrooms
- `GET /api/classrooms/floor/:floorId` - Get classrooms by floor
- `GET /api/classrooms/:id` - Get classroom by ID

## Database Schema

### Users Table
- id (Primary Key)
- username
- email (Unique)
- password (Hashed)
- created_at

### Floors Table
- id (Primary Key)
- floor_number (Unique)
- floor_name
- created_at

### Classrooms Table
- id (Primary Key)
- floor_id (Foreign Key)
- room_number
- capacity
- created_at

## Technology Stack

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - CORS middleware

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## License

MIT License - see LICENSE file for details