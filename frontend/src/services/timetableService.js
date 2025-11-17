import api from './api';

const timetableService = {
  // Get all timetables with optional filters
  async getAllTimetables(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.roomId) params.append('roomId', filters.roomId);
      if (filters.roomType) params.append('roomType', filters.roomType);
      if (filters.dayOfWeek) params.append('dayOfWeek', filters.dayOfWeek);
      if (filters.program) params.append('program', filters.program);

      const queryString = params.toString();
      const url = queryString ? `/timetables?${queryString}` : '/timetables';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get timetable for a specific room
  async getRoomTimetable(roomId, day = null) {
    try {
      const url = day 
        ? `/timetables/room/${roomId}?day=${day}` 
        : `/timetables/room/${roomId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get timetable for a specific program
  async getProgramTimetable(program) {
    try {
      const response = await api.get(`/timetables/program/${encodeURIComponent(program)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get timetable for a specific day
  async getDayTimetable(day) {
    try {
      const response = await api.get(`/timetables/day/${day}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get list of all programs
  async getPrograms() {
    try {
      const response = await api.get('/timetables/programs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get list of all rooms
  async getRooms() {
    try {
      const response = await api.get('/timetables/rooms');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get statistics
  async getStats() {
    try {
      const response = await api.get('/timetables/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Helper function to format time
  formatTime(timeString) {
    if (!timeString) return '';
    // Convert "08:30:00" to "08:30 AM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  },

  // Helper function to format time range
  formatTimeRange(startTime, endTime) {
    return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
  },

  // Group timetables by day
  groupByDay(timetables) {
    const grouped = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };

    timetables.forEach(entry => {
      if (grouped[entry.day_of_week]) {
        grouped[entry.day_of_week].push(entry);
      }
    });

    return grouped;
  },

  // Group timetables by room
  groupByRoom(timetables) {
    const grouped = {};

    timetables.forEach(entry => {
      if (!grouped[entry.room_id]) {
        grouped[entry.room_id] = [];
      }
      grouped[entry.room_id].push(entry);
    });

    return grouped;
  },

  // Get all unique time slots from timetables
  getTimeSlots(timetables) {
    const slots = new Set();
    timetables.forEach(entry => {
      const key = `${entry.start_time}-${entry.end_time}`;
      slots.add(key);
    });
    
    // Sort time slots by start time
    return Array.from(slots).sort((a, b) => {
      const [aStart] = a.split('-');
      const [bStart] = b.split('-');
      return aStart.localeCompare(bStart);
    });
  },

  // Transform timetables into grid format (time slots × days)
  createGridData(timetables) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = this.getTimeSlots(timetables);
    
    const grid = {};
    
    // Initialize grid structure
    timeSlots.forEach(slot => {
      grid[slot] = {};
      days.forEach(day => {
        grid[slot][day] = null;
      });
    });
    
    // Fill grid with timetable data
    timetables.forEach(entry => {
      const slotKey = `${entry.start_time}-${entry.end_time}`;
      if (grid[slotKey] && grid[slotKey][entry.day_of_week] !== undefined) {
        // If slot already has a class, append to array (for overlaps)
        if (grid[slotKey][entry.day_of_week] === null) {
          grid[slotKey][entry.day_of_week] = [entry];
        } else {
          grid[slotKey][entry.day_of_week].push(entry);
        }
      }
    });
    
    return { grid, timeSlots, days };
  },

  // Get color for program type
  getProgramColor(program) {
    if (!program) return '#95a5a6';
    
    const programUpper = program.toUpperCase();
    
    // BCA programs - Blue shades
    if (programUpper.includes('BCA')) return '#3498db';
    
    // MCA programs - Purple shades
    if (programUpper.includes('MCA')) return '#9b59b6';
    
    // BSC programs - Green shades
    if (programUpper.includes('BSC') || programUpper.includes('BTECH')) return '#27ae60';
    
    // MSC programs - Teal shades
    if (programUpper.includes('MSC') || programUpper.includes('MTECH')) return '#16a085';
    
    // Cloud/Cyber specific - Orange
    if (programUpper.includes('CLOUD') || programUpper.includes('CYBER')) return '#e67e22';
    
    // Elective/Honours - Amber
    if (programUpper.includes('ELECTIVE') || programUpper.includes('HONOURS')) return '#f39c12';
    
    // Default - Gray
    return '#7f8c8d';
  }
};

export default timetableService;
