import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Movies Endpoints
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getFeatured: () => api.get('/movies/featured'),
  getFilters: () => api.get('/movies/filters'),
  getById: (id) => api.get(`/movies/${id}`),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Shows Endpoints
export const showsAPI = {
  getAll: (params) => api.get('/shows', { params }),
  getByMovie: (movieId, date) => api.get(`/shows/movie/${movieId}`, { params: { date } }),
  getById: (id) => api.get(`/shows/${id}`),
  create: (showData) => api.post('/shows', showData),
  update: (id, showData) => api.put(`/shows/${id}`, showData),
};

// Bookings Endpoints
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings'),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
