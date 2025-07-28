import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth-related API calls
export const authAPI = {
  sendOTP: (data: { email: string; name?: string; dob?: string }) =>
    api.post('/auth/send-otp', data),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),

  // Redirects browser to Google OAuth
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

// Notes API
export const notesAPI = {
  createNote: (data: { title: string; content: string }) =>
    api.post('/notes', data),

  getNotes: () => api.get('/notes'),

  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
