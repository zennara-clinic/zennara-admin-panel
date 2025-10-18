import api from '../config/api';

const categoryService = {
  // Get all categories with statistics
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error.response?.data || error;
    }
  },

  // Get single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get category error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error.response?.data || error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw error.response?.data || error;
    }
  },

  // Toggle category active status
  toggleCategoryStatus: async (id) => {
    try {
      const response = await api.patch(`/categories/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle category status error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      throw error.response?.data || error;
    }
  },

  // Sync category consultation counts
  syncCategoryCounts: async () => {
    try {
      const response = await api.post('/categories/sync-counts');
      return response.data;
    } catch (error) {
      console.error('Sync category counts error:', error);
      throw error.response?.data || error;
    }
  }
};

export default categoryService;
