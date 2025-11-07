import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Order Placed': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500' },
  };

  const config = statusConfig[status] || statusConfig['Order Placed'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
      {status}
    </span>
  );
};

// Payment badge
const PaymentBadge = ({ status }) => {
  const statusConfig = {
    'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏳' },
    'Paid': { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  };

  const config = statusConfig[status] || statusConfig['Pending'];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      {status}
    </span>
  );
};

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders?status=Order%20Placed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessOrder = async (orderId) => {
    try {
      setProcessingOrder(orderId);
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/product-orders/${orderId}/status`,
        { status: 'Confirmed', note: 'Order confirmed by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remove the order from the list since it's no longer pending
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (err) {
      console.error('Error processing order:', err);
      setError(err.response?.data?.message || 'Failed to process order');
    } finally {
      setProcessingOrder(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    totalValue: orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0) / orders.length : 0,
    todayOrders: orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length,
  };
  
  // Note: Pending orders show potential value, not confirmed revenue

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 blur-xl"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading pending orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-8">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-800 text-center font-medium mb-4">{error}</p>
          <button 
            onClick={fetchPendingOrders}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-8">
      {/* Header - Apple Style */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">New Orders</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">Orders placed by customers awaiting confirmation</p>
          </div>
          <button
            onClick={fetchPendingOrders}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Apple Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-amber-50 to-yellow-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-amber-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -mr-12 -mt-12"></div>
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2 relative z-10">New Orders</p>
          <p className="text-4xl font-semibold text-amber-900 relative z-10">{stats.total}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full relative z-10"></div>
        </div>

        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Today's Orders</p>
          <p className="text-4xl font-semibold text-gray-900">{stats.todayOrders}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>

        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Avg Order Value</p>
          <p className="text-4xl font-semibold text-gray-900">₹{Math.round(stats.avgOrderValue).toLocaleString('en-IN')}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-300 rounded-full"></div>
        </div>

        <div className="group bg-gradient-to-br from-zennara-green via-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <p className="text-xs font-medium text-white/90 uppercase tracking-wider mb-2 relative z-10">Total Value</p>
          <p className="text-4xl font-semibold relative z-10">₹{stats.totalValue.toLocaleString('en-IN')}</p>
          <div className="mt-4 h-1 w-16 bg-white/40 rounded-full relative z-10"></div>
        </div>
      </div>

      {/* Search Bar - Apple Style */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 focus:bg-white transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Orders Table - Apple Style */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">No new orders</p>
                      <p className="text-sm text-gray-500">All orders have been confirmed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    onMouseEnter={() => setHoveredRow(order._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-all duration-200 cursor-pointer ${
                      hoveredRow === order._id 
                        ? 'bg-gradient-to-r from-amber-50/50 to-yellow-50/30 shadow-sm' 
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.items?.length || 0} item(s)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.userId?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{order.userId?.email || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600 mb-1">
                            • {item.productName} <span className="text-gray-400">(x{item.quantity})</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="text-xs text-amber-600 font-medium">+{order.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{order.pricing?.total?.toLocaleString('en-IN') || 0}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
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
                      <div>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleProcessOrder(order._id)}
                          disabled={processingOrder === order._id}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {processingOrder === order._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Process</span>
                            </>
                          )}
                        </button>
                      </div>
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
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-amber-600">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> new orders
          </p>
        </div>
      )}
    </div>
  );
}
