import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ChartIcon,
  SettingsIcon,
  EyeIcon,
  DocumentIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  CurrencyIcon,
  TrashIcon
} from './Icons';
import consultationService from '../services/consultationService';
import { SkeletonStatCard, SkeletonServiceCard, SkeletonGrid } from './SkeletonLoader';

export default function ConsultationServices() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [consultations, setConsultations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchConsultations();
    fetchCategories();
    fetchStats();
  }, []);

  // Fetch consultations from backend
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getAllConsultations();
      if (response.success) {
        setConsultations(response.data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await consultationService.getCategories();
      if (response.success) {
        setCategories(['All', ...response.data]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch statistics from backend
  const fetchStats = async () => {
    try {
      const response = await consultationService.getConsultationStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Delete consultation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const response = await consultationService.deleteConsultation(id);
      if (response.success) {
        fetchConsultations();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting consultation:', err);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (id) => {
    try {
      const response = await consultationService.toggleConsultationStatus(id);
      if (response.success) {
        fetchConsultations();
        fetchStats();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesCategory = selectedCategory === 'All' || consultation.category === selectedCategory;
    const matchesSearch = consultation.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         consultation.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-3">
            <div className="h-10 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-12 w-44 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
        </div>

        {/* Grid Skeleton */}
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Consultation Services</h1>
          <p className="text-base text-gray-500">Manage all treatments and services</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/consultations/categories')}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => navigate('/consultations/add')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Total Services</p>
          <p className="text-4xl font-bold text-gray-900">{stats.totalServices}</p>
          <p className="text-sm text-green-600 font-bold mt-2">+{stats.newThisMonth} this month</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Active</p>
          <p className="text-4xl font-bold text-green-600">{stats.activeServices}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Popular</p>
          <p className="text-4xl font-bold text-purple-600">{stats.featuredServices}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Total Bookings</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalBookings > 1000 ? `${(stats.totalBookings / 1000).toFixed(1)}K` : stats.totalBookings}</p>
        </div>
      </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-zennara-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-zennara-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-3 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search services by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
        />
      </div>

      {/* Services Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultations.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${!service.isActive ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {service.rating >= 4.5 && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                  )}
                  {service.isPopular && (
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  {service.isActive ? (
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      UNAVAILABLE
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-500 font-semibold">{service.category}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.summary}</p>

                <div className="flex items-center mb-4">
                  {service.rating !== null && service.rating !== undefined ? (
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-900">{service.rating}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not rated yet</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-zennara-green">₹{service.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={service.isActive ? () => navigate(`/consultations/edit/${service._id}`) : undefined}
                    disabled={!service.isActive}
                    className={`flex-1 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all ${service.isActive ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(service._id)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all ${service.isActive ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-gradient-to-r from-zennara-green to-emerald-600 hover:shadow-lg text-white !opacity-100 !grayscale-0'}`}
                  >
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredConsultations.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all ${!service.isActive ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex items-center space-x-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500 font-semibold">{service.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {service.rating >= 4.5 && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      )}
                      {service.isPopular && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {service.rating !== null && service.rating !== undefined ? (
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-gray-900">{service.rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not rated yet</span>
                      )}
                      <span className={`px-3 py-1 ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-bold rounded-full`}>
                        {service.isActive ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-3xl font-bold text-zennara-green">₹{service.price.toLocaleString('en-IN')}</p>
                      <button
                        onClick={service.isActive ? () => navigate(`/consultations/edit/${service._id}`) : undefined}
                        disabled={!service.isActive}
                        className={`px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all ${service.isActive ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(service._id)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${service.isActive ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-gradient-to-r from-zennara-green to-emerald-600 hover:shadow-lg text-white !opacity-100 !grayscale-0'}`}
                      >
                        {service.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
