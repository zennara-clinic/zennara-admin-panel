import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, UploadIcon, XIcon, PlusIcon, SearchIcon, ChatIcon } from '../components/Icons';
import packageService from '../services/packageService';
import consultationService from '../services/consultationService';

export default function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    media: []
  });

  // Track custom prices for each service
  const [customPrices, setCustomPrices] = useState({});

  useEffect(() => {
    fetchPackage();
    fetchServices();
  }, [id]);

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

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await packageService.getPackage(id);
      if (response.success) {
        const pkg = response.data;
        
        // Transform services array to match form structure
        const selectedServices = pkg.services?.map(s => ({
          id: s.serviceId,
          name: s.serviceName,
          price: s.servicePrice
        })) || [];

        // Initialize custom prices from package data
        const initialCustomPrices = {};
        pkg.services?.forEach(s => {
          if (s.customPrice !== undefined && s.customPrice !== s.servicePrice) {
            initialCustomPrices[s.serviceId] = s.customPrice;
          }
        });
        setCustomPrices(initialCustomPrices);

        const consultationServices = pkg.consultationServices?.map(s => ({
          id: s.serviceId,
          name: s.serviceName,
          price: s.servicePrice
        })) || [];

        setFormData({
          name: pkg.name || '',
          description: pkg.description || '',
          benefits: pkg.benefits?.length > 0 ? pkg.benefits : [''],
          selectedServices,
          consultationServices,
          price: pkg.price?.toString() || '',
          image: pkg.image || '',
          media: pkg.media || []
        });
      }
    } catch (err) {
      console.error('Error fetching package:', err);
    } finally {
      setLoading(false);
    }
  };

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
        media: formData.media,
        customPrices: customPrices  // Include custom prices for services
      };

      const response = await packageService.updatePackage(id, packageData);
      
      if (response.success) {
        navigate('/consultations/packages');
      }
    } catch (err) {
      console.error('Error updating package:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 max-w-[1000px] mx-auto">
        <div className="mb-8 space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-12 w-full bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Package</h1>
        <p className="text-gray-500">Update your consultation package</p>
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

        {/* Service Selection */}
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
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Package Image
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/package-image.jpg"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
            />
          </div>

          {formData.image && (
            <div className="mb-6">
              <img 
                src={formData.image} 
                alt="Package preview" 
                className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Spacer for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}
