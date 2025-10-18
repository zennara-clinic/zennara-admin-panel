import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  X as XIcon,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  TrendingUp
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export default function InventoryManagement() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [batchTypeFilter, setBatchTypeFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    batchable: 0,
    nonBatchable: 0,
    lowStock: 0,
    expired: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchInventory();
  }, [categoryFilter, searchQuery, batchTypeFilter, stockFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (categoryFilter !== 'All') {
        params.append('category', categoryFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (batchTypeFilter !== 'All') {
        params.append('batchType', batchTypeFilter);
      }
      if (stockFilter !== 'all') {
        params.append('stockFilter', stockFilter);
      }

      const response = await axios.get(`${API_URL}/admin/inventory?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInventory(response.data.data);
      setStats(response.data.stats);

    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inventoryId) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/admin/inventory/${inventoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      alert('Failed to delete inventory item');
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const handleExport = () => {
    try {
      // Prepare CSV data
      const headers = [
        'Inventory Name', 'Category', 'Formulation', 'Organization', 'Code',
        'Batch No', 'Expiry Date', 'Stock', 'Buying Price', 'Selling Price',
        'GST %', 'Vendor', 'Batch Type', 'Status'
      ];

      const csvData = inventory.map(item => [
        item.inventoryName || '',
        item.inventoryCategory || '',
        item.formulation || '',
        item.orgName || '',
        item.code || '',
        item.batchNo || '',
        item.batchExpiryDate ? new Date(item.batchExpiryDate).toLocaleDateString() : '',
        item.qohAllBatches || 0,
        item.inventoryBuyingPrice || 0,
        item.inventorySellingPrice || 0,
        item.gstPercentage || 0,
        item.vendorName || '',
        item.batchMaintenance || '',
        getStockStatus(item.qohAllBatches).label
      ]);

      // Create CSV string
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting inventory:', error);
      alert('Failed to export inventory');
    }
  };

  if (loading && !inventory.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-semibold">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-gray-600 font-medium">Track and manage your inventory batches</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/inventory/add')}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <Plus className="w-3 h-3" />
            </div>
            <span>Add Inventory Item</span>
          </button>

          <button
            onClick={handleExport}
            className="group flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-xl border border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {/* Total Items */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Items</p>
              <p className="text-4xl font-black text-gray-900 mb-1">{stats.total}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>All inventory</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Batchable */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Batchable</p>
              <p className="text-4xl font-black text-blue-600 mb-1">{stats.batchable}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>With batches</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Non Batchable */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Non Batchable</p>
              <p className="text-4xl font-black text-indigo-600 mb-1">{stats.nonBatchable}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Standard items</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Low Stock</p>
              <p className="text-4xl font-black text-amber-600 mb-1">{stats.lowStock}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Need reorder</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Expired */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Expired</p>
              <p className="text-4xl font-black text-red-600 mb-1">{stats.expired}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Action needed</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Value</p>
              <p className="text-4xl font-black text-emerald-600 mb-1">
                ₹{stats.totalValue >= 1000 ? `${(stats.totalValue / 1000).toFixed(1)}k` : stats.totalValue?.toFixed(2) || '0.00'}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Inventory worth</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 mb-6">
        {/* Search Bar */}
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by inventory name, batch no, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-5 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
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
        </div>

        {/* Category Filter */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Filter by Category</h3>
            {categoryFilter !== 'All' && (
              <button
                onClick={() => setCategoryFilter('All')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {['All', 'Retail products', 'Consumables'].map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  categoryFilter === category
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Type Filter */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Batch Maintenance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['All', 'Batchable', 'Non Batchable'].map((type) => (
              <button
                key={type}
                onClick={() => setBatchTypeFilter(type)}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                  batchTypeFilter === type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {inventory.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-16 text-center shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Package className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No inventory found</h3>
          <p className="text-base text-gray-600 mb-8 max-w-md mx-auto font-medium">Start managing your inventory by adding your first item</p>
          <button
            onClick={() => navigate('/inventory/add')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <Plus className="w-3 h-3" />
            </div>
            <span>Add Inventory Item</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Batch Info
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventory.map((item) => {
                  const stockStatus = getStockStatus(item.qohAllBatches);
                  const expiringSoon = isExpiringSoon(item.batchExpiryDate);
                  const expired = isExpired(item.batchExpiryDate);

                  return (
                    <tr 
                      key={item._id}
                      className="group hover:bg-blue-50/50 transition-all duration-200"
                    >
                      {/* Item Details */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="font-bold text-gray-900 text-sm">
                            {item.inventoryName}
                          </div>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                              {item.inventoryCategory}
                            </span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg">
                              {item.formulation}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold">Org:</span> {item.orgName}
                          </div>
                        </div>
                      </td>

                      {/* Batch Info */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {item.batchMaintenance === 'Batchable' ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Batchable
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">
                                Non Batchable
                              </span>
                            )}
                          </div>
                          {item.batchNo && (
                            <div className="text-xs">
                              <span className="text-gray-500">Batch:</span>
                              <span className="ml-1 font-semibold text-gray-900">{item.batchNo}</span>
                            </div>
                          )}
                          {item.batchExpiryDate && (
                            <div className="flex items-center gap-1">
                              {expired ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Expired
                                </span>
                              ) : expiringSoon ? (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Expiring Soon
                                </span>
                              ) : (
                                <span className="text-xs text-gray-600">
                                  Exp: {new Date(item.batchExpiryDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-xs">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">
                              {item.batchType}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-bold text-xs ${stockStatus.color}`}>
                            {item.qohAllBatches === 0 ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : item.qohAllBatches < 10 ? (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {item.qohAllBatches} units
                          </div>
                          {item.reOrderLevel > 0 && (
                            <div className="text-xs text-gray-500">
                              Reorder at: <span className="font-semibold">{item.reOrderLevel}</span>
                            </div>
                          )}
                          {item.targetLevel > 0 && (
                            <div className="text-xs text-gray-500">
                              Target: <span className="font-semibold">{item.targetLevel}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="text-xs">
                            <span className="text-gray-500">Buying:</span>
                            <span className="ml-1 font-bold text-gray-900">₹{item.inventoryBuyingPrice}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Selling:</span>
                            <span className="ml-1 font-bold text-emerald-600">₹{item.inventoryAfterTaxSellingPrice}</span>
                          </div>
                          <div className="text-xs">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                              {item.inventoryTax}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.vendorName}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/inventory/edit/${item._id}`)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
