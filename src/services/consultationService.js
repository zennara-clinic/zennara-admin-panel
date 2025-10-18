import api from '../config/api';

const consultationService = {
  // Get all consultations with filters
  getAllConsultations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/consultations${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Get consultations error:', error);
      throw error.response?.data || error;
    }
  },

  // Get single consultation
  getConsultation: async (id) => {
    try {
      const response = await api.get(`/consultations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get consultation error:', error);
      throw error.response?.data || error;
    }
  },

  // Get consultations by category
  getConsultationsByCategory: async (category, limit = 10) => {
    try {
      const response = await api.get(`/consultations/category/${category}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get consultations by category error:', error);
      throw error.response?.data || error;
    }
  },

  // Get featured consultations
  getFeaturedConsultations: async (limit = 6) => {
    try {
      const response = await api.get(`/consultations/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get featured consultations error:', error);
      throw error.response?.data || error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/consultations/categories/list');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new category (Admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/consultations/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error.response?.data || error;
    }
  },

  // Search consultations
  searchConsultations: async (query, limit = 20) => {
    try {
      const response = await api.get(`/consultations/search/${query}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Search consultations error:', error);
      throw error.response?.data || error;
    }
  },

  // Get consultation statistics (Admin only)
  getConsultationStats: async () => {
    try {
      const response = await api.get('/consultations/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Get consultation stats error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new consultation (Admin only)
  createConsultation: async (consultationData) => {
    try {
      const response = await api.post('/consultations', consultationData);
      return response.data;
    } catch (error) {
      console.error('Create consultation error:', error);
      throw error.response?.data || error;
    }
  },

  // Update consultation (Admin only)
  updateConsultation: async (id, consultationData) => {
    try {
      const response = await api.put(`/consultations/${id}`, consultationData);
      return response.data;
    } catch (error) {
      console.error('Update consultation error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete consultation (Admin only)
  deleteConsultation: async (id) => {
    try {
      const response = await api.delete(`/consultations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete consultation error:', error);
      throw error.response?.data || error;
    }
  },

  // Toggle consultation active status (Admin only)
  toggleConsultationStatus: async (id) => {
    try {
      const response = await api.patch(`/consultations/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Toggle consultation status error:', error);
      throw error.response?.data || error;
    }
  }
};

export default consultationService;
