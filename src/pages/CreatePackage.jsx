import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, UploadIcon, XIcon, PlusIcon, SearchIcon, ChatIcon } from '../components/Icons';
import packageService from '../services/packageService';
import consultationService from '../services/consultationService';
import { API_BASE_URL } from '../config/api';

export default function CreatePackage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showConsultationDropdown, setShowConsultationDropdown] = useState(false);
  const [consultationSearchQuery, setConsultationSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefits: [''],
    selectedServices: [],
    consultationServices: [],
    price: '',
    image: '',
    imagePublicId: '',
    video: '',
    videoPublicId: ''
  });

  // Track custom prices for each service
  const [customPrices, setCustomPrices] = useState({});

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState({ image: 'url', video: 'url' }); // 'url' or 'file'

  useEffect(() => {
    fetchServices();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.service-dropdown-container')) {
        setShowServiceDropdown(false);
      }
      if (!e.target.closest('.consultation-dropdown-container')) {
        setShowConsultationDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await consultationService.getAllConsultations();
      if (response.success) {
        setServices(response.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('media', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: data.data[0].url,
          imagePublicId: data.data[0].publicId
        }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      return;
    }

    try {
      setUploadingVideo(true);
      const formData = new FormData();
      formData.append('media', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          video: data.data[0].url,
          videoPublicId: data.data[0].publicId
        }));
      }
    } catch (err) {
      console.error('Error uploading video:', err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, image: imageUrlInput.trim(), imagePublicId: '' }));
      setImageUrlInput('');
    }
  };

  const handleVideoUrlSubmit = () => {
    if (videoUrlInput.trim()) {
      setFormData(prev => ({ ...prev, video: videoUrlInput.trim(), videoPublicId: '' }));
      setVideoUrlInput('');
    }
  };

  const handleDeleteImage = async () => {
    if (formData.imagePublicId) {
      try {
        await fetch(`${API_BASE_URL}/api/upload/media/${formData.imagePublicId}?resourceType=image`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    setFormData(prev => ({ ...prev, image: '', imagePublicId: '' }));
  };

  const handleDeleteVideo = async () => {
    if (formData.videoPublicId) {
      try {
        await fetch(`${API_BASE_URL}/api/upload/media/${formData.videoPublicId}?resourceType=video`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
      } catch (err) {
        console.error('Error deleting video:', err);
      }
    }
    setFormData(prev => ({ ...prev, video: '', videoPublicId: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || formData.selectedServices.length === 0) {
      return;
    }

    try {
      setSaving(true);
      
      const packageData = {
        name: formData.name,
        description: formData.description,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        services: formData.selectedServices.map(s => s.id),
        consultationServices: formData.consultationServices.map(s => s.id),
        price: parseFloat(formData.price),
        image: formData.image,
        media: formData.video ? [{ url: formData.video, type: 'video', publicId: formData.videoPublicId }] : [],
        customPrices: customPrices  // Include custom prices for services
      };

      const response = await packageService.createPackage(packageData);
      
      if (response.success) {
        navigate('/consultations/packages');
      }
    } catch (err) {
      console.error('Error creating package:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/consultations/packages')}
          className="flex items-center space-x-2 text-gray-600 hover:text-zennara-green font-semibold mb-4 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to Packages</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Package</h1>
        <p className="text-gray-500">Build your premium consultation package</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information - Apple Card Style */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Package Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., The 'Glow Before the Vow'"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Premium bridal package for instant radiance..."
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Package Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Package Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="15000"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                required
              />
              {formData.selectedServices.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Total value of selected services: ₹{formData.selectedServices.reduce((sum, s) => sum + (customPrices[s.id] || s.price), 0).toLocaleString()}
                  {formData.price && parseFloat(formData.price) < formData.selectedServices.reduce((sum, s) => sum + (customPrices[s.id] || s.price), 0) && (
                    <span className="ml-2 text-green-600 font-semibold">
                      (Save ₹{(formData.selectedServices.reduce((sum, s) => sum + (customPrices[s.id] || s.price), 0) - parseFloat(formData.price)).toLocaleString()})
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Package Benefits */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Benefits</h2>
          <p className="text-gray-500 mb-6">Add key benefits of this package</p>
          
          <div className="space-y-3">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...formData.benefits];
                    newBenefits[index] = e.target.value;
                    setFormData(prev => ({ ...prev, benefits: newBenefits }));
                  }}
                  placeholder="e.g., Instant radiance and glow"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newBenefits = formData.benefits.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, benefits: newBenefits }));
                    }}
                    className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }))}
              className="flex items-center space-x-2 px-4 py-2 text-zennara-green hover:bg-green-50 rounded-xl font-semibold transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Benefit</span>
            </button>
          </div>
        </div>

        {/* Service Selection - Beautiful Dropdown */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Services</h2>
          <p className="text-gray-500 mb-6">Choose services to include in this package</p>
          
          <div className="relative mb-4 service-dropdown-container">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowServiceDropdown(true)}
                placeholder="Search for services to add..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
              />
            </div>
            
            {/* Dropdown Results */}
            {showServiceDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
                {services
                  .filter(service => 
                    !formData.selectedServices.find(s => s.id === service.id) &&
                    (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     service.category?.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          selectedServices: [...prev.selectedServices, service]
                        }));
                        setSearchQuery('');
                        setShowServiceDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.category}</p>
                        </div>
                        <span className="text-zennara-green font-bold">₹{service.price?.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                {services.filter(service => 
                  !formData.selectedServices.find(s => s.id === service.id) &&
                  (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   service.category?.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No services found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Services */}
          <div className="space-y-3">
            {formData.selectedServices.map((service, index) => (
              <div key={service.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-zennara-green/10 flex items-center justify-center">
                      <span className="text-zennara-green font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.category}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Default: ₹{service.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        selectedServices: prev.selectedServices.filter(s => s.id !== service.id)
                      }));
                      // Remove custom price when service is removed
                      setCustomPrices(prev => {
                        const newPrices = { ...prev };
                        delete newPrices[service.id];
                        return newPrices;
                      });
                    }}
                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                
                {/* Custom Price Input */}
                <div className="flex items-center space-x-3 pl-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Custom Price:
                  </label>
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-gray-500">₹</span>
                    <input
                      type="number"
                      value={customPrices[service.id] || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setCustomPrices(prev => ({
                          ...prev,
                          [service.id]: value
                        }));
                      }}
                      placeholder={service.price?.toString()}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                      min="0"
                      step="100"
                    />
                    {customPrices[service.id] && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPrices(prev => {
                            const newPrices = { ...prev };
                            delete newPrices[service.id];
                            return newPrices;
                          });
                        }}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition-all"
                        title="Reset to default price"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(customPrices[service.id] || service.price)?.toLocaleString()}
                    </p>
                    {customPrices[service.id] && customPrices[service.id] !== service.price && (
                      <p className="text-xs text-blue-600 font-medium">
                        {customPrices[service.id] < service.price ? 'Discounted' : 'Premium'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {formData.selectedServices.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No services selected yet</p>
                <p className="text-sm mt-1">Use the search above to add services</p>
              </div>
            )}
          </div>
        </div>

        {/* Package Image & Media */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Image & Media</h2>
          <p className="text-gray-500 mb-6">Add images and videos to showcase your package</p>
          
          {/* Primary Package Image */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-4">Primary Package Image *</label>
            
            {/* Upload Mode Toggle */}
            <div className="flex items-center space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode(prev => ({ ...prev, image: 'url' }))}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  uploadMode.image === 'url'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode(prev => ({ ...prev, image: 'file' }))}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  uploadMode.image === 'file'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>

            {/* URL Input */}
            {uploadMode.image === 'url' && (
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/package-image.jpg"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={handleImageUrlSubmit}
                  className="px-6 py-3 bg-zennara-green text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                >
                  Add
                </button>
              </div>
            )}

            {/* File Upload */}
            {uploadMode.image === 'file' && (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-zennara-green transition-colors cursor-pointer">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600 font-semibold">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-semibold mb-2">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-4 relative">
                <img 
                  src={formData.image} 
                  alt="Package preview" 
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Package Video (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">Package Video (Optional)</label>
            
            {/* Upload Mode Toggle */}
            <div className="flex items-center space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode(prev => ({ ...prev, video: 'url' }))}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  uploadMode.video === 'url'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode(prev => ({ ...prev, video: 'file' }))}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  uploadMode.video === 'file'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>

            {/* URL Input */}
            {uploadMode.video === 'url' && (
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://example.com/package-video.mp4"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={handleVideoUrlSubmit}
                  className="px-6 py-3 bg-zennara-green text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                >
                  Add
                </button>
              </div>
            )}

            {/* File Upload */}
            {uploadMode.video === 'file' && (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-zennara-green transition-colors cursor-pointer">
                  {uploadingVideo ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600 font-semibold">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-semibold mb-2">Click to upload video</p>
                      <p className="text-sm text-gray-500">MP4, WebM up to 50MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                  disabled={uploadingVideo}
                />
              </label>
            )}

            {/* Video Preview */}
            {formData.video && (
              <div className="mt-4 relative">
                <video 
                  src={formData.video} 
                  controls
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Optional Consultation Services */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Consultation Services (Optional)</h2>
          <p className="text-gray-500 mb-6">Include consultation sessions with this package</p>
          
          <div className="relative mb-4 consultation-dropdown-container">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={consultationSearchQuery}
                onChange={(e) => setConsultationSearchQuery(e.target.value)}
                onFocus={() => setShowConsultationDropdown(true)}
                placeholder="Search for consultation services..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
              />
            </div>
            
            {/* Consultation Dropdown */}
            {showConsultationDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
                {services
                  .filter(service => 
                    !formData.consultationServices.find(s => s.id === service.id) &&
                    !formData.selectedServices.find(s => s.id === service.id) &&
                    (service.name.toLowerCase().includes(consultationSearchQuery.toLowerCase()) ||
                     service.category?.toLowerCase().includes(consultationSearchQuery.toLowerCase()))
                  )
                  .map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          consultationServices: [...prev.consultationServices, service]
                        }));
                        setConsultationSearchQuery('');
                        setShowConsultationDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.category}</p>
                        </div>
                        <span className="text-zennara-green font-bold">₹{service.price?.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                {services.filter(service => 
                  !formData.consultationServices.find(s => s.id === service.id) &&
                  !formData.selectedServices.find(s => s.id === service.id) &&
                  (service.name.toLowerCase().includes(consultationSearchQuery.toLowerCase()) ||
                   service.category?.toLowerCase().includes(consultationSearchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No consultation services found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Consultation Services */}
          <div className="space-y-3">
            {formData.consultationServices.map((service, index) => (
              <div key={service.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ChatIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 font-bold">₹{service.price?.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        consultationServices: prev.consultationServices.filter(s => s.id !== service.id)
                      }));
                    }}
                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            {formData.consultationServices.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No consultation services added</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
          <div className="max-w-[1000px] mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/consultations/packages')}
              className="px-6 py-3 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.name || !formData.description || !formData.price || formData.selectedServices.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Spacer for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}
