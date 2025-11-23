import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function CancelledOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundProcessing, setRefundProcessing] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [showCompleteRefundModal, setShowCompleteRefundModal] = useState(false);
  const [completeRefundForm, setCompleteRefundForm] = useState({
    transactionId: '',
    transactionProof: '',
    notes: ''
  });
  const [completeRefundProcessing, setCompleteRefundProcessing] = useState(false);
  const [refundForm, setRefundForm] = useState({
    refundMethod: '',
    transactionId: '',
    notes: '',
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    }
  });

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter only cancelled orders
        const cancelledOrders = response.data.data.filter(order => order.orderStatus === 'Cancelled');
        setOrders(cancelledOrders);
      }
    } catch (err) {
      console.error('Error fetching cancelled orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch cancelled orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleOpenRefundModal = async (order) => {
    setSelectedOrder(order);
    setRefundForm({
      refundMethod: order.paymentMethod === 'COD' ? '' : 'Razorpay',
      transactionId: '',
      notes: '',
      bankDetails: {
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
      }
    });
    
    // For COD orders, fetch customer bank details
    if (order.paymentMethod === 'COD' && order.userId?._id) {
      setLoadingBankDetails(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/product-orders/user/${order.userId._id}/bank-details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success && response.data.data.hasBankDetails) {
          setBankDetails(response.data.data.bankDetails);
          setRefundForm(prev => ({
            ...prev,
            bankDetails: response.data.data.bankDetails
          }));
        } else {
          setBankDetails(null);
        }
      } catch (err) {
        console.error('Error fetching bank details:', err);
        setBankDetails(null);
      } finally {
        setLoadingBankDetails(false);
      }
    }
    
    setShowRefundModal(true);
  };

  const handleProcessRefund = async () => {
    try {
      setRefundProcessing(true);
      const token = localStorage.getItem('adminToken');
      
      // Validate form
      if (!refundForm.refundMethod) {
        alert('Please select a refund method');
        return;
      }
      
      if (selectedOrder.paymentMethod === 'COD') {
        if (refundForm.refundMethod === 'Bank Transfer') {
          if (!refundForm.bankDetails.accountNumber || !refundForm.bankDetails.ifscCode) {
            alert('Please provide complete bank details for bank transfer');
            return;
          }
        } else if (refundForm.refundMethod === 'UPI' && !refundForm.bankDetails.upiId) {
          alert('Please provide UPI ID');
          return;
        }
      }
      
      // Initiate refund
      const payload = {
        refundMethod: refundForm.refundMethod,
        notes: refundForm.notes,
        transactionId: refundForm.transactionId || undefined
      };
      
      if (selectedOrder.paymentMethod === 'COD' && 
          (refundForm.refundMethod === 'Bank Transfer' || refundForm.refundMethod === 'UPI')) {
        payload.bankDetails = refundForm.bankDetails;
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/product-orders/${selectedOrder._id}/initiate-refund`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert(`Refund initiated successfully via ${refundForm.refundMethod}`);
        setShowRefundModal(false);
        fetchCancelledOrders();
      }
    } catch (err) {
      console.error('Error processing refund:', err);
      alert(err.response?.data?.message || 'Failed to process refund');
    } finally {
      setRefundProcessing(false);
    }
  };

  const handleCompleteRefund = async () => {
    try {
      setCompleteRefundProcessing(true);
      const token = localStorage.getItem('adminToken');
      
      // Validate form
      if (!completeRefundForm.transactionId.trim()) {
        alert('Please enter transaction ID');
        return;
      }
      
      const payload = {
        transactionId: completeRefundForm.transactionId,
        transactionProof: completeRefundForm.transactionProof || undefined,
        notes: completeRefundForm.notes || undefined
      };
      
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/product-orders/${selectedOrder._id}/complete-refund`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Refund marked as completed successfully');
        setShowCompleteRefundModal(false);
        setCompleteRefundForm({ transactionId: '', transactionProof: '', notes: '' });
        fetchCancelledOrders();
      }
    } catch (err) {
      console.error('Error completing refund:', err);
      alert(err.response?.data?.message || 'Failed to complete refund');
    } finally {
      setCompleteRefundProcessing(false);
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400/20 to-pink-400/20 blur-xl"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading cancelled orders...</p>
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
            onClick={fetchCancelledOrders}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50/30 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Cancelled Orders</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">View and manage cancelled order requests</p>
          </div>
          <button
            onClick={fetchCancelledOrders}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-red-50 to-pink-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-red-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2 relative z-10">Total Cancelled</p>
          <p className="text-4xl font-bold text-red-900 relative z-10">{orders.length}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-red-400 to-pink-300 rounded-full relative z-10"></div>
        </div>

        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">This Month</p>
          <p className="text-4xl font-bold text-gray-900">
            {orders.filter(o => {
              const orderDate = new Date(o.cancelledAt || o.updatedAt);
              const now = new Date();
              return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>

        <div className="group bg-gradient-to-br from-orange-50 to-red-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-orange-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Refund Pending</p>
          <p className="text-4xl font-bold text-orange-900">
            {orders.filter(o => o.paymentStatus === 'Paid').length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-orange-400 to-red-300 rounded-full"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-sm font-medium placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
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
                  Cancelled Date
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
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">No cancelled orders found</p>
                      <p className="text-sm text-gray-500">Cancelled orders will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/30 transition-all duration-200">
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
                      {new Date(order.cancelledAt || order.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {order.cancelReason || 'No reason provided'}
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
                        {order.paymentStatus === 'Paid' && !order.refundDetails?.status && (
                          <button
                            onClick={() => handleOpenRefundModal(order)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Process Refund
                          </button>
                        )}
                        {order.refundDetails?.status === 'Processing' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setCompleteRefundForm({ transactionId: '', transactionProof: '', notes: '' });
                              setShowCompleteRefundModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete Refund
                          </button>
                        )}
                        {order.refundDetails?.status && (
                          <span className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                            order.refundDetails.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.refundDetails.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.refundDetails.status}
                          </span>
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
            Showing <span className="font-semibold text-red-600">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> cancelled orders
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cancellation Details</h2>
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

              {/* Cancellation Info */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 className="font-semibold text-red-900 mb-3">Cancellation Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Cancelled On:</span> {new Date(selectedOrder.cancelledAt || selectedOrder.updatedAt).toLocaleString('en-IN')}</p>
                  <p><span className="font-medium">Reason:</span> {selectedOrder.cancelReason || 'No reason provided'}</p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'Paid' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
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

      {/* Refund Processing Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Process Refund</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.orderNumber}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Refund Amount: ₹{selectedOrder.pricing?.total?.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Method Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm font-medium text-blue-900">
                  Original Payment Method: <span className="font-bold">{selectedOrder.paymentMethod}</span>
                </p>
              </div>

              {/* Refund Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Refund Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={refundForm.refundMethod}
                  onChange={(e) => setRefundForm({...refundForm, refundMethod: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  disabled={selectedOrder.paymentMethod !== 'COD'}
                >
                  <option value="">-- Select Refund Method --</option>
                  {selectedOrder.paymentMethod === 'COD' ? (
                    <>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Store Credit">Store Credit</option>
                    </>
                  ) : (
                    <option value="Razorpay">Razorpay (Automatic)</option>
                  )}
                </select>
              </div>

              {/* COD - Bank Details Section */}
              {selectedOrder.paymentMethod === 'COD' && 
               (refundForm.refundMethod === 'Bank Transfer' || refundForm.refundMethod === 'UPI') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Customer Bank Details
                  </h3>

                  {loadingBankDetails ? (
                    <p className="text-gray-500 italic">Loading customer bank details...</p>
                  ) : bankDetails && bankDetails.accountNumber ? (
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <p className="text-sm"><span className="font-medium">Account Holder:</span> {bankDetails.accountHolderName || 'Not provided'}</p>
                      <p className="text-sm"><span className="font-medium">Bank Name:</span> {bankDetails.bankName || 'Not provided'}</p>
                      <p className="text-sm"><span className="font-medium">Account Number:</span> {bankDetails.accountNumber || 'Not provided'}</p>
                      <p className="text-sm"><span className="font-medium">IFSC Code:</span> {bankDetails.ifscCode || 'Not provided'}</p>
                      {bankDetails.upiId && <p className="text-sm"><span className="font-medium">UPI ID:</span> {bankDetails.upiId}</p>}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-yellow-800 text-sm mb-4">Customer hasn't saved bank details. Please enter manually:</p>
                      
                      <input
                        type="text"
                        placeholder="Account Holder Name *"
                        value={refundForm.bankDetails.accountHolderName}
                        onChange={(e) => setRefundForm({...refundForm, bankDetails: {...refundForm.bankDetails, accountHolderName: e.target.value}})}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                      />
                      
                      {refundForm.refundMethod === 'Bank Transfer' && (
                        <>
                          <input
                            type="text"
                            placeholder="Bank Name *"
                            value={refundForm.bankDetails.bankName}
                            onChange={(e) => setRefundForm({...refundForm, bankDetails: {...refundForm.bankDetails, bankName: e.target.value}})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                          />
                          <input
                            type="text"
                            placeholder="Account Number *"
                            value={refundForm.bankDetails.accountNumber}
                            onChange={(e) => setRefundForm({...refundForm, bankDetails: {...refundForm.bankDetails, accountNumber: e.target.value}})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                          />
                          <input
                            type="text"
                            placeholder="IFSC Code *"
                            value={refundForm.bankDetails.ifscCode}
                            onChange={(e) => setRefundForm({...refundForm, bankDetails: {...refundForm.bankDetails, ifscCode: e.target.value.toUpperCase()}})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                          />
                        </>
                      )}
                      
                      {refundForm.refundMethod === 'UPI' && (
                        <input
                          type="text"
                          placeholder="UPI ID *"
                          value={refundForm.bankDetails.upiId}
                          onChange={(e) => setRefundForm({...refundForm, bankDetails: {...refundForm.bankDetails, upiId: e.target.value}})}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Transaction ID (Optional for COD) */}
              {selectedOrder.paymentMethod === 'COD' && refundForm.refundMethod && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Transaction ID (Optional - Add after transfer)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction/reference ID"
                    value={refundForm.transactionId}
                    onChange={(e) => setRefundForm({...refundForm, transactionId: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any notes about this refund..."
                  value={refundForm.notes}
                  onChange={(e) => setRefundForm({...refundForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                />
              </div>

              {/* Razorpay Auto Refund Info */}
              {selectedOrder.paymentMethod !== 'COD' && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-800">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Refund will be processed automatically via Razorpay. Amount will be credited within 5-7 business days.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleProcessRefund}
                  disabled={refundProcessing || !refundForm.refundMethod}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {refundProcessing ? 'Processing...' : 'Initiate Refund'}
                </button>
                <button
                  onClick={() => setShowRefundModal(false)}
                  disabled={refundProcessing}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Refund Modal */}
      {showCompleteRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Complete Refund</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.orderNumber}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Refund Amount: ₹{selectedOrder.refundDetails?.amount?.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowCompleteRefundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Refund Details */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3">Refund Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Method:</span> {selectedOrder.refundDetails?.method}</p>
                  <p><span className="font-medium">Status:</span> {selectedOrder.refundDetails?.status}</p>
                  <p><span className="font-medium">Initiated:</span> {new Date(selectedOrder.refundDetails?.refundInitiatedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter bank transfer/UPI transaction ID"
                  value={completeRefundForm.transactionId}
                  onChange={(e) => setCompleteRefundForm({...completeRefundForm, transactionId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Transaction Proof */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction Proof (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter proof URL or reference"
                  value={completeRefundForm.transactionProof}
                  onChange={(e) => setCompleteRefundForm({...completeRefundForm, transactionProof: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any notes about this refund completion..."
                  value={completeRefundForm.notes}
                  onChange={(e) => setCompleteRefundForm({...completeRefundForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Info Box */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-800">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Customer will be notified via WhatsApp and email once refund is marked as completed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCompleteRefund}
                  disabled={completeRefundProcessing || !completeRefundForm.transactionId}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {completeRefundProcessing ? 'Completing...' : 'Complete Refund'}
                </button>
                <button
                  onClick={() => setShowCompleteRefundModal(false)}
                  disabled={completeRefundProcessing}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
