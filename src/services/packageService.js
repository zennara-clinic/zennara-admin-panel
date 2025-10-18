import api from '../config/api';

const packageService = {
  // Get all packages
  getAllPackages: async () => {
    try {
      const response = await api.get('/packages');
      return response.data;
    } catch (error) {
      console.error('Get packages error:', error);
      throw error.response?.data || error;
    }
  },

  // Get single package
  getPackage: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get package error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new package
  createPackage: async (packageData) => {
    try {
      const response = await api.post('/packages', packageData);
      return response.data;
    } catch (error) {
      console.error('Create package error:', error);
      throw error.response?.data || error;
    }
  },

  // Update package
  updatePackage: async (id, packageData) => {
    try {
      const response = await api.put(`/packages/${id}`, packageData);
      return response.data;
    } catch (error) {
      console.error('Update package error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete package
  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete package error:', error);
      throw error.response?.data || error;
    }
  },

  // Toggle package status
  togglePackageStatus: async (id) => {
    try {
      const response = await api.patch(`/packages/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle package status error:', error);
      throw error.response?.data || error;
    }
  },

  // Get package stats
  getPackageStats: async () => {
    try {
      const response = await api.get('/packages/stats');
      return response.data;
    } catch (error) {
      console.error('Get package stats error:', error);
      throw error.response?.data || error;
    }
  }
};

export default packageService;
