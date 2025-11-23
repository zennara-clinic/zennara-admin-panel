/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */
import axios from 'axios';

// Get base URL from environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Log the current API URL (helps with debugging)
console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoint paths
export const API_ENDPOINTS = {
  // Admin Auth
  ADMIN_AUTH: `${API_BASE_URL}/api/admin/auth`,
  CHECK_EMAIL: `${API_BASE_URL}/api/admin/auth/check-email`,
  LOGIN: `${API_BASE_URL}/api/admin/auth/login`,
  VERIFY_OTP: `${API_BASE_URL}/api/admin/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/api/admin/auth/resend-otp`,
  ME: `${API_BASE_URL}/api/admin/auth/me`,
  LOGOUT: `${API_BASE_URL}/api/admin/auth/logout`,
  
  // Users
  USERS: `${API_BASE_URL}/api/admin/users`,
  
  // Branches/Locations
  BRANCHES: `${API_BASE_URL}/api/branches`,
  LOCATIONS: `${API_BASE_URL}/api/locations`,
  
  // Bookings
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  BOOKINGS_ADMIN: `${API_BASE_URL}/api/bookings/admin`,
  
  // Consultations
  CONSULTATIONS: `${API_BASE_URL}/api/consultations`,
  
  // Packages
  PACKAGES: `${API_BASE_URL}/api/packages`,
  PACKAGE_ASSIGNMENTS: `${API_BASE_URL}/api/package-assignments`,
  
  // Upload
  UPLOAD_MEDIA: `${API_BASE_URL}/api/upload/media`,
  UPLOAD_MEDIA_URL: `${API_BASE_URL}/api/upload/media-url`,
};

// Export axios instance as default
export default api;
