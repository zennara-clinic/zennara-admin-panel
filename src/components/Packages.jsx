import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  StarIcon,
  CheckCircleIcon,
  TrashIcon,
  PackageIcon
} from './Icons';
import packageService from '../services/packageService';

export default function Packages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    fetchPackages();
    fetchStats();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packageService.getAllPackages();
      if (response.success) {
        setPackages(response.data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await packageService.getPackageStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ show: true, id, name });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await packageService.deletePackage(deleteConfirm.id);
      if (response.success) {
        // Refresh packages and stats
        fetchPackages();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting package:', err);
    } finally {
      setDeleteConfirm({ show: false, id: null, name: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, id: null, name: '' });
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Premium Packages</h1>
          <p className="text-base text-gray-500">Bridal & Occasion Radiance Packages</p>
        </div>
        <button
          onClick={() => navigate('/consultations/packages/add')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Stats - Apple Inspired */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 font-semibold mb-2">Total Packages</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stats.totalPackages}</p>
            {stats.newThisMonth > 0 && (
              <p className="text-sm text-green-600 font-semibold">+{stats.newThisMonth} this month</p>
            )}
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 font-semibold mb-2">Active</p>
            <p className="text-4xl font-bold text-green-600">{stats.activePackages}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 font-semibold mb-2">Total Customers</p>
            <p className="text-4xl font-bold text-purple-600">{stats.totalCustomers || 0}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 font-semibold mb-2">Packages Sold</p>
            <p className="text-4xl font-bold text-blue-600">{stats.packagesSold || 0}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
        />
      </div>

      {/* Packages Grid - Apple Inspired */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading packages...</p>
          </div>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">No packages found</p>
          <button
            onClick={() => navigate('/consultations/packages/add')}
            className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create First Package</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Package Image */}
              <div className="relative h-80 overflow-hidden bg-gray-100">
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <PackageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {pkg.isPopular && (
                    <span className="px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <StarIcon className="w-3 h-3" />
                      <span>POPULAR</span>
                    </span>
                  )}
                  {!pkg.isActive && (
                    <span className="px-3 py-1.5 bg-gray-600 text-white rounded-full text-xs font-bold shadow-lg">
                      INACTIVE
                    </span>
                  )}
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1.5 bg-zennara-green text-white rounded-xl font-bold text-base shadow-lg">
                    ₹{pkg.price?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{pkg.description}</p>
                </div>

                {/* Benefits */}
                {pkg.benefits && pkg.benefits.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Package Benefits:</h4>
                    <ul className="space-y-1.5">
                      {pkg.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-zennara-green flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                      {pkg.benefits.length > 2 && (
                        <li className="text-xs text-zennara-green font-semibold ml-6">
                          +{pkg.benefits.length - 2} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Services Info */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Services</p>
                    <p className="text-xl font-bold text-gray-900">{pkg.services?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Bookings</p>
                    <p className="text-xl font-bold text-blue-600">{pkg.bookingsCount || 0}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/consultations/packages/edit/${pkg.id}`)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                  >
                    Edit Package
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(pkg.id, pkg.name)}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all"
                    title="Delete Package"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Package?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold">"{deleteConfirm.name}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
