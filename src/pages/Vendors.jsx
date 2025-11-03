import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, Package, X, 
  Building2, CreditCard, Star, Users, CheckCircle, XCircle, Loader
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { designTokens } from '../design-system/tokens';

const API_URL = `${API_BASE_URL}/api`;

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({ totalVendors: 0, activeVendors: 0, inactiveVendors: 0, totalProductsSupplied: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    gstNumber: '', panNumber: '', bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' },
    status: 'Active', rating: 0, notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchVendors(); fetchStats(); }, [statusFilter]);

  const resetForm = () => {
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
      gstNumber: '', panNumber: '', bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' },
      status: 'Active', rating: 0, notes: '' });
    setErrors({}); setSelectedVendor(null);
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const response = await axios.get(`${API_BASE_URL}/vendors?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setVendors(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/vendors/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setStats(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      if (selectedVendor) {
        await axios.put(`${API_BASE_URL}/vendors/${selectedVendor._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert('Vendor updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/vendors`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert('Vendor created successfully!');
      }
      await fetchVendors(); await fetchStats();
      setShowAddModal(false); setShowEditModal(false); resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setFormData({ ...vendor, bankDetails: vendor.bankDetails || { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' } });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/vendors/${selectedVendor._id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchVendors(); await fetchStats();
      setShowDeleteConfirm(false); setSelectedVendor(null);
      alert('Vendor deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${designTokens.gradients.backgrounds.neutral} p-8`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Vendors Management</h1>
          <p className="text-gray-600 text-lg">Manage your product suppliers and vendors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className={`group relative ${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <div className={`absolute top-6 right-6 w-16 h-16 ${designTokens.gradients.icons.purple} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
              <Users className="text-white" size={32} />
            </div>
            <p className="text-gray-600 text-sm font-medium uppercase">Total Vendors</p>
            <p className="text-5xl font-extrabold text-gray-900 my-2">{stats.totalVendors}</p>
            <p className="text-sm text-purple-600 font-medium">All registered</p>
          </div>

          <div className={`group relative ${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <div className={`absolute top-6 right-6 w-16 h-16 ${designTokens.gradients.icons.green} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
              <CheckCircle className="text-white" size={32} />
            </div>
            <p className="text-gray-600 text-sm font-medium uppercase">Active Vendors</p>
            <p className="text-5xl font-extrabold text-gray-900 my-2">{stats.activeVendors}</p>
            <p className="text-sm text-green-600 font-medium">Currently active</p>
          </div>

          <div className={`group relative ${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <div className={`absolute top-6 right-6 w-16 h-16 ${designTokens.gradients.icons.red} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
              <XCircle className="text-white" size={32} />
            </div>
            <p className="text-gray-600 text-sm font-medium uppercase">Inactive</p>
            <p className="text-5xl font-extrabold text-gray-900 my-2">{stats.inactiveVendors}</p>
            <p className="text-sm text-red-600 font-medium">Not active</p>
          </div>

          <div className={`group relative ${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <div className={`absolute top-6 right-6 w-16 h-16 ${designTokens.gradients.icons.blue} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
              <Package className="text-white" size={32} />
            </div>
            <p className="text-gray-600 text-sm font-medium uppercase">Products</p>
            <p className="text-5xl font-extrabold text-gray-900 my-2">{stats.totalProductsSupplied}</p>
            <p className="text-sm text-blue-600 font-medium">Total items</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className={`${designTokens.glass.light} rounded-3xl p-6 mb-8 shadow-xl`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search vendors by name, contact, or email..." value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/20 transition-all" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={20} /></button>}
            </div>
            <div className="flex gap-3">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/20 transition-all font-medium">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-zennara-green text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Plus size={20} />
                Add Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin mx-auto text-zennara-green mb-4" size={48} />
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className={`${designTokens.glass.medium} rounded-3xl p-12 shadow-xl text-center`}>
            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Vendors Found</h3>
            <p className="text-gray-600 mb-6">{searchQuery ? 'No vendors match your search.' : 'Get started by adding your first vendor.'}</p>
            {!searchQuery && (
              <button onClick={() => { resetForm(); setShowAddModal(true); }}
                className="inline-flex items-center gap-2 bg-zennara-green text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 hover:shadow-xl transition-all font-semibold">
                <Plus size={20} /> Add Your First Vendor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor._id} className={`group ${designTokens.glass.medium} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${designTokens.gradients.icons.purple} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {vendor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < vendor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${vendor.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    {vendor.status}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-semibold text-gray-900">{vendor.contactPerson}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.city || vendor.address}</p>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-4 ${designTokens.gradients.decorative.purpleBlue} rounded-2xl mb-4`}>
                  <div className="flex items-center gap-2">
                    <Package size={20} className="text-purple-600" />
                    <span className="text-sm font-medium">Products Supplied</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{vendor.productsSupplied || 0}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(vendor)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                    <Edit2 size={18} /> Edit
                  </button>
                  <button onClick={() => { setSelectedVendor(vendor); setShowDeleteConfirm(true); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-medium">
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className={`fixed inset-0 ${designTokens.glass.overlay} flex items-center justify-center z-50 p-4`}>
          <div className={`${designTokens.glass.card} rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden`}>
            {/* Modal Header - Fixed */}
            <div className="bg-zennara-green p-6 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">{selectedVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button onClick={() => { showAddModal ? setShowAddModal(false) : setShowEditModal(false); resetForm(); }}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className={`${designTokens.gradients.decorative.purpleBlue} rounded-2xl p-6`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Building2 className="text-purple-600" /> Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Vendor Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                        placeholder="Enter vendor name" />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Person *</label>
                      <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 transition-all ${errors.contactPerson ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                        placeholder="Contact person name" />
                      {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                        placeholder="vendor@example.com" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone *</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                        placeholder="+91 1234567890" />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <select value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all">
                        {[0,1,2,3,4,5].map(r => <option key={r} value={r}>{r} {r > 0 ? '⭐'.repeat(r) : '- Not Rated'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className={`${designTokens.gradients.decorative.greenTeal} rounded-2xl p-6`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="text-green-600" /> Address Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Address *</label>
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-200 transition-all ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                        placeholder="Street address" />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
                        placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
                        placeholder="State" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
                        placeholder="Pincode" />
                    </div>
                  </div>
                </div>

                {/* Tax & Banking */}
                <div className={`${designTokens.gradients.decorative.orangeYellow} rounded-2xl p-6`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="text-orange-600" /> Tax & Banking Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">GST Number</label>
                      <input type="text" value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="GST Number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">PAN Number</label>
                      <input type="text" value={formData.panNumber} onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="PAN Number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Name</label>
                      <input type="text" value={formData.bankDetails.bankName} 
                        onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, bankName: e.target.value}})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="Bank name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                      <input type="text" value={formData.bankDetails.accountHolderName}
                        onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="Account holder" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Number</label>
                      <input type="text" value={formData.bankDetails.accountNumber}
                        onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNumber: e.target.value}})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="Account number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">IFSC Code</label>
                      <input type="text" value={formData.bankDetails.ifscCode}
                        onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, ifscCode: e.target.value.toUpperCase()}})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                        placeholder="IFSC code" />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
                    placeholder="Any additional notes about this vendor..."></textarea>
                </div>
              </div>

              {/* Buttons - Sticky at bottom of form */}
              <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200 bg-white sticky bottom-0 pb-2">
                <button type="button" onClick={() => { showAddModal ? setShowAddModal(false) : setShowEditModal(false); resetForm(); }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-6 py-3 bg-zennara-green text-white rounded-xl hover:bg-emerald-700 hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <Loader className="animate-spin mx-auto" size={20} /> : selectedVendor ? 'Update Vendor' : 'Create Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={`fixed inset-0 ${designTokens.glass.overlay} flex items-center justify-center z-50 p-4`}>
          <div className={`${designTokens.glass.card} rounded-3xl shadow-2xl max-w-md w-full overflow-hidden`}>
            <div className="bg-red-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Delete Vendor</h2>
              <button onClick={() => { setShowDeleteConfirm(false); setSelectedVendor(null); }}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Are you absolutely sure?
              </h3>
              
              <p className="text-gray-600 text-center mb-4">
                You are about to delete <span className="font-semibold text-gray-900">{selectedVendor?.name}</span>. 
                This action cannot be undone.
              </p>

              {selectedVendor?.productsSupplied > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Package className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">Warning</p>
                      <p className="text-sm text-yellow-700">
                        This vendor has <span className="font-bold">{selectedVendor.productsSupplied} product(s)</span> associated. 
                        Please reassign or delete those products first.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowDeleteConfirm(false); setSelectedVendor(null); }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <Loader className="animate-spin mx-auto" size={20} /> : 'Delete Vendor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
