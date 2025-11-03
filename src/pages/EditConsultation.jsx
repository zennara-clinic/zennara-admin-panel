import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  Clipboard
} from 'lucide-react';
import consultationService from '../services/consultationService';
import { SkeletonForm } from '../components/SkeletonLoader';
import { API_BASE_URL } from '../config/api';

export default function EditConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    summary: '',
    about: '',
    key_benefits: [''],
    ideal_for: [''],
    price: '',
    cta_label: 'Book Consultation',
    tags: [''],
    faqs: [{ q: '', a: '' }],
    pre_care: [''],
    post_care: [''],
    image: '',
    media: [],
    rating: null,
    showPriceInApp: false,
    isPopular: false
  });

  const [uploadMethod, setUploadMethod] = useState('url');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [uploading, setUploading] = useState(false);
  const [primaryImageMethod, setPrimaryImageMethod] = useState('url');
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchConsultation();
    fetchCategories();
  }, [id]);

  useEffect(() => {
    // Run validation whenever formData changes, but only show errors for touched fields
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await consultationService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to default categories
      setCategories([
        'Facial & Peels',
        'Medical Peels',
        'Skin Boosters',
        'Injectables',
        'Body Contouring',
        'Pigmentation',
        'Skin Rejuvenation'
      ]);
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setSavingCategory(true);
      const response = await consultationService.createCategory({ name: newCategoryName.trim() });
      if (response.success) {
        await fetchCategories();
        setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
        setNewCategoryName('');
        setShowNewCategory(false);
      }
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setSavingCategory(false);
    }
  };

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getConsultation(id);
      if (response.success) {
        const data = response.data;
        const initialData = {
          name: data.name || '',
          category: data.category || '',
          summary: data.summary || '',
          about: data.about || '',
          key_benefits: data.key_benefits?.length > 0 ? data.key_benefits : [''],
          ideal_for: data.ideal_for?.length > 0 ? data.ideal_for : [''],
          price: data.price || '',
          cta_label: data.cta_label || 'Book Consultation',
          tags: data.tags?.length > 0 ? data.tags : [''],
          faqs: data.faqs?.length > 0 ? data.faqs : [{ q: '', a: '' }],
          pre_care: data.pre_care?.length > 0 ? data.pre_care : [''],
          post_care: data.post_care?.length > 0 ? data.post_care : [''],
          image: data.image || '',
          media: data.media?.length > 0 ? data.media : [],
          rating: data.rating !== undefined && data.rating !== null ? data.rating : null,
          showPriceInApp: data.showPriceInApp !== undefined ? data.showPriceInApp : false,
          isPopular: data.isPopular !== undefined ? data.isPopular : false
        };
        setFormData(initialData);
        setOriginalData(initialData); // Save original data for comparison
      }
    } catch (err) {
      console.error('Error fetching consultation:', err);
      setError('Failed to load consultation details');
    } finally {
      setLoading(false);
    }
  };

  // Check if form data has changed
  const hasChanges = () => {
    if (!originalData) return false;
    
    // Helper function to compare arrays
    const arraysEqual = (a, b) => {
      if (a.length !== b.length) return false;
      return a.every((val, index) => {
        if (typeof val === 'object') {
          return JSON.stringify(val) === JSON.stringify(b[index]);
        }
        return val === b[index];
      });
    };
    
    // Check simple fields
    const simpleFields = ['name', 'category', 'summary', 'about', 'price', 'cta_label', 'image', 'rating', 'showPriceInApp', 'isPopular'];
    for (const field of simpleFields) {
      if (formData[field] !== originalData[field]) {
        return true;
      }
    }
    
    // Check array fields
    const arrayFields = ['key_benefits', 'ideal_for', 'tags', 'faqs', 'pre_care', 'post_care', 'media'];
    for (const field of arrayFields) {
      if (!arraysEqual(formData[field] || [], originalData[field] || [])) {
        return true;
      }
    }
    
    return false;
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Service name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Service name must be at least 3 characters';
    }

    if (!formData.category || !formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (!formData.summary || !formData.summary.trim()) {
      errors.summary = 'Summary is required';
    } else if (formData.summary.trim().length < 10) {
      errors.summary = 'Summary must be at least 10 characters';
    }

    if (!formData.about || !formData.about.trim()) {
      errors.about = 'Description is required';
    } else if (formData.about.trim().length < 20) {
      errors.about = 'Description must be at least 20 characters';
    }

    if (!formData.price || formData.price === '') {
      errors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (isNaN(parseFloat(formData.price))) {
      errors.price = 'Price must be a valid number';
    }

    if (!formData.image || !formData.image.trim()) {
      errors.image = 'Primary image is required';
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      errors.image = 'Please provide a valid image URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      category: true,
      summary: true,
      about: true,
      price: true,
      image: true
    });

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Clean up arrays - remove empty strings
      const cleanedData = {
        ...formData,
        key_benefits: formData.key_benefits.filter(item => item.trim() !== ''),
        ideal_for: formData.ideal_for.filter(item => item.trim() !== ''),
        tags: formData.tags.filter(item => item.trim() !== ''),
        pre_care: formData.pre_care.filter(item => item.trim() !== ''),
        post_care: formData.post_care.filter(item => item.trim() !== ''),
        faqs: formData.faqs.filter(faq => faq.q.trim() !== '' && faq.a.trim() !== '')
      };

      const response = await consultationService.updateConsultation(id, cleanedData);
      
      if (response.success) {
        navigate('/consultations/services');
      }
    } catch (err) {
      console.error('Error updating consultation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleFAQChange = (index, field, value) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const addFAQ = () => {
    setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { q: '', a: '' }] }));
  };

  const removeFAQ = (index) => {
    const newFAQs = formData.faqs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  // Primary Image Upload Handler
  const handlePrimaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPrimary(true);
      const formDataUpload = new FormData();
      formDataUpload.append('media', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formDataUpload
      });

      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: result.data[0].url
        }));
        // Reset file input
        e.target.value = '';
      } else {
        console.error('Upload failed:', result.message);
      }
    } catch (error) {
      console.error('Primary image upload error:', error);
    } finally {
      setUploadingPrimary(false);
    }
  };

  // Media Upload Handlers
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('media', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formDataUpload
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          media: [...(prev.media || []), ...result.data]
        }));
        // Reset file input
        e.target.value = '';
      } else {
        console.error('Upload failed:', result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMediaUrl = async () => {
    if (!mediaUrl.trim()) return;

    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/api/upload/media-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: mediaUrl, type: mediaType })
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          media: [...(prev.media || []), result.data]
        }));
        setMediaUrl('');
      } else {
        console.error('Failed to add URL:', result.message);
      }
    } catch (error) {
      console.error('URL add error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (index) => {
    const mediaItem = formData.media[index];
    
    // Show confirmation
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${mediaItem?.type || 'media'}? ${
        mediaItem?.publicId ? 'It will be permanently removed from Cloudinary.' : ''
      }`
    );
    
    if (!confirmDelete) return;
    
    // If media has publicId, delete from Cloudinary
    if (mediaItem && mediaItem.publicId) {
      try {
        console.log('🗑️ Deleting from Cloudinary:', mediaItem.publicId);
        
        const response = await fetch(
          `${API_BASE_URL}/api/upload/media/${encodeURIComponent(mediaItem.publicId)}?resourceType=${mediaItem.type}`,
          {
            method: 'DELETE'
          }
        );

        const result = await response.json();
        
        if (!result.success) {
          console.error('❌ Failed to delete from Cloudinary:', result.message);
        } else {
          console.log('✅ Media deleted from Cloudinary successfully');
        }
      } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
      }
    }
    
    // Remove from formData
    const newMedia = (formData.media || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const handlePreviewMedia = (mediaItem, index) => {
    setPreviewMedia({ ...mediaItem, index });
    setShowPreviewModal(true);
  };

  const handleDeleteFromPreview = () => {
    if (previewMedia && previewMedia.index !== undefined) {
      removeMedia(previewMedia.index);
      setShowPreviewModal(false);
      setPreviewMedia(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-10 max-w-[1200px] mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Form Skeleton */}
        <SkeletonForm />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/consultations/services')}
            className="px-6 py-3 bg-zennara-green text-white rounded-2xl font-semibold"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/consultations/services')}
          className="flex items-center space-x-2 text-gray-600 hover:text-zennara-green font-semibold mb-4 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to Services</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Service</h1>
        <p className="text-gray-500">Update service details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., HydraFacial MD, Full Face HIFU"
                className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-colors ${
                  touched.name && validationErrors.name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                }`}
                required
              />
              {touched.name && validationErrors.name && (
                <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="text-sm font-semibold text-zennara-green hover:text-emerald-700 transition-colors"
                >
                  {showNewCategory ? '- Cancel' : '+ New Category'}
                </button>
              </div>
              
              {showNewCategory ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter new category name"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim() || savingCategory}
                      className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingCategory ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Press Enter or click Add to create the new category</p>
                </div>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 appearance-none transition-colors ${
                    touched.category && validationErrors.category
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
              {!showNewCategory && touched.category && validationErrors.category && (
                <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                onBlur={() => handleBlur('price')}
                placeholder="8850"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-colors ${
                  touched.price && validationErrors.price
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                }`}
                required
              />
              {touched.price && validationErrors.price && (
                <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.price}</p>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Summary (Short Description) *
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                onBlur={() => handleBlur('summary')}
                placeholder="Brief one-line description"
                rows="2"
                className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-colors ${
                  touched.summary && validationErrors.summary
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                }`}
                required
              />
              {touched.summary && validationErrors.summary && (
                <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.summary}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.about}
                onChange={(e) => handleChange('about', e.target.value)}
                onBlur={() => handleBlur('about')}
                placeholder="Detailed description of the service, benefits, and what it includes..."
                rows="6"
                className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-colors ${
                  touched.about && validationErrors.about
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                }`}
                required
              />
              {touched.about && validationErrors.about && (
                <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* Settings & Toggles */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Display Settings</h2>
          
          <div className="space-y-6">
            {/* Show Price in App Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Show Price in Mobile App</h3>
                <p className="text-sm text-gray-600">When enabled, the price will be displayed on consultation listing and detail pages in the mobile app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData.showPriceInApp}
                  onChange={(e) => handleChange('showPriceInApp', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zennara-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zennara-green"></div>
              </label>
            </div>

            {/* Mark as Popular Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Mark as Popular</h3>
                <p className="text-sm text-gray-600">Popular treatments are highlighted with a special badge in the mobile app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => handleChange('isPopular', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Service Images & Media */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Images & Videos</h2>
          
          {/* Primary Image (Required) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Primary Image * (Main thumbnail)
              </label>
              {/* Upload Method Toggle for Primary Image */}
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPrimaryImageMethod('url')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    primaryImageMethod === 'url'
                      ? 'bg-white text-zennara-green shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryImageMethod('file')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    primaryImageMethod === 'file'
                      ? 'bg-white text-zennara-green shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
              </div>
            </div>

            {/* URL Method */}
            {primaryImageMethod === 'url' && (
              <>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  onBlur={() => handleBlur('image')}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 border-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-colors ${
                    touched.image && validationErrors.image
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-zennara-green focus:border-zennara-green'
                  }`}
                  required
                />
                {touched.image && validationErrors.image && (
                  <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {validationErrors.image}</p>
                )}
              </>
            )}

            {/* File Upload Method */}
            {primaryImageMethod === 'file' && (
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                    uploadingPrimary ? 'border-zennara-green bg-green-50' : 'border-gray-300 hover:border-zennara-green'
                  }`}>
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      {uploadingPrimary ? 'Uploading...' : 'Click to upload primary image'}
                    </p>
                    <p className="text-sm text-gray-500">JPG, PNG, GIF, WebP up to 50MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryImageUpload}
                    disabled={uploadingPrimary}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Preview */}
            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Primary Preview"
                  className="w-full h-64 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Media Gallery */}
          <div className="pt-8 border-t-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Media Gallery (Images & Videos)</h3>
            
            {/* Upload Method Toggle */}
            <div className="flex items-center space-x-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  uploadMethod === 'url'
                    ? 'bg-white text-zennara-green shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Add by URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  uploadMethod === 'file'
                    ? 'bg-white text-zennara-green shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </button>
            </div>

            {/* URL Method */}
            {uploadMethod === 'url' && (
              <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Media URL</label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://example.com/media.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMediaUrl}
                  disabled={!mediaUrl.trim() || uploading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Adding...' : 'Add Media'}
                </button>
              </div>
            )}

            {/* File Upload Method */}
            {uploadMethod === 'file' && (
              <div className="mb-6 p-6 bg-gray-50 rounded-2xl">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-zennara-green transition-colors cursor-pointer">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">Images (JPG, PNG, GIF, WebP) or Videos (MP4, MOV, AVI) up to 50MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Media Gallery Grid */}
            {formData.media && formData.media.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.media.map((item, index) => (
                  <div key={index} className="relative group cursor-pointer" onClick={() => handlePreviewMedia(item, index)}>
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative w-full h-48 bg-gray-900 rounded-xl overflow-hidden">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Quick Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(index);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      title="Delete"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewMedia(item, index);
                      }}
                      className="absolute top-2 left-2 p-2 bg-white text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 z-10"
                      title="Preview"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-semibold rounded">
                      {item.type === 'image' ? '📷 Image' : '🎥 Video'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
          
          {formData.key_benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange('key_benefits', index, e.target.value)}
                placeholder="Enter a key benefit"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
              />
              {formData.key_benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('key_benefits', index)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('key_benefits')}
            className="mt-3 px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
          >
            + Add Benefit
          </button>
        </div>

        {/* Ideal For */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ideal For</h2>
          
          {formData.ideal_for.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('ideal_for', index, e.target.value)}
                placeholder="Who is this service ideal for?"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
              />
              {formData.ideal_for.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('ideal_for', index)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('ideal_for')}
            className="mt-3 px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
          >
            + Add Item
          </button>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>
          
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                placeholder="Enter a tag"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('tags')}
            className="mt-3 px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
          >
            + Add Tag
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
          
          {formData.faqs.map((faq, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700">FAQ {index + 1}</h3>
                {formData.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={faq.q}
                onChange={(e) => handleFAQChange(index, 'q', e.target.value)}
                placeholder="Question"
                className="w-full px-4 py-3 mb-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
              />
              <textarea
                value={faq.a}
                onChange={(e) => handleFAQChange(index, 'a', e.target.value)}
                placeholder="Answer"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green"
              />
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFAQ}
            className="mt-3 px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
          >
            + Add FAQ
          </button>
        </div>

        {/* Spacer for sticky footer */}
        <div className="h-24"></div>
      </form>

      {/* Sticky Footer with Submit Buttons */}
      <div className="fixed bottom-0 left-72 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-[1200px] mx-auto px-10 py-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/consultations/services')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving || !hasChanges()}
              className="px-8 py-4 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Media Preview Modal */}
      {showPreviewModal && previewMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4"
          onClick={() => {
            setShowPreviewModal(false);
            setPreviewMedia(null);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Media Preview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {previewMedia.type === 'image' ? '📷 Image' : '🎥 Video'} • Position: {previewMedia.index + 1} of {formData.media.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewMedia(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-auto">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt="Preview"
                  className="w-full h-auto rounded-2xl"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  className="w-full h-auto rounded-2xl bg-black"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Media Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Media Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {previewMedia.type === 'image' ? 'Image' : 'Video'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {previewMedia.index + 1} of {formData.media.length}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">URL:</span>
                    <div className="mt-1 p-2 bg-white rounded border border-gray-200 text-xs font-mono break-all">
                      {previewMedia.url}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewMedia.url);
                      }}
                      className="mt-2 text-xs text-zennara-green hover:text-emerald-700 font-semibold"
                    >
                      📋 Copy URL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <a
                href={previewMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
              >
                Open in New Tab →
              </a>
              <button
                type="button"
                onClick={handleDeleteFromPreview}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all flex items-center space-x-2"
              >
                <XIcon className="w-5 h-5" />
                <span>Delete Media</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
