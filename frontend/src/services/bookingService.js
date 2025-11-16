import api from './api';

const bookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings/create', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bookings for the logged-in teacher
  async getMyBookings() {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bookings for a specific room (with optional date)
  async getRoomBookings(roomId, date = null) {
    try {
      const url = date 
        ? `/bookings/room/${roomId}?date=${date}` 
        : `/bookings/room/${roomId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a booking
  async deleteBooking(bookingId) {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Helper function to format date for API
  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  },

  // Helper function to check if a time slot is available
  isTimeSlotAvailable(bookings, startTime, endTime) {
    return !bookings.some(booking => {
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      return (startTime < bookingEnd && endTime > bookingStart);
    });
  },

  // Generate available time slots for a room
  generateTimeSlots(roomType, existingBookings = []) {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 16; // 4 PM
    const slotDuration = roomType === 'classroom' ? 1 : 1; // Generate 1-hour slots

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
      
      // Check if this slot overlaps with any existing booking
      const isBooked = existingBookings.some(booking => {
        return (startTime < booking.end_time && endTime > booking.start_time);
      });

      slots.push({
        startTime,
        endTime,
        displayTime: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
        isBooked,
        bookingInfo: isBooked 
          ? existingBookings.find(b => startTime < b.end_time && endTime > b.start_time)
          : null
      });
    }

    return slots;
  }
};

export default bookingService;
