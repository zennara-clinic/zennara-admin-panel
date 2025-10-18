import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.USERS;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
  // Get all users/patients with filters and pagination
  getAllUsers: async (params = {}) => {
    try {
      const { 
        memberType, 
        location, 
        search, 
        page = 1, 
        limit = 10 
      } = params;

      const queryParams = new URLSearchParams();
      if (memberType) queryParams.append('memberType', memberType);
      if (location) queryParams.append('location', location);
      if (search) queryParams.append('search', search);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      const response = await axios.get(`${API_URL}?${queryParams.toString()}`, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error.response?.data || error;
    }
  },

  // Get single user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error.response?.data || error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${userId}`, userData, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error.response?.data || error;
    }
  },

  // Update user statistics
  updateStatistics: async (userId, statistics) => {
    try {
      const response = await axios.patch(`${API_URL}/${userId}/statistics`, statistics, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Update statistics error:', error);
      throw error.response?.data || error;
    }
  },

  // Export users data
  exportUsers: async (params = {}) => {
    try {
      const { memberType, location } = params;

      const queryParams = new URLSearchParams();
      if (memberType) queryParams.append('memberType', memberType);
      if (location) queryParams.append('location', location);

      const response = await axios.get(`${API_URL}/export?${queryParams.toString()}`, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Export users error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    try {
      const response = await axios.post(API_URL, userData, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error.response?.data || error;
    }
  },

  // Assign/Extend Zen Membership (Admin only)
  assignMembership: async (userId, membershipData) => {
    try {
      const response = await axios.post(`${API_URL}/${userId}/membership`, membershipData, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Assign membership error:', error);
      throw error.response?.data || error;
    }
  },

  // Cancel Zen Membership (Admin only)
  cancelMembership: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}/membership`, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Cancel membership error:', error);
      throw error.response?.data || error;
    }
  },

  // Deactivate/Activate User (Admin only)
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await axios.patch(`${API_URL}/${userId}/status`, 
        { isActive }, 
        {
          headers: getAuthHeader()
        }
      );

      return response.data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error.response?.data || error;
    }
  }
};

export default userService;
