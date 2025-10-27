import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, X, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formulations, setFormulations] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formulation: 'Serum',
    OrgName: '',
    code: '',
    price: '',
    gstPercentage: '18',
    image: '',
    stock: '',
    isActive: true,
    isPopular: false
  });

  useEffect(() => {
    fetchFormulations();
    fetchBrands();
  }, []);

  const fetchFormulations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/formulations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Formulations API Response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        const formulations = response.data.data.map(f => f.name || f).sort();
        setFormulations(formulations);
      } else if (Array.isArray(response.data)) {
        const formulations = response.data.map(f => f.name || f).sort();
        setFormulations(formulations);
      }
    } catch (error) {
      console.error('Error fetching formulations:', error);
      // Fallback to hardcoded list
      setFormulations([
        'Anti Aging', 'Cream', 'Face Wash', 'Facial Treatment',
        'Hydrafacial Consumable', 'Injection', 'Lipbalm',
        'Moisturizer', 'Pigmentation', 'Sachets', 'Serum',
        'Shampoo', 'Sunscreen', 'Sunscreen Stick'
      ]);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/brands`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Brands API Response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        const brands = response.data.data.map(b => b.name || b.OrgName || b).sort();
        setBrands(brands);
      } else if (Array.isArray(response.data)) {
        const brands = response.data.map(b => b.name || b.OrgName || b).sort();
        setBrands(brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Fallback to hardcoded list
      setBrands([
        'Derma Essentials', 'Luxe Beauty', 'Zennara Hair',
        'Zennara Pro', 'Zennara Skincare'
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const uploadFormData = new FormData();
      uploadFormData.append('media', file);

      const response = await axios.post(`${API_URL}/upload/media`, uploadFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: response.data.data[0].url
        }));
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(null), 3000);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.OrgName || !formData.price) {
      setError('Please fill in all required fields (name, description, organization, price)');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        gstPercentage: parseFloat(formData.gstPercentage),
        stock: parseInt(formData.stock) || 0
      };

      await axios.post(`${API_URL}/admin/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Failed to create product');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Product Created!</p>
                <p className="text-sm text-gray-600">Redirecting to products...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">Error</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="group p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Add New Product</h1>
                  <p className="text-sm text-gray-600 font-medium">Create a stunning product for your catalog</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-8 pb-32">
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image with Drag & Drop */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Product Image</h2>
                <p className="text-sm text-gray-600">Upload a stunning image for your product</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative group aspect-square rounded-3xl overflow-hidden transition-all duration-300 ${
                  dragActive
                    ? 'border-4 border-emerald-500 bg-emerald-50/50'
                    : 'border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
              >
                {imagePreview || formData.image ? (
                  <>
                    <img
                      src={imagePreview || formData.image || 'https://res.cloudinary.com/dimlozhrx/image/upload/v1761587818/Upload_Product_Image_f3jvxi.png'}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-white text-lg font-bold">Uploading...</p>
                        </div>
                      </div>
                    )}
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: '' }));
                          setImagePreview(null);
                        }}
                        className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-10 h-10 text-gray-500" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-2">Drop your image here</p>
                      <p className="text-sm text-gray-600 mb-6">or click to browse</p>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0])}
                          className="hidden"
                          disabled={uploading}
                        />
                        <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-2xl cursor-pointer inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                          <Upload className="w-4 h-4" />
                          <span>Choose File</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50">
                    <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-4">Image Guidelines</h3>
                    <div className="space-y-3">
                      {[
                        'Use high-resolution images (min 1200x1200px)',
                        'Keep backgrounds clean and simple',
                        'Ensure good lighting and clarity',
                        'Supported formats: JPG, PNG, WebP',
                        'Maximum file size: 5MB'
                      ].map((guideline, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-emerald-900 font-medium">{guideline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Essential details about your product</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Hydrating Hyaluronic Serum"
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Brand/Organization <span className="text-red-500">*</span>
                </label>
                <select
                  name="OrgName"
                  value={formData.OrgName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300 cursor-pointer"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Formulation <span className="text-red-500">*</span>
                </label>
                <select
                  name="formulation"
                  value={formData.formulation}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300 cursor-pointer"
                  required
                >
                  {formulations.map(formulation => (
                    <option key={formulation} value={formulation}>{formulation}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Product Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., ZEN-SER-001 (optional)"
                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Generate code format: BRAND-FORM-TIMESTAMP
                      const brand = formData.OrgName ? formData.OrgName.substring(0, 3).toUpperCase().replace(/\s/g, '') : 'ZEN';
                      const form = formData.formulation ? formData.formulation.substring(0, 3).toUpperCase().replace(/\s/g, '') : 'PRD';
                      const timestamp = Date.now().toString().slice(-6);
                      const generatedCode = `${brand}-${form}-${timestamp}`;
                      setFormData(prev => ({ ...prev, code: generatedCode }));
                    }}
                    className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-base font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed product description..."
                  rows={5}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Pricing & Stock</h2>
                <p className="text-sm text-gray-600">Set prices and manage inventory</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1299"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  GST (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="gstPercentage"
                    value={formData.gstPercentage}
                    onChange={handleChange}
                    placeholder="18"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Settings</h2>
                <p className="text-sm text-gray-600">Configure product visibility and status</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <label className="flex items-start gap-4 cursor-pointer group p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-lg"></div>
                </div>
                <div className="flex-1">
                  <span className="text-base font-black text-gray-900 block">Active Product</span>
                  <span className="text-sm text-gray-600">Product will be visible and available to customers</span>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-lg"></div>
                </div>
                <div className="flex-1">
                  <span className="text-base font-black text-gray-900 block">Mark as Popular</span>
                  <span className="text-sm text-gray-600">Show in featured and popular products section</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-gray-200/50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">Required fields</span> are marked with *
              </p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={loading || uploading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Product...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
