import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrder(response.data.data);
        setNewStatus(response.data.data.orderStatus);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order.orderStatus) {
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/product-orders/${id}/status`,
        { status: newStatus, note: statusNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowStatusModal(false);
        setStatusNote('');
        fetchOrderDetails();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error || 'Order not found'}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const statusOptions = [
    'Order Placed', 'Confirmed', 'Processing', 'Packed', 
    'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 p-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="group inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-md transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back to Orders</span>
        </button>
        
        {/* Order Header Card */}
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/50 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">#{order.orderNumber}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 -mx-2 px-4 py-3 rounded-xl transition-all duration-200 group">
                  {item.productImage && (
                    <div className="relative">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl"></div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.productName}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">₹{item.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{item.subtotal?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.pricing?.gst > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST</span>
                  <span className="text-gray-900">₹{order.pricing.gst.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.pricing?.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">₹{order.pricing.deliveryFee.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Status History</h2>
            </div>
            <div className="space-y-4">
              {order.statusHistory?.map((history, idx) => (
                <div key={idx} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-3 h-3 mt-2 rounded-full bg-gradient-to-br from-zennara-green to-emerald-600 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{history.status}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {history.note && (
                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Customer</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{order.userId?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{order.userId?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Shipping</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country || 'India'}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50/30 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Status</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-medium text-gray-900 mt-1">{order.orderStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-medium text-gray-900 mt-1">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900 mt-1">{order.paymentMethod || 'COD'}</p>
              </div>
              {order.deliveredAt && (
                <div>
                  <p className="text-sm text-gray-600">Delivered On</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Notes</h2>
              </div>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal - Apple Style */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 animate-scale-in">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Update Order Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status: <span className="text-zennara-green">{order.orderStatus}</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-zennara-green/20 focus:border-zennara-green focus:bg-white transition-all duration-200 text-sm appearance-none cursor-pointer"
                  style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note about this status change..."
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-zennara-green/20 focus:border-zennara-green focus:bg-white transition-all duration-200 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus(order.orderStatus);
                  setStatusNote('');
                }}
                className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === order.orderStatus}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
