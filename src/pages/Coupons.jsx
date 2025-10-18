import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, TrendingUp, AlertCircle, Copy, Check, Calendar, Percent, DollarSign } from 'lucide-react';
import api from '../config/api';
import CouponModal from '../components/CouponModal';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: null,
    usageLimit: null,
    perUserLimit: null,
    validFrom: '',
    validUntil: '',
    applicableProducts: [],
    isActive: true,
    isPublic: true
  });

  useEffect(() => {
    fetchCoupons();
    fetchStatistics();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, filterStatus, filterType]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/coupons');
      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admin/coupons/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(coupon => {
        if (filterStatus === 'active') {
          return coupon.isActive && new Date(coupon.validFrom) <= now && new Date(coupon.validUntil) >= now;
        } else if (filterStatus === 'expired') {
          return new Date(coupon.validUntil) < now;
        } else if (filterStatus === 'upcoming') {
          return new Date(coupon.validFrom) > now;
        } else if (filterStatus === 'inactive') {
          return !coupon.isActive;
        }
        return true;
      });
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(coupon => coupon.discountType === filterType);
    }

    setFilteredCoupons(filtered);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCoupon) {
        const response = await api.put(`/admin/coupons/${editingCoupon._id}`, formData);
        if (response.data.success) {
          alert('Coupon updated successfully');
          fetchCoupons();
          fetchStatistics();
          closeModal();
        }
      } else {
        const response = await api.post('/admin/coupons', formData);
        if (response.data.success) {
          alert('Coupon created successfully');
          fetchCoupons();
          fetchStatistics();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      applicableProducts: coupon.applicableProducts.map(p => p._id || p),
      isActive: coupon.isActive,
      isPublic: coupon.isPublic
    });
    setShowModal(true);
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        const response = await api.delete(`/admin/coupons/${id}`);
        if (response.data.success) {
          alert('Coupon deleted successfully');
          fetchCoupons();
          fetchStatistics();
        }
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert(error.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: null,
      usageLimit: null,
      perUserLimit: null,
      validFrom: '',
      validUntil: '',
      applicableProducts: [],
      isActive: true,
      isPublic: true
    });
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return { label: 'Inactive', color: 'gray' };
    if (validUntil < now) return { label: 'Expired', color: 'red' };
    if (validFrom > now) return { label: 'Upcoming', color: 'blue' };
    return { label: 'Active', color: 'green' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/20 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Coupon Management
            </h1>
            <p className="text-gray-600 font-medium">Create and manage discount coupons</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Coupons</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{statistics.total}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>All discount codes</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Tag className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Active Coupons</p>
                <p className="text-4xl font-black text-emerald-600 mb-1">{statistics.active}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Currently valid</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Expired</p>
                <p className="text-4xl font-black text-red-600 mb-1">{statistics.expired}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>No longer valid</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Upcoming</p>
                <p className="text-4xl font-black text-blue-600 mb-1">{statistics.upcoming}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Starting soon</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-12 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-12 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <Plus className="w-3 h-3" />
              </div>
              <span>Add New Coupon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Code</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Discount</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Validity</th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Usage</th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Tag className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 mb-1">No coupons found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <tr key={coupon._id} className="hover:bg-white/50 transition-all duration-200 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                            <Tag className="w-7 h-7 text-orange-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-gray-900 text-lg">{coupon.code}</p>
                              <button
                                onClick={() => copyCode(coupon.code)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                                title="Copy code"
                              >
                                {copiedCode === coupon.code ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 font-medium max-w-xs">
                              {coupon.description || <span className="italic">No description</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {coupon.discountType === 'percentage' ? (
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-xl font-bold">
                              <Percent className="w-4 h-4" />
                              <span>{coupon.discountValue}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl font-bold">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{coupon.discountValue}</span>
                            </div>
                          )}
                        </div>
                        {coupon.minOrderValue > 0 && (
                          <p className="text-xs text-gray-500 mt-2 font-medium">Min order: ₹{coupon.minOrderValue}</p>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm">
                          <p className="font-bold text-gray-900 mb-1">{new Date(coupon.validFrom).toLocaleDateString()}</p>
                          <p className="text-gray-500 font-medium">to {new Date(coupon.validUntil).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex flex-col items-center gap-2">
                          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold">
                            {coupon.usageCount} / {coupon.usageLimit || '∞'}
                          </div>
                          {coupon.applicableProducts.length > 0 && (
                            <p className="text-xs text-gray-500 font-medium">{coupon.applicableProducts.length} products</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold shadow-sm ${
                          status.color === 'green' ? 'bg-emerald-50 text-emerald-700' :
                          status.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                          status.color === 'red' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            status.color === 'green' ? 'bg-emerald-500 animate-pulse' :
                            status.color === 'blue' ? 'bg-blue-500' :
                            status.color === 'red' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}></div>
                          <span>{status.label}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id, coupon.code)}
                            className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <CouponModal
        showModal={showModal}
        editingCoupon={editingCoupon}
        formData={formData}
        setFormData={setFormData}
        products={products}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        generateCode={generateCode}
      />
    </div>
  );
};

export default Coupons;
