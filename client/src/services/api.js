import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const floorService = {
  getAllFloors: () => api.get('/floors'),
  getFloorById: (id) => api.get(`/floors/${id}`),
};

export const classroomService = {
  getAllClassrooms: () => api.get('/classrooms'),
  getClassroomsByFloor: (floorId) => api.get(`/classrooms/floor/${floorId}`),
  getClassroomById: (id) => api.get(`/classrooms/${id}`),
};

export default api;
