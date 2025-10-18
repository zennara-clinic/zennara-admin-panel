import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  StarIcon,
  CurrencyIcon,
  ClockIcon
} from './Icons';

export default function AddEditService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    featured: false,
    popular: false,
    available: true,
  });

  const categories = ['Skin', 'Hair', 'Facials', 'Aesthetics', 'Peels', 'Laser', 'Injectables', 'Body Treatments'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data:', formData);
    navigate('/consultations/services');
  };

  return (
    <div className="min-h-screen p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/consultations/services')}
          className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Services</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </h1>
        <p className="text-base text-gray-500">
          {isEdit ? 'Update service details' : 'Create a new consultation service'}
        </p>
      </div>

      {/* Form */}
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., HydraFacial MD, Full Face HIFU"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <div className="relative">
                  <CurrencyIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="8850"
                    className="w-full pl-12 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="60 min"
                    className="w-full pl-12 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the service, benefits, and what it includes..."
                rows={6}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Images</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-zennara-green transition-all cursor-pointer">
            <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-900 mb-2">Upload Service Images</p>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-gray-700 transition-all"
            >
              Choose Files
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          
          <div className="space-y-6">
            {/* Availability */}
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900 mb-1">Service Availability</p>
                <p className="text-sm text-gray-600">Make this service available for booking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zennara-green/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zennara-green"></div>
              </label>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between p-5 bg-purple-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900 mb-1">Featured Service</p>
                <p className="text-sm text-gray-600">Show this service in featured section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Popular */}
            <div className="flex items-center justify-between p-5 bg-orange-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900 mb-1">Popular Service</p>
                <p className="text-sm text-gray-600">Mark as popular/trending service</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/consultations/services')}
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            {isEdit ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
