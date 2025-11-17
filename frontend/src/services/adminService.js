import api from './api';

class AdminService {
  // Dashboard
  async getDashboard() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }

  // Slot Management
  async createSlot(slotData) {
    try {
      const response = await api.post('/admin/slots', slotData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create slot');
    }
  }

  async getAllSlots() {
    try {
      const response = await api.get('/admin/slots');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch slots');
    }
  }

  async deleteSlot(slotId) {
    try {
      const response = await api.delete(`/admin/slots/${slotId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete slot');
    }
  }

  async updateSlotAvailability(slotId, isAvailable) {
    try {
      const response = await api.patch(`/admin/slots/${slotId}/availability`, {
        isAvailable
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update slot availability');
    }
  }

  // Booking Management
  async deleteBooking(bookingId) {
    try {
      const response = await api.delete(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  }

  // User Management
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  // Available Slots for Booking
  async getAvailableSlots(roomId = null, date = null) {
    try {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (date) params.append('date', date);
      
      const response = await api.get(`/bookings/available-slots?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available slots');
    }
  }
}

const adminService = new AdminService();
export default adminService;