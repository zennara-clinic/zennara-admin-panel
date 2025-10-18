import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PlusIcon,
  XCircleIcon,
  CheckCircleIcon,
  StarIcon,
  DocumentIcon,
  ClockIcon,
  CurrencyIcon,
  UsersIcon,
  ChevronDownIcon
} from './Icons';
import { allServices } from '../data/servicesData';

export default function PackageBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    sessions: 1,
    validityPeriod: '',
    targetAudience: '',
    idealFor: '',
    timing: '',
    featured: false,
    popular: false,
    published: true
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceCustomizations, setServiceCustomizations] = useState({}); // Store custom pricing, duration for each service
  const [customServices, setCustomServices] = useState([]); // Completely custom services
  const [benefits, setBenefits] = useState(['']);
  const [inclusions, setInclusions] = useState(['']);
  const [options, setOptions] = useState(['']);
  const [addOns, setAddOns] = useState([{ name: '', price: '', optional: true }]); // Optional add-ons
  const [customTreatments, setCustomTreatments] = useState(['']);
  const [packageImage, setPackageImage] = useState(null);
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const categories = ['Bridal', 'Hair', 'Anti-Aging', 'Body Contour', 'Skin Care', 'Wellness'];
  const targetAudiences = ['Brides', 'Grooms', 'Pre-Event', 'Post-Event', 'General Wellness', 'Special Occasions'];
  const timingOptions = ['1 day before event', '3-4 days before event', '1 week before event', '2 weeks before event', 'Ongoing treatment', 'Flexible'];

  // Calculate total price from selected services + customizations + add-ons
  const calculateTotalPrice = () => {
    // Regular services with customizations
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const customization = serviceCustomizations[serviceId];
      if (customization?.customPrice) {
        return sum + parseFloat(customization.customPrice);
      }
      const service = allServices.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
    
    // Custom services
    const customTotal = customServices.reduce((sum, service) => {
      return sum + (parseFloat(service.price) || 0);
    }, 0);
    
    // Add-ons (non-optional only for base calculation)
    const addOnsTotal = addOns.reduce((sum, addon) => {
      if (!addon.optional && addon.price) {
        return sum + parseFloat(addon.price);
      }
      return sum;
    }, 0);
    
    return servicesTotal + customTotal + addOnsTotal;
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const customizeService = (serviceId) => {
    const service = allServices.find(s => s.id === serviceId);
    setEditingService({ ...service, serviceId });
  };

  const saveServiceCustomization = (serviceId, customization) => {
    setServiceCustomizations(prev => ({
      ...prev,
      [serviceId]: customization
    }));
    setEditingService(null);
  };

  const addCustomService = () => {
    setCustomServices(prev => [...prev, {
      id: `CUSTOM_${Date.now()}`,
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'Custom'
    }]);
  };

  const updateCustomService = (index, field, value) => {
    setCustomServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ));
  };

  const removeCustomService = (index) => {
    setCustomServices(prev => prev.filter((_, i) => i !== index));
  };

  const addAddOn = () => {
    setAddOns(prev => [...prev, { name: '', price: '', optional: true }]);
  };

  const updateAddOn = (index, field, value) => {
    setAddOns(prev => prev.map((addon, i) => 
      i === index ? { ...addon, [field]: value } : addon
    ));
  };

  const removeAddOn = (index) => {
    setAddOns(prev => prev.filter((_, i) => i !== index));
  };

  const addField = (setter) => {
    setter(prev => [...prev, '']);
  };

  const removeField = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateField = (setter, index, value) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const packageData = {
      ...formData,
      selectedServices,
      benefits: benefits.filter(b => b.trim()),
      inclusions: inclusions.filter(i => i.trim()),
      options: options.filter(o => o.trim()),
      customTreatments: customTreatments.filter(t => t.trim()),
      calculatedPrice: calculateTotalPrice(),
      image: packageImage
    };
    console.log('Package Data:', packageData);
    navigate('/consultations/packages');
  };

  return (
    <div className="min-h-screen p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/consultations/packages')}
          className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Packages</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Package' : 'Create New Package'}
        </h1>
        <p className="text-base text-gray-500">Build your premium consultation package</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            {/* Package Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">PACKAGE NAME *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='e.g., The "Glow Before the Vow"'
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">DESCRIPTION *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Premium bridal package for instant radiance..."
                rows={4}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all resize-none"
                required
              />
            </div>

            {/* Category & Target Audience */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">CATEGORY *</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">TARGET AUDIENCE *</label>
                <div className="relative">
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select audience</option>
                    {targetAudiences.map(aud => <option key={aud} value={aud}>{aud}</option>)}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Ideal For & Timing */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">IDEAL FOR</label>
                <input
                  type="text"
                  value={formData.idealFor}
                  onChange={(e) => setFormData({ ...formData, idealFor: e.target.value })}
                  placeholder="e.g., Brides/Grooms a day before event"
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">TIMING</label>
                <div className="relative">
                  <select
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select timing</option>
                    {timingOptions.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Duration</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">PACKAGE PRICE (₹) *</label>
              <div className="relative">
                <CurrencyIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="50000"
                  className="w-full pl-12 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">Calculated from services: ₹{calculateTotalPrice().toLocaleString('en-IN')}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">DURATION</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3-4 hours"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">NUMBER OF SESSIONS</label>
              <input
                type="number"
                value={formData.sessions}
                onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                min="1"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">VALIDITY PERIOD</label>
              <input
                type="text"
                value={formData.validityPeriod}
                onChange={(e) => setFormData({ ...formData, validityPeriod: e.target.value })}
                placeholder="e.g., 6 months"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
              />
            </div>
          </div>
        </div>

        {/* Services Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Services</h2>
            <span className="text-sm font-bold text-zennara-green">{selectedServices.length} selected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {allServices.slice(0, 30).map(service => {
              const isSelected = selectedServices.includes(service.id);
              const customization = serviceCustomizations[service.id];
              return (
                <div
                  key={service.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'bg-zennara-green/10 border-zennara-green'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2" onClick={() => toggleService(service.id)}>
                    <div className="flex-1 cursor-pointer">
                      <p className="font-bold text-gray-900 text-sm mb-1">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.category}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-zennara-green text-sm">
                        ₹{(customization?.customPrice || service.price).toLocaleString('en-IN')}
                      </p>
                      {isSelected && (
                        <CheckCircleIcon className="w-5 h-5 text-zennara-green mt-1" />
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <button
                      type="button"
                      onClick={() => customizeService(service.id)}
                      className="w-full mt-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all"
                    >
                      Customize Price/Duration
                    </button>
                  )}
                  {customization && (
                    <div className="mt-2 text-xs text-gray-600">
                      {customization.note && <p>Note: {customization.note}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Services Builder */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Custom Services</h2>
              <p className="text-sm text-gray-500 mt-1">Build special services unique to this package</p>
            </div>
            <button
              type="button"
              onClick={addCustomService}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:shadow-md transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Custom Service</span>
            </button>
          </div>

          {customServices.length > 0 ? (
            <div className="space-y-4">
              {customServices.map((service, index) => (
                <div key={service.id} className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Custom Service #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeCustomService(index)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Service Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateCustomService(index, 'name', e.target.value)}
                        placeholder="e.g., Exclusive Bridal Glow Session"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateCustomService(index, 'description', e.target.value)}
                        placeholder="Describe what's included..."
                        rows={2}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateCustomService(index, 'price', e.target.value)}
                        placeholder="15000"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={service.duration}
                        onChange={(e) => updateCustomService(index, 'duration', e.target.value)}
                        placeholder="60 minutes"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No custom services added yet. Click "Add Custom Service" to create one.</p>
            </div>
          )}
        </div>

        {/* Add-Ons & Optional Extras */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add-Ons & Optional Extras</h2>
              <p className="text-sm text-gray-500 mt-1">Optional services customers can add to their package</p>
            </div>
            <button
              type="button"
              onClick={addAddOn}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:shadow-md transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Add-On</span>
            </button>
          </div>

          <div className="space-y-3">
            {addOns.map((addon, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
                <input
                  type="text"
                  value={addon.name}
                  onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                  placeholder="e.g., Extra LED Therapy Session"
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <input
                  type="number"
                  value={addon.price}
                  onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                  placeholder="₹ Price"
                  className="w-32 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <label className="flex items-center space-x-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addon.optional}
                    onChange={(e) => updateAddOn(index, 'optional', e.target.checked)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm font-bold text-gray-700">Optional</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeAddOn(index)}
                  className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Lists */}
        {[
          { title: 'Benefits', state: benefits, setter: setBenefits, placeholder: 'e.g., Immediate red-carpet glow' },
          { title: 'Inclusions', state: inclusions, setter: setInclusions, placeholder: 'e.g., Face LED + IV Drip Therapy' },
          { title: 'Options', state: options, setter: setOptions, placeholder: 'e.g., Lip polish & hydration' },
          { title: 'Custom Treatments', state: customTreatments, setter: setCustomTreatments, placeholder: 'e.g., Special consultation session' }
        ].map(({ title, state, setter, placeholder }) => (
          <div key={title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <button
                type="button"
                onClick={() => addField(setter)}
                className="flex items-center space-x-2 px-4 py-2 bg-zennara-green text-white rounded-xl font-bold hover:shadow-md transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add {title.slice(0, -1)}</span>
              </button>
            </div>

            <div className="space-y-3">
              {state.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateField(setter, index, e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(setter, index)}
                    className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Package Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Settings</h2>
          
          <div className="space-y-4">
            {[
              { label: 'Publish Package', key: 'published', desc: 'Make this package visible to customers' },
              { label: 'Featured Package', key: 'featured', desc: 'Show as featured on main page' },
              { label: 'Popular Package', key: 'popular', desc: 'Mark as popular choice' }
            ].map(({ label, key, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, [key]: !formData[key] })}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    formData[key] ? 'bg-zennara-green' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData[key] ? 'transform translate-x-7' : ''
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/consultations/packages')}
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            {isEdit ? 'Update Package' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
