import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, CheckCircle, XCircle, AlertTriangle, X as XIcon, IndianRupee, Search, Edit2, Eye, EyeOff, Trash2, Plus, ChevronDown, Check, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormulation, setSelectedFormulation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAllFormulations, setShowAllFormulations] = useState(false);
  const [formulations, setFormulations] = useState(['All']);
  const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, low-stock, out-of-stock
  const [showFormulationDropdown, setShowFormulationDropdown] = useState(false);
  const [formulationSearch, setFormulationSearch] = useState('');
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchProducts();
    fetchFormulations();
  }, [selectedFormulation, searchQuery, showInactive, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (selectedFormulation !== 'All') {
        params.append('formulation', selectedFormulation);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (!showInactive) {
        params.append('isActive', 'true');
      }

      const response = await axios.get(`${API_URL}/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(response.data.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormulations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/products/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data.byFormulation) {
        // Get unique formulations from the stats and sort them
        const uniqueFormulations = Object.keys(response.data.data.byFormulation).sort();
        setFormulations(['All', ...uniqueFormulations]);
      }
    } catch (error) {
      console.error('Error fetching formulations:', error);
      // Fallback to default formulations from Product model enum
      setFormulations([
        'All',
        'Serum',
        'Hydrafacial Consumable',
        'Cream',
        'Facial Treatment',
        'Face Wash',
        'Lipbalm',
        'Sunscreen Stick',
        'Sunscreen',
        'Moisturizer',
        'Sachets',
        'Anti Aging',
        'Pigmentation',
        'Injection',
        'Shampoo'
      ]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFormulationDropdown(false);
        setFormulationSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleStatus = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_URL}/admin/products/${productId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  // Filter products by stock status
  const filteredProducts = products.filter(product => {
    if (stockFilter === 'all') return true;
    if (stockFilter === 'in-stock') return product.stock >= 10;
    if (stockFilter === 'low-stock') return product.stock > 0 && product.stock < 10;
    if (stockFilter === 'out-of-stock') return product.stock === 0;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFormulation, searchQuery, showInactive, stockFilter]);

  if (loading && !products.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 p-4 md:p-8">
      {/* Header */}
      <div className="relative mb-8 bg-gradient-to-r from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-900 bg-clip-text text-transparent mb-1">
                Products
              </h1>
              <p className="text-gray-600 font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Manage your product catalog
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/products/add')}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative w-6 h-6 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 group-hover:rotate-90 transition-all duration-300">
              <Plus className="w-4 h-4" />
            </div>
            <span className="relative">Add New Product</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Products */}
          <div className="group relative bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/5 to-gray-600/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Total Products</p>
                <p className="text-5xl font-black bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{stats.total}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>All items</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-500 to-gray-600 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-emerald-100 hover:shadow-2xl hover:scale-105 hover:border-emerald-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-emerald-600/20 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600/70 mb-3 uppercase tracking-wider">Active Products</p>
                <p className="text-5xl font-black bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2">{stats.active}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                  <span>Available now</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="group relative bg-gradient-to-br from-gray-50 via-white to-gray-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 hover:border-gray-300 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/5 to-gray-500/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Inactive</p>
                <p className="text-5xl font-black bg-gradient-to-br from-gray-600 to-gray-500 bg-clip-text text-transparent mb-2">{stats.inactive}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Hidden items</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-400 to-gray-500 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl hover:scale-105 hover:border-amber-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-amber-600/20 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-600/70 mb-3 uppercase tracking-wider">Low Stock</p>
                <p className="text-5xl font-black bg-gradient-to-br from-amber-600 to-amber-500 bg-clip-text text-transparent mb-2">{stats.lowStock}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
                  <span>Need attention</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="group relative bg-gradient-to-br from-red-50 via-white to-red-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-red-100 hover:shadow-2xl hover:scale-105 hover:border-red-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-red-600/20 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600/70 mb-3 uppercase tracking-wider">Out of Stock</p>
                <p className="text-5xl font-black bg-gradient-to-br from-red-600 to-red-500 bg-clip-text text-transparent mb-2">{stats.outOfStock}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Not available</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl hover:scale-105 hover:border-blue-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-blue-600/20 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600/70 mb-3 uppercase tracking-wider">Total Value</p>
                <p className="text-5xl font-black bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">₹{(stats.totalValue / 10000000).toFixed(1)}Cr</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Inventory value</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <IndianRupee className="w-9 h-9 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 mb-6">
        {/* Search Bar and Category Filter in Single Row */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-5 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <XIcon className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div className="w-80 relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFormulationDropdown(!showFormulationDropdown)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl text-left font-semibold text-sm text-gray-900 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 flex items-center justify-between shadow-sm"
            >
              <span className="flex items-center gap-2">
                {selectedFormulation === 'All' ? (
                  <span className="text-gray-500">Select Category...</span>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {selectedFormulation}
                  </>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showFormulationDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showFormulationDropdown && (
              <div className="absolute z-[9999] w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={formulationSearch}
                      onChange={(e) => setFormulationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-64 overflow-y-auto">
                  {formulations
                    .filter(formulation => 
                      formulation.toLowerCase().includes(formulationSearch.toLowerCase())
                    )
                    .map((formulation) => (
                      <button
                        key={formulation}
                        onClick={() => {
                          setSelectedFormulation(formulation);
                          setShowFormulationDropdown(false);
                          setFormulationSearch('');
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between ${
                          selectedFormulation === formulation
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {selectedFormulation === formulation && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className={selectedFormulation === formulation ? '' : 'ml-7'}>
                            {formulation}
                          </span>
                        </span>
                        {selectedFormulation === formulation && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  
                  {/* No Results */}
                  {formulations.filter(f => f.toLowerCase().includes(formulationSearch.toLowerCase())).length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No categories found</p>
                      <p className="text-xs text-gray-500">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Stock Status Filters */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Filter by Stock Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  stockFilter === 'all'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Products
              </button>
              <button
                onClick={() => setStockFilter('in-stock')}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  stockFilter === 'in-stock'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                In Stock
              </button>
              <button
                onClick={() => setStockFilter('low-stock')}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  stockFilter === 'low-stock'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Low Stock
              </button>
              <button
                onClick={() => setStockFilter('out-of-stock')}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  stockFilter === 'out-of-stock'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Out of Stock
              </button>
            </div>
          </div>

        {/* Show Inactive Toggle */}
        <div className="p-4 bg-gray-50/50 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-md"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Show Inactive Products</p>
                <p className="text-xs text-gray-500 font-medium">Include inactive items in the list</p>
              </div>
            </div>
            <div className="text-xs font-bold text-gray-500">
              {showInactive ? 'On' : 'Off'}
            </div>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-16 text-center shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Package className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
          <p className="text-base text-gray-600 mb-8 max-w-md mx-auto font-medium">Get started by adding your first product to your catalog</p>
          <button
            onClick={() => navigate('/products/add')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <Plus className="w-3 h-3" />
            </div>
            <span>Add New Product</span>
          </button>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-3xl border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-900/10 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={product.image || 'https://res.cloudinary.com/dimlozhrx/image/upload/v1761587818/Upload_Product_Image_f3jvxi.png'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Inactive Overlay */}
                    {!product.isActive && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </div>
                          <span className="px-4 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-full shadow-lg">
                            Inactive
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {product.stock === 0 ? (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/50 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Out of Stock
                        </div>
                      ) : product.stock < 10 ? (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/50 flex items-center gap-1.5 animate-pulse">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Low Stock ({product.stock})
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/50 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          In Stock
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                        {product.OrgName}
                      </span>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg">
                        {product.formulation}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-4 leading-tight min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-extrabold text-gray-900">₹{product.price}</span>
                        <span className="text-xs text-gray-400 font-semibold">+{product.gstPercentage}% GST</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-xs text-gray-500">Stock: <span className="font-bold text-gray-900">{product.stock}</span></span>
                        </div>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 px-2.5 py-1 rounded-lg">
                            <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="text-xs text-amber-700 font-bold">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="mb-3">
                      <a
                        href={`/products/edit/${product._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Edit in New Tab
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-xs font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product._id)}
                        className={`px-4 py-3 text-xs font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                          product.isActive
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Show
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              {/* Showing info */}
              <div className="text-sm text-gray-600 font-semibold">
                Showing <span className="text-gray-900">{startIndex + 1}</span> to{' '}
                <span className="text-gray-900">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                <span className="text-gray-900">{filteredProducts.length}</span> products
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-110'
                              : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm hover:shadow-md'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-400 font-bold">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
      </div>
  );
}
