import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Edit2, Trash2, Eye, EyeOff, GripVertical, Plus, Link as LinkIcon, ExternalLink, Smartphone, Image as ImageIcon, Video } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    mediaType: 'image',
    image: null,
    videoUrl: '',
    linkType: 'none',
    internalScreen: '',
    externalUrl: '',
    order: 0
  });
  const [mediaPreview, setMediaPreview] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(response.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = formData.mediaType === 'video';
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      const fileType = isVideo ? 'Video' : 'Image';
      
      if (file.size > maxSize) {
        alert(`${fileType} size should be less than ${isVideo ? '50' : '5'}MB`);
        return;
      }
      
      if (isVideo && !file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      
      if (!isVideo && !file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setFormData({ ...formData, image: file });
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a banner title');
      return;
    }

    if (formData.mediaType === 'video') {
      if (!editingBanner && !formData.image && !formData.videoUrl.trim()) {
        alert('Please upload a video file or enter a video URL');
        return;
      }
    } else {
      if (!editingBanner && !formData.image) {
        alert('Please select an image');
        return;
      }
    }

    if (formData.linkType === 'internal' && !formData.internalScreen) {
      alert('Please select an internal screen');
      return;
    }

    if (formData.linkType === 'external' && !formData.externalUrl.trim()) {
      alert('Please enter an external URL');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('mediaType', formData.mediaType);
      data.append('linkType', formData.linkType);
      data.append('order', formData.order);
      
      if (formData.mediaType === 'video' && formData.videoUrl) {
        data.append('videoUrl', formData.videoUrl);
      }
      
      if (formData.linkType === 'internal') {
        data.append('internalScreen', formData.internalScreen);
      } else if (formData.linkType === 'external') {
        data.append('externalUrl', formData.externalUrl);
      }
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingBanner) {
        await axios.put(`${API_URL}/banners/${editingBanner._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Banner updated successfully');
      } else {
        await axios.post(`${API_URL}/banners`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Banner created successfully');
      }

      fetchBanners();
      closeModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      mediaType: banner.mediaType || 'image',
      image: null,
      videoUrl: banner.videoUrl || '',
      linkType: banner.linkType,
      internalScreen: banner.internalScreen,
      externalUrl: banner.externalUrl,
      order: banner.order
    });
    setMediaPreview(banner.mediaType === 'video' ? (banner.videoFile || banner.videoUrl) : banner.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_URL}/banners/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Failed to toggle banner status');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...banners];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setBanners(items);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    try {
      const token = localStorage.getItem('adminToken');
      const reorderedBanners = banners.map((banner, index) => ({
        id: banner._id,
        order: index
      }));

      await axios.post(`${API_URL}/banners/reorder`, 
        { banners: reorderedBanners },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
      alert('Failed to reorder banners');
      fetchBanners();
    }

    setDraggedItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      mediaType: 'image',
      image: null,
      videoUrl: '',
      linkType: 'none',
      internalScreen: '',
      externalUrl: '',
      order: 0
    });
    setMediaPreview(null);
  };

  const internalScreens = [
    { value: 'consultations', label: 'Consultations' },
    { value: 'treatments', label: 'Treatments' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'orders', label: 'Orders' },
    { value: 'profile', label: 'Profile' },
    { value: 'offers', label: 'Offers' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banner Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage home page banners (max 5 active)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={banners.length >= 5}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No banners yet</h3>
          <p className="text-gray-500 mb-4">Create your first banner to display on the home page</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Banner
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg shadow-sm border ${
                banner.isActive ? 'border-green-200' : 'border-gray-200'
              } hover:shadow-md transition-shadow cursor-move`}
            >
              <div className="p-4 flex gap-4">
                <div className="flex items-center">
                  <GripVertical size={20} className="text-gray-400" />
                </div>

                <div className="relative w-48 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {banner.mediaType === 'video' ? (
                    <>
                      <video
                        src={banner.videoFile || banner.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Video size={32} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{banner.title}</h3>
                      
                      {banner.linkType !== 'none' && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          {banner.linkType === 'internal' ? (
                            <>
                              <Smartphone size={14} />
                              <span>Links to: {banner.internalScreen}</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink size={14} />
                              <span className="truncate">{banner.externalUrl}</span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.mediaType === 'video'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {banner.mediaType === 'video' ? 'Video' : 'Image'}
                        </span>
                        <span className="text-xs text-gray-500">Order: {banner.order}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(banner._id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={banner.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {banner.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter banner title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image * (16:9 ratio recommended)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block">
                          Choose Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Type
                </label>
                <select
                  value={formData.linkType}
                  onChange={(e) => setFormData({ ...formData, linkType: e.target.value, internalScreen: '', externalUrl: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="none">No Link</option>
                  <option value="internal">Internal Screen</option>
                  <option value="external">External URL</option>
                </select>
              </div>

              {formData.linkType === 'internal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Screen *
                  </label>
                  <select
                    value={formData.internalScreen}
                    onChange={(e) => setFormData({ ...formData, internalScreen: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a screen</option>
                    {internalScreens.map(screen => (
                      <option key={screen.value} value={screen.value}>
                        {screen.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.linkType === 'external' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL *
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
