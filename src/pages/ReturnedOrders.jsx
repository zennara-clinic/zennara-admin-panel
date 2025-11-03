import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { designTokens } from '../design-system/tokens';

export default function ReturnedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchReturnedOrders();
  }, []);

  const fetchReturnedOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter only returned orders
        const returnedOrders = response.data.data.filter(order => order.orderStatus === 'Returned');
        setOrders(returnedOrders);
      }
    } catch (err) {
      console.error('Error fetching returned orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch returned orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleApproveReturn = async (order) => {
    if (!window.confirm(`Approve return request for order #${order.orderNumber}? This will initiate the pickup process.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/product-orders/${order._id}/approve-return`, 
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        alert('Return approved! Pickup will be scheduled. Refund will be processed after quality check.');
        fetchReturnedOrders();
      } else {
        alert(response.data.message || 'Failed to approve return');
      }
    } catch (err) {
      console.error('Error approving return:', err);
      alert(err.response?.data?.message || 'Failed to approve return');
    }
  };

  const handleRejectReturn = async (order) => {
    const reason = window.prompt('Enter reason for rejecting this return request:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/product-orders/${order._id}/reject-return`, 
        { reason }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        alert('Return request rejected. Customer will be notified.');
        fetchReturnedOrders();
      } else {
        alert(response.data.message || 'Failed to reject return');
      }
    } catch (err) {
      console.error('Error rejecting return:', err);
      alert(err.response?.data?.message || 'Failed to reject return');
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

  if (loading) {
    return (
      <div className={`min-h-screen ${designTokens.gradients.backgrounds.warm} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className={`absolute inset-0 rounded-full ${designTokens.gradients.statCards.orange} blur-xl`}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading returned orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${designTokens.gradients.backgrounds.warm} p-8`}>
        <div className={`max-w-md mx-auto ${designTokens.glass.medium} rounded-2xl p-8 shadow-lg`}>
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-orange-800 text-center font-medium mb-4">{error}</p>
          <button 
            onClick={fetchReturnedOrders}
            className={`w-full px-4 py-3 ${designTokens.gradients.components.amber} text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${designTokens.gradients.backgrounds.warm} p-8`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Returned Orders</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">View and manage return requests</p>
          </div>
          <button
            onClick={fetchReturnedOrders}
            className={`px-5 py-2.5 ${designTokens.glass.medium} rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-orange-50 to-amber-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-orange-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 relative z-10">Total Returns</p>
          <p className="text-4xl font-bold text-orange-900 relative z-10">{orders.length}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full relative z-10"></div>
        </div>

        <div className={`group ${designTokens.glass.medium} rounded-2xl shadow-sm p-6 hover:shadow-xl hover:scale-105 transition-all duration-300`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">This Month</p>
          <p className="text-4xl font-bold text-gray-900">
            {orders.filter(o => {
              const orderDate = new Date(o.returnedAt || o.updatedAt);
              const now = new Date();
              return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>

        <div className="group bg-gradient-to-br from-green-50 to-emerald-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-green-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Approved</p>
          <p className="text-4xl font-bold text-green-900">
            {orders.filter(o => o.returnApproved).length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"></div>
        </div>

        <div className="group bg-gradient-to-br from-red-50 to-pink-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-red-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">Rejected</p>
          <p className="text-4xl font-bold text-red-900">
            {orders.filter(o => o.returnRejected).length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-red-400 to-pink-300 rounded-full"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`${designTokens.glass.light} rounded-2xl shadow-lg p-6 mb-6`}>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm font-medium placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className={`${designTokens.glass.medium} rounded-2xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Returned Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">No returned orders found</p>
                      <p className="text-sm text-gray-500">Return requests will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/30 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">#{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.userId?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{order.pricing?.total?.toLocaleString('en-IN') || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.returnedAt || order.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {order.returnReason || 'No reason provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        
                        {/* Show status badge if approved or rejected */}
                        {order.returnApproved ? (
                          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-lg border border-green-200">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Approved
                          </span>
                        ) : order.returnRejected ? (
                          <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-lg border border-red-200">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rejected
                          </span>
                        ) : (
                          <>
                            {/* Show action buttons if not yet processed */}
                            <button
                              onClick={() => handleApproveReturn(order)}
                              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectReturn(order)}
                              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
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
            Showing <span className="font-semibold text-orange-600">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> returned orders
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className={`fixed inset-0 ${designTokens.glass.overlay} flex items-center justify-center z-50 p-4`}>
          <div className={`${designTokens.glass.card} rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Return Details</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.userId?.fullName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.userId?.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.userId?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.subtotal?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Info */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <h3 className="font-semibold text-orange-900 mb-3">Return Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Returned On:</span> {new Date(selectedOrder.returnedAt || selectedOrder.updatedAt).toLocaleString('en-IN')}</p>
                  <p><span className="font-medium">Reason:</span> {selectedOrder.returnReason || 'No reason provided'}</p>
                  <p><span className="font-medium">Delivered On:</span> {selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Amount Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{selectedOrder.pricing?.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.pricing?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-₹{selectedOrder.pricing.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedOrder.pricing?.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-medium">₹{selectedOrder.pricing.deliveryFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-base">
                    <span>Total:</span>
                    <span>₹{selectedOrder.pricing?.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/orders/${selectedOrder._id}`}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-center"
                >
                  View Full Order
                </Link>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
