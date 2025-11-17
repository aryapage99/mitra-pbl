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
      return response.data?.data || [];
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
      return response.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data?.data;
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
    return !bookings.some((booking) => {
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      return startTime < bookingEnd && endTime > bookingStart;
    });
  },

  // Get available slots for a room (admin-created)
  async getAvailableSlots(roomId, date) {
    try {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (date) params.append('date', date);

      const response = await api.get(
        `/bookings/available-slots?${params.toString()}`
      );
      return response.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Generate time slots display with booking status
  async generateTimeSlots(
    roomId,
    roomType,
    date,
    existingBookings = []
  ) {
    try {
      // Get admin-created available slots for this room and date
      const availableSlots = await this.getAvailableSlots(roomId, date);

      // Map available slots to display format
      const slots = availableSlots.map((slot) => {
        const startTime = slot.start_time;
        const endTime = slot.end_time;

        // Check if this slot is already booked
        const isBooked = existingBookings.some((booking) => {
          return startTime < booking.end_time && endTime > booking.start_time;
        });

        const startDate = new Date(`2000-01-01T${startTime}`);
        const endDate = new Date(`2000-01-01T${endTime}`);

        const formatTime = (dateObj) => {
          const h = dateObj.getHours().toString().padStart(2, '0');
          const m = dateObj.getMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;
        };

        const durationHours = (endDate - startDate) / (1000 * 60 * 60);

        return {
          slotId: slot.id,
          startTime,
          endTime,
          displayTime: `${formatTime(startDate)} - ${formatTime(endDate)}`,
          isBooked,
          isAvailable: !!slot.is_available && !isBooked,
          duration: durationHours,
          bookingInfo: isBooked
            ? existingBookings.find(
                (b) => startTime < b.end_time && endTime > b.start_time
              )
            : null,
        };
      });

      // Sort slots by start time
      return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    } catch (error) {
      console.error('Error generating time slots:', error);
      // Fallback to empty array if admin hasn't created slots yet
      return [];
    }
  },
};

export default bookingService;
