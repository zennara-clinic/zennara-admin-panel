import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  RotateCcw, 
  Image as ImageIcon,
  Smartphone,
  ShoppingBag,
  Calendar,
  User,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.zennara.in';

const AppCustomization = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/app-customization/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (screen, field, value) => {
    setSettings(prev => {
      // If screen is 'root', update root-level fields like appLogo
      if (screen === 'root') {
        return {
          ...prev,
          [field]: value
        };
      }
      // Otherwise update nested screen properties
      return {
        ...prev,
        [screen]: {
          ...prev[screen],
          [field]: value
        }
      };
    });
  };

  const handleImageUpload = async (imageType, file) => {
    if (!file) {
      showNotification('Please select a file', 'error');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Image size should be less than 10MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(imageType);
      const token = localStorage.getItem('adminToken');
      
      console.log('Uploading image:', {
        imageType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/app-customization/admin/upload/${imageType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload response:', response.data);
      setSettings(response.data.data);
      showNotification('Image uploaded successfully');
      
      // Refresh to get latest data
      await fetchSettings();
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      showNotification(errorMessage, 'error');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      
      const updates = {
        appLogo: settings.appLogo,
        homeScreen: settings.homeScreen,
        consultationsScreen: settings.consultationsScreen,
        appointmentsScreen: settings.appointmentsScreen,
        productsScreen: settings.productsScreen,
        profileScreen: settings.profileScreen
      };

      await axios.put(`${API_BASE_URL}/api/app-customization/admin`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/app-customization/admin/reset`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSettings(response.data.data);
      showNotification('Settings reset to default');
    } catch (error) {
      console.error('Error resetting settings:', error);
      showNotification('Failed to reset settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'home', label: 'Home Screen', icon: Home },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Smartphone className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">App Customization</h1>
              <p className="text-gray-600">Customize mobile app content and images</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={18} />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'home' && (
          <HomeScreenSettings
            settings={settings?.homeScreen}
            appLogo={settings?.appLogo}
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            uploading={uploading}
            onUpdate={fetchSettings}
          />
        )}

        {activeTab === 'consultations' && (
          <ScreenSettings
            screen="consultationsScreen"
            title="Consultations Screen"
            settings={settings?.consultationsScreen}
            onChange={handleInputChange}
            hasSearchbar={true}
          />
        )}

        {activeTab === 'appointments' && (
          <ScreenSettings
            screen="appointmentsScreen"
            title="Appointments Screen"
            settings={settings?.appointmentsScreen}
            onChange={handleInputChange}
            hasSearchbar={false}
          />
        )}

        {activeTab === 'products' && (
          <ScreenSettings
            screen="productsScreen"
            title="Products Screen"
            settings={settings?.productsScreen}
            onChange={handleInputChange}
            hasSearchbar={true}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreenSettings
            settings={settings?.profileScreen}
            onChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

// Consultation Category Cards Component
const ConsultationCategoryCards = ({ settings, onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    searchTerm: '',
    displayOrder: 1
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [consultationCategories, setConsultationCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.zennara.in';

  // Fetch consultation categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(`${API_BASE_URL}/api/consultations`);
        
        if (response.data.success && response.data.data) {
          // Extract unique categories
          const categories = [...new Set(response.data.data.map(c => c.category))];
          setConsultationCategories(categories.sort());
        }
      } catch (error) {
        console.error('Error fetching consultation categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (showAddModal) {
      fetchCategories();
    }
  }, [showAddModal]);

  const handleOpenAddModal = () => {
    setEditingCard(null);
    setFormData({ categoryName: '', searchTerm: '', displayOrder: 1 });
    setSelectedImage(null);
    setShowAddModal(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({
      categoryName: card.categoryName,
      searchTerm: card.searchTerm,
      displayOrder: card.displayOrder || 1
    });
    setSelectedImage(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCard(null);
    setFormData({ categoryName: '', searchTerm: '', displayOrder: 1 });
    setSelectedImage(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!editingCard && !selectedImage) {
        alert('Please select an image');
        return;
      }

      if (!formData.categoryName || !formData.searchTerm) {
        alert('Please fill in all required fields');
        return;
      }

      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }
      formDataToSend.append('categoryName', formData.categoryName);
      formDataToSend.append('searchTerm', formData.searchTerm);
      formDataToSend.append('displayOrder', formData.displayOrder);

      let response;
      if (editingCard) {
        // Update existing card
        response = await axios.put(
          `${API_BASE_URL}/api/app-customization/admin/consultation-card/${editingCard._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Add new card
        response = await axios.post(
          `${API_BASE_URL}/api/app-customization/admin/consultation-card`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      alert(response.data.message);
      handleCloseModal();
      onUpdate(); // Refresh settings
    } catch (error) {
      console.error('Error saving consultation card:', error);
      alert(error.response?.data?.message || 'Failed to save consultation card');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to delete this consultation category card?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_BASE_URL}/api/app-customization/admin/consultation-card/${cardId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Consultation category card deleted successfully');
      onUpdate(); // Refresh settings
    } catch (error) {
      console.error('Error deleting consultation card:', error);
      alert(error.response?.data?.message || 'Failed to delete consultation card');
    }
  };

  const cards = settings?.consultationCategoryCards || [];
  const sortedCards = [...cards].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Consultation Category Cards
        </label>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Upload size={18} />
          Add Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {sortedCards.map((card) => (
          <div key={card._id} className="relative group">
            <img
              src={card.image}
              alt={card.categoryName}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                onClick={() => handleEditCard(card)}
                className="px-3 py-1 bg-white text-gray-800 rounded hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCard(card._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800">{card.categoryName}</p>
            <p className="text-xs text-gray-500">Search: {card.searchTerm}</p>
          </div>
        ))}
      </div>

      {sortedCards.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No consultation category cards added yet. Click "Add Card" to get started.
        </p>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCard ? 'Edit' : 'Add'} Consultation Category Card
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    value={formData.categoryName}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setFormData({ 
                        ...formData, 
                        categoryName: selectedCategory,
                        searchTerm: selectedCategory // Auto-fill search term with category name
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a consultation category</option>
                    {consultationCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Select from existing consultation categories
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Term *
                </label>
                <input
                  type="text"
                  value={formData.searchTerm}
                  onChange={(e) => setFormData({ ...formData, searchTerm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Skin, Hair"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from category selection. Modify if needed for filtering.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Image {!editingCard && '*'}
                </label>
                {editingCard && editingCard.image && !selectedImage && (
                  <img
                    src={editingCard.image}
                    alt="Current"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {selectedImage && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {selectedImage.name}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : editingCard ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Home Screen Component
const HomeScreenSettings = ({ settings, appLogo, onChange, onImageUpload, uploading, onUpdate }) => {
  const handleFileSelect = (imageType, event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(imageType, file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Home Screen Settings</h2>

      {/* App Logo */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-emerald-50 to-blue-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          App Logo
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload your clinic logo. This will appear on the app header across all screens.
        </p>
        {appLogo ? (
          <div className="mb-3 p-4 rounded-lg inline-block border border-gray-200" style={{ backgroundColor: '#ebf2e9' }}>
            <img
              key={`logo-${settings?.version || Date.now()}`}
              src={`${appLogo}${appLogo.includes('?') ? '&' : '?'}v=${settings?.version || Date.now()}`}
              alt="App Logo"
              className="h-20 max-w-xs object-contain"
              style={{ backgroundColor: 'transparent' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/dgcpuirdo/image/upload/v1749817496/zennara_logo_wtk8lz.png';
              }}
            />
          </div>
        ) : (
          <div className="mb-3 bg-gray-100 p-4 rounded-lg inline-block border border-gray-200">
            <div className="h-20 w-40 flex items-center justify-center text-gray-400">
              <ImageIcon size={32} />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">
            {uploading === 'appLogo' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Upload size={18} />
            )}
            {uploading === 'appLogo' ? 'Uploading...' : 'Upload Logo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect('appLogo', e)}
              disabled={uploading === 'appLogo'}
            />
          </label>
          {appLogo && (
            <a 
              href={appLogo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 hover:text-emerald-700 underline"
            >
              View Full Size
            </a>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Banner Image
        </label>
        {settings?.heroBannerImage && (
          <img
            key={`hero-${settings?.version || Date.now()}`}
            src={`${settings.heroBannerImage}${settings.heroBannerImage.includes('?') ? '&' : '?'}v=${settings?.version || Date.now()}`}
            alt="Hero Banner"
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
        )}
        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors w-fit mb-4">
          {uploading === 'heroBanner' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
          ) : (
            <Upload size={18} />
          )}
          {uploading === 'heroBanner' ? 'Uploading...' : 'Upload New Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect('heroBanner', e)}
            disabled={uploading === 'heroBanner'}
          />
        </label>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Navigation Route
          </label>
          <select
            value={settings?.heroBannerRoute || 'consultations'}
            onChange={(e) => onChange('homeScreen', 'heroBannerRoute', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="consultations">Consultations Page</option>
            <option value="products">Products Page</option>
            <option value="appointments">Appointments Page</option>
            <option value="profile">Profile Page</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select which screen to navigate to when the hero banner is tapped
          </p>
        </div>
      </div>

      {/* Button Texts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultations Button Text
          </label>
          <input
            type="text"
            value={settings?.consultationsButtonText || ''}
            onChange={(e) => onChange('homeScreen', 'consultationsButtonText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Products Button Text
          </label>
          <input
            type="text"
            value={settings?.productsButtonText || ''}
            onChange={(e) => onChange('homeScreen', 'productsButtonText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Consultation Category Cards */}
      <ConsultationCategoryCards 
        settings={settings}
        onUpdate={onUpdate}
      />

      {/* Section Headings & Button Texts */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Section Headings & Button Texts</h3>
        
        {/* Consultations Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Consultations Section</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Section Heading
              </label>
              <input
                type="text"
                value={settings?.consultationsSectionHeading || ''}
                onChange={(e) => onChange('homeScreen', 'consultationsSectionHeading', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Consultations"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={settings?.consultationsSectionButtonText || ''}
                onChange={(e) => onChange('homeScreen', 'consultationsSectionButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="See All"
              />
            </div>
          </div>
        </div>

        {/* Popular Consultations Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Popular Consultations Section</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Section Heading
              </label>
              <input
                type="text"
                value={settings?.popularConsultationsSectionHeading || ''}
                onChange={(e) => onChange('homeScreen', 'popularConsultationsSectionHeading', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Popular Consultations"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={settings?.popularConsultationsSectionButtonText || ''}
                onChange={(e) => onChange('homeScreen', 'popularConsultationsSectionButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="See All"
              />
            </div>
          </div>
        </div>

        {/* Popular Products Section */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Popular Products Section</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Section Heading
              </label>
              <input
                type="text"
                value={settings?.popularProductsSectionHeading || ''}
                onChange={(e) => onChange('homeScreen', 'popularProductsSectionHeading', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Popular Products"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={settings?.popularProductsSectionButtonText || ''}
                onChange={(e) => onChange('homeScreen', 'popularProductsSectionButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="See All"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Zen Membership Card */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zen Membership Card
        </label>
        {settings?.zenMembershipCardImage && (
          <img
            src={settings.zenMembershipCardImage}
            alt="Zen Membership"
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
        )}
        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors w-fit mb-4">
          {uploading === 'zenMembershipCard' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
          ) : (
            <Upload size={18} />
          )}
          {uploading === 'zenMembershipCard' ? 'Uploading...' : 'Upload Card Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect('zenMembershipCard', e)}
            disabled={uploading === 'zenMembershipCard'}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Title
            </label>
            <input
              type="text"
              value={settings?.zenMembershipCardTitle || ''}
              onChange={(e) => onChange('homeScreen', 'zenMembershipCardTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Description
            </label>
            <input
              type="text"
              value={settings?.zenMembershipCardDescription || ''}
              onChange={(e) => onChange('homeScreen', 'zenMembershipCardDescription', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic Screen Settings Component
const ScreenSettings = ({ screen, title, settings, onChange, hasSearchbar }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Screen Heading
        </label>
        <input
          type="text"
          value={settings?.heading || ''}
          onChange={(e) => onChange(screen, 'heading', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Heading Description
        </label>
        <textarea
          value={settings?.subHeading || ''}
          onChange={(e) => onChange(screen, 'subHeading', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {hasSearchbar && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Searchbar Placeholder Text
          </label>
          <input
            type="text"
            value={settings?.searchbarPlaceholder || ''}
            onChange={(e) => onChange(screen, 'searchbarPlaceholder', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
};

// Profile Screen Settings Component
const ProfileScreenSettings = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Screen Settings</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Screen Heading
          </label>
          <input
            type="text"
            value={settings?.heading || ''}
            onChange={(e) => onChange('profileScreen', 'heading', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Searchbar Placeholder
          </label>
          <input
            type="text"
            value={settings?.searchbarPlaceholder || ''}
            onChange={(e) => onChange('profileScreen', 'searchbarPlaceholder', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Heading Description
        </label>
        <textarea
          value={settings?.subHeading || ''}
          onChange={(e) => onChange('profileScreen', 'subHeading', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Card Texts</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Card Text
            </label>
            <input
              type="text"
              value={settings?.personalCardText || ''}
              onChange={(e) => onChange('profileScreen', 'personalCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Addresses Card Text
            </label>
            <input
              type="text"
              value={settings?.addressesCardText || ''}
              onChange={(e) => onChange('profileScreen', 'addressesCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Details Card Text
            </label>
            <input
              type="text"
              value={settings?.bankDetailsCardText || ''}
              onChange={(e) => onChange('profileScreen', 'bankDetailsCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Card Text
            </label>
            <input
              type="text"
              value={settings?.membershipCardText || ''}
              onChange={(e) => onChange('profileScreen', 'membershipCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orders Card Text
            </label>
            <input
              type="text"
              value={settings?.ordersCardText || ''}
              onChange={(e) => onChange('profileScreen', 'ordersCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatments Card Text
            </label>
            <input
              type="text"
              value={settings?.treatmentsCardText || ''}
              onChange={(e) => onChange('profileScreen', 'treatmentsCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointments Card Text
            </label>
            <input
              type="text"
              value={settings?.appointmentsCardText || ''}
              onChange={(e) => onChange('profileScreen', 'appointmentsCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forms Card Text
            </label>
            <input
              type="text"
              value={settings?.formsCardText || ''}
              onChange={(e) => onChange('profileScreen', 'formsCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Help Card Text
            </label>
            <input
              type="text"
              value={settings?.helpCardText || ''}
              onChange={(e) => onChange('profileScreen', 'helpCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delete Card Text
            </label>
            <input
              type="text"
              value={settings?.deleteCardText || ''}
              onChange={(e) => onChange('profileScreen', 'deleteCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms Card Text
            </label>
            <input
              type="text"
              value={settings?.termsCardText || ''}
              onChange={(e) => onChange('profileScreen', 'termsCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Card Text
            </label>
            <input
              type="text"
              value={settings?.privacyCardText || ''}
              onChange={(e) => onChange('profileScreen', 'privacyCardText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCustomization;
