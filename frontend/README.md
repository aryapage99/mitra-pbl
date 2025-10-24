# Mitra Frontend

Interactive Room Allocator - React Frontend Application

## Overview

Mitra is an interactive room allocation system that allows users to view and book classrooms and labs in a college building. The application provides a visual floor map interface with authentication and booking capabilities.

## Features

- **User Authentication**: Login and signup functionality for students and teachers
- **Interactive Floor Maps**: Visual representation of college floors 4 and 5
- **Room Booking**: Teachers can book available time slots for classrooms and labs
- **Schedule Viewing**: View detailed schedules for individual rooms
- **Responsive Design**: Clean, modern UI with hover effects and animations

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForms.js          # Login and signup forms
│   │   ├── map/
│   │   │   ├── FloorMap.js           # Main floor map component
│   │   │   └── RoomComponents.js     # Room and corridor components
│   │   └── ui/
│   │       ├── AuthComponents.js     # Reusable auth UI components
│   │       ├── Modals.js            # Room details and booking modals
│   │       └── Navigation.js        # Sidebar and profile menu
│   ├── data/
│   │   ├── roomData.js              # Floor and room configuration
│   │   └── scheduleData.js          # Sample schedule data
│   ├── styles/
│   │   └── colors.js                # Color constants and theme
│   ├── App.js                       # Main application component
│   └── index.js                     # Application entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Usage

### Authentication

1. **Login**: Use any email and password (authentication is currently mock)
2. **Signup**: Choose between Student or Teacher role
3. **Role Differences**:
   - Students: Can view room details and schedules
   - Teachers: Can book available time slots

### Navigation

- Use the hamburger menu (☰) to access the sidebar
- Click the profile icon (👤) to access logout functionality
- Switch between Floor 4 and Floor 5 using the floor buttons

### Booking Rooms

1. Teachers can click "Book Slot" on any classroom or lab
2. View the schedule and click "Book" on available time slots
3. Students see "Teacher Access" instead of booking functionality

## Components Overview

### Authentication Components
- `LoginForm`: Handles user login
- `SignUpForm`: Handles user registration with role selection
- `AuthFormContainer`: Consistent styling wrapper for auth forms

### Map Components
- `FloorMap`: Main component that renders the entire floor layout
- `RoomCard`: Individual room representation with booking functionality
- `Corridor`: Corridor areas between room blocks

### UI Components
- `Sidebar`: Navigation menu with app options
- `ProfileMenu`: User profile dropdown menu
- `ModalTab`: Room details modal
- `BookingModal`: Room booking interface with schedule

### Data Structure

The application uses a hierarchical data structure for floors:
- Each floor contains multiple blocks (left, center, labs, canteen, right)
- Each block contains rooms with unique IDs, labels, and types
- Room types: "classroom", "lab", "corridor"

## Styling

The application uses inline styles with a centralized color system defined in `styles/colors.js`. Key design elements:

- **Colors**: University branding with red (#9B2023) and blue (#22335B)
- **Typography**: Poppins and Inter font families
- **Layout**: CSS Grid for floor layouts, Flexbox for components
- **Interactions**: Hover effects, smooth transitions, and visual feedback

## Future Enhancements

- Backend integration for real authentication and booking
- Database connectivity for persistent room schedules
- Real-time updates for room availability
- Email notifications for bookings
- Calendar integration
- Mobile app version
- Administrative dashboard for managing rooms and schedules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Mitra PBL system.