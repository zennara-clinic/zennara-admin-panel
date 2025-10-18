import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.BRANCHES;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const branchService = {
  // Get all branches
  async getAllBranches() {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error.response?.data || { message: 'Failed to fetch branches' };
    }
  },

  // Get branch by ID
  async getBranchById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error.response?.data || { message: 'Failed to fetch branch' };
    }
  },
};

export default branchService;
