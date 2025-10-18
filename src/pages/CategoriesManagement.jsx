import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import { SkeletonStatCard, SkeletonCategoryCard, SkeletonList } from '../components/SkeletonLoader';
import './CategoriesManagement.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const response = await categoryService.updateCategory(
          editingCategory._id,
          formData
        );
        if (response.success) {
          showSuccess('Category updated successfully');
          fetchCategories();
          setShowModal(false);
        }
      } else {
        // Create new category
        const response = await categoryService.createCategory(formData);
        if (response.success) {
          showSuccess('Category created successfully');
          fetchCategories();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showError(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const response = await categoryService.toggleCategoryStatus(category._id);
      if (response.success) {
        showSuccess(response.message);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showError('Failed to update category status');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await categoryService.deleteCategory(category._id);
      if (response.success) {
        showSuccess('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(error.message || 'Failed to delete category');
    }
  };

  const handleExportCategories = () => {
    try {
      // Create CSV content
      const headers = ['Name', 'Description', 'Services Count', 'Status', 'Created Date'];
      const csvData = categories.map(cat => [
        cat.name,
        cat.description || '',
        cat.consultationCount,
        cat.isActive ? 'Active' : 'Inactive',
        new Date(cat.createdAt).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `categories-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Categories exported successfully');
    } catch (error) {
      console.error('Error exporting categories:', error);
      showError('Failed to export categories');
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="categories-management">
      {/* Header */}
      <div className="categories-header">
        <div className="header-content">
          <Link to="/consultations/services" className="back-link">
            ← Back to Services
          </Link>
          <h1 className="page-title">Categories Management</h1>
          <p className="page-subtitle">Organize and manage service categories</p>
        </div>
        <div className="header-actions">
          <button className="btn-sync" onClick={handleExportCategories} title="Export categories to CSV">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Categories
          </button>
          <button className="btn-add" onClick={handleAddCategory}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification error-notification">
          <svg className="notification-icon" fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      {successMessage && (
        <div className="notification success-notification">
          <svg className="notification-icon" fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Categories</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card active">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{stats.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Services</div>
          <div className="stat-value blue">{stats.totalServices}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inactive</div>
          <div className="stat-value red">{stats.inactive}</div>
        </div>
      </div>

      {/* Categories List */}
      <div className="categories-section">
        <h2 className="section-title">All Categories</h2>
        
        {loading ? (
          <div style={{ marginTop: '24px' }}>
            <SkeletonList count={5} component={SkeletonCategoryCard} />
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="64" height="64">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3>No Categories Yet</h3>
            <p>Create your first category to organize your services</p>
            <button className="btn-primary" onClick={handleAddCategory}>
              Add First Category
            </button>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map((category, index) => (
              <div key={category._id} className="category-card">
                <div className="category-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-meta">
                    {category.consultationCount} service{category.consultationCount !== 1 ? 's' : ''} • Order: {index + 1}
                  </p>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                </div>
                <div className="category-actions">
                  <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                    {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <button 
                    className={`btn-action ${category.isActive ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleStatus(category)}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Skin, Hair, Facials"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows="3"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
