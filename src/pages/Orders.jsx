import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    'Confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    'Processing': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    'Packed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    'Shipped': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
    'Out for Delivery': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
    'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    'Returned': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  };

  const config = statusConfig[status] || statusConfig['Pending'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

// Payment status badge
const PaymentBadge = ({ status }) => {
  const statusConfig = {
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'Paid': { bg: 'bg-green-100', text: 'text-green-800' },
    'Failed': { bg: 'bg-red-100', text: 'text-red-800' },
    'Refunded': { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const config = statusConfig[status] || statusConfig['Pending'];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter out pending orders - they are managed in the Pending Orders page
        const nonPendingOrders = response.data.data.filter(order => order.orderStatus !== 'Pending');
        setOrders(nonPendingOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleExportOrders = async () => {
    try {
      setExporting(true);
      const ordersToExport = selectedOrders.length > 0 
        ? filteredOrders.filter(o => selectedOrders.includes(o._id))
        : filteredOrders;

      // Create CSV content
      const headers = ['Order Number', 'Customer', 'Email', 'Items', 'Amount', 'Payment Status', 'Order Status', 'Date'];
      const csvContent = [
        headers.join(','),
        ...ordersToExport.map(order => [
          order.orderNumber,
          order.userId?.fullName || 'N/A',
          order.userId?.email || 'N/A',
          order.items?.length || 0,
          order.pricing?.total || 0,
          order.paymentStatus,
          order.orderStatus,
          new Date(order.createdAt).toLocaleDateString('en-IN')
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export orders');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      setDeleting(true);
      const token = localStorage.getItem('adminToken');
      
      await Promise.all(
        selectedOrders.map(orderId =>
          axios.delete(`${API_BASE_URL}/api/admin/product-orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      setOrders(orders.filter(o => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete orders');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o._id));
    }
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate comprehensive stats (excluding pending orders)
  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.orderStatus === 'Confirmed').length,
    processing: orders.filter(o => o.orderStatus === 'Processing').length,
    packed: orders.filter(o => o.orderStatus === 'Packed').length,
    shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
    outForDelivery: orders.filter(o => o.orderStatus === 'Out for Delivery').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
    returned: orders.filter(o => o.orderStatus === 'Returned').length,
    totalRevenue: orders
      .filter(o => o.orderStatus === 'Delivered')
      .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8">
      {/* Header - Apple Style */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Orders</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">Manage and track all product orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Stats Cards - Apple Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Orders */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400/10 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 relative z-10">{stats.total}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full relative z-10"></div>
        </div>

        {/* Confirmed */}
        <div className="group bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-blue-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 relative z-10">Confirmed</p>
          <p className="text-3xl font-bold text-blue-900 relative z-10">{stats.confirmed}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-blue-400 to-indigo-300 rounded-full relative z-10"></div>
        </div>

        {/* Processing */}
        <div className="group bg-gradient-to-br from-purple-50 to-violet-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-purple-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2 relative z-10">Processing</p>
          <p className="text-3xl font-bold text-purple-900 relative z-10">{stats.processing}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full relative z-10"></div>
        </div>

        {/* Packed */}
        <div className="group bg-gradient-to-br from-indigo-50 to-blue-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2 relative z-10">Packed</p>
          <p className="text-3xl font-bold text-indigo-900 relative z-10">{stats.packed}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-indigo-400 to-blue-300 rounded-full relative z-10"></div>
        </div>

        {/* Shipped */}
        <div className="group bg-gradient-to-br from-cyan-50 to-teal-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-cyan-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-2 relative z-10">Shipped</p>
          <p className="text-3xl font-bold text-cyan-900 relative z-10">{stats.shipped}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full relative z-10"></div>
        </div>

        {/* Out for Delivery */}
        <div className="group bg-gradient-to-br from-teal-50 to-emerald-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-teal-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2 relative z-10">Out for Delivery</p>
          <p className="text-3xl font-bold text-teal-900 relative z-10">{stats.outForDelivery}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full relative z-10"></div>
        </div>

        {/* Delivered */}
        <div className="group bg-gradient-to-br from-emerald-50 to-green-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-emerald-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 relative z-10">Delivered</p>
          <p className="text-3xl font-bold text-emerald-900 relative z-10">{stats.delivered}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full relative z-10"></div>
        </div>

        {/* Cancelled */}
        <div className="group bg-gradient-to-br from-red-50 to-rose-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-red-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2 relative z-10">Cancelled</p>
          <p className="text-3xl font-bold text-red-900 relative z-10">{stats.cancelled}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-red-400 to-rose-300 rounded-full relative z-10"></div>
        </div>

        {/* Returned */}
        <div className="group bg-gradient-to-br from-orange-50 to-amber-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-orange-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 relative z-10">Returned</p>
          <p className="text-3xl font-bold text-orange-900 relative z-10">{stats.returned}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full relative z-10"></div>
        </div>

        {/* Total Revenue */}
        <div className="group bg-gradient-to-br from-zennara-green via-emerald-500 to-teal-600 rounded-2xl shadow-lg p-5 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2 relative z-10">Total Revenue</p>
          <p className="text-3xl font-bold relative z-10">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
          <div className="mt-3 h-1 w-12 bg-white/40 rounded-full relative z-10"></div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportOrders}
              disabled={exporting}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export {selectedOrders.length > 0 ? `(${selectedOrders.length})` : 'All'}
                </>
              )}
            </button>

            {selectedOrders.length > 0 && (
              <button
                onClick={handleDeleteOrders}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete ({selectedOrders.length})
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendNotifications}
                onChange={(e) => setSendNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Send Notifications on Status Update</span>
            </label>
          </div>
        </div>
      </div>

      {/* Enhanced Filters - Apple Style */}
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Search */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Orders
            </label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by order #, customer name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium placeholder:text-gray-400 shadow-sm hover:shadow-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Search across all order fields
            </p>
          </div>

          {/* Enhanced Order Status Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm font-medium cursor-pointer appearance-none shadow-sm hover:shadow-md"
                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238b5cf6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Enhanced Payment Status Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Status
            </label>
            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-sm font-medium cursor-pointer appearance-none shadow-sm hover:shadow-md"
                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}
              >
                <option value="all">All Payments</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-600">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="hover:bg-purple-200 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {paymentFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Payment: {paymentFilter}
                <button onClick={() => setPaymentFilter('all')} className="hover:bg-green-200 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="ml-auto text-xs font-medium text-gray-600 hover:text-gray-900 underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Orders Table - Apple Style */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    onMouseEnter={() => setHoveredRow(order._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-all duration-200 ${
                      hoveredRow === order._id 
                        ? 'bg-gradient-to-r from-zennara-green/5 to-emerald-50/50 shadow-sm' 
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelectOrder(order._id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">{order.items?.length || 0} item(s)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.userId?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.email || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            {item.productName} (x{item.quantity})
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="text-xs text-gray-400">+{order.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{order.pricing?.total?.toLocaleString('en-IN') || 0}</div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod || 'COD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-zennara-green to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <span>View</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
