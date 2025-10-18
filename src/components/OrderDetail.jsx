import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  CurrencyIcon,
  PrinterIcon
} from './Icons';
import { getOrderById, orderStatuses, getNextStatus } from '../data/ordersData';

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(getOrderById(id));
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [statusNote, setStatusNote] = useState('');

  if (!order) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</p>
          <button
            onClick={() => navigate('/patients/orders')}
            className="text-zennara-green font-semibold hover:underline"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStatusObj = orderStatuses.find(s => s.id === order.status);
  const nextStatus = getNextStatus(order.status);
  const nextStatusObj = orderStatuses.find(s => s.id === nextStatus);

  const getStatusBadgeClasses = (statusId) => {
    const status = orderStatuses.find(s => s.id === statusId);
    if (!status) return 'bg-gray-100 text-gray-700 border-gray-300';
    
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      red: 'bg-red-100 text-red-700 border-red-300'
    };
    
    return colorMap[status.color] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const handleStatusUpdate = () => {
    if (!nextStatus) return;
    
    const updatedOrder = {
      ...order,
      status: nextStatus,
      trackingNumber: trackingNumber || order.trackingNumber,
      statusHistory: [
        ...order.statusHistory,
        {
          status: nextStatus,
          timestamp: new Date().toLocaleString('en-IN', { 
            day: 'short',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true 
          }),
          note: statusNote || `Status updated to ${nextStatusObj?.name}`
        }
      ]
    };
    
    setOrder(updatedOrder);
    setStatusNote('');
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/patients/orders')}
          className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Orders</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order {order.orderNumber}</h1>
            <p className="text-base text-gray-500">Order ID: {order.id}</p>
          </div>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center space-x-2">
            <PrinterIcon className="w-5 h-5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Update Card */}
          {nextStatus && (
            <div className="bg-gradient-to-br from-zennara-green/10 to-emerald-50 rounded-3xl p-8 border-2 border-zennara-green/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Order Status</h2>
              <div className="bg-white rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <span className={`inline-flex px-4 py-2 rounded-xl font-bold text-sm border-2 ${getStatusBadgeClasses(order.status)}`}>
                      {currentStatusObj?.icon} {currentStatusObj?.name}
                    </span>
                  </div>
                  <span className="text-3xl text-gray-300">→</span>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Next Status</p>
                    <span className={`inline-flex px-4 py-2 rounded-xl font-bold text-sm border-2 ${getStatusBadgeClasses(nextStatus)}`}>
                      {nextStatusObj?.icon} {nextStatusObj?.name}
                    </span>
                  </div>
                </div>

                {nextStatus === 'shipped' && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2">TRACKING NUMBER</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">STATUS NOTE (Optional)</label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status update..."
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  className="w-full px-6 py-4 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  Update to {nextStatusObj?.name}
                </button>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: <span className="font-bold text-gray-900">{item.quantity}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zennara-green text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Charges</span>
                <span className="font-semibold text-gray-900">
                  {order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax (GST)</span>
                <span className="font-semibold text-gray-900">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-zennara-green">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Status History</h2>
            <div className="space-y-4">
              {order.statusHistory.map((history, idx) => {
                const statusObj = orderStatuses.find(s => s.id === history.status);
                return (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-${statusObj?.color}-100 flex items-center justify-center text-xl flex-shrink-0`}>
                      {statusObj?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-bold text-gray-900">{statusObj?.name}</p>
                        <span className="text-sm text-gray-500">{history.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{history.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Patient Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Details</h3>
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={order.patient.image}
                alt={order.patient.name}
                className="w-16 h-16 rounded-2xl border-2 border-gray-200"
              />
              <div>
                <p className="font-bold text-gray-900 text-lg">{order.patient.name}</p>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                  {order.patient.memberType}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.patient.email}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h3>
            <div className="flex items-start space-x-3">
              <LocationIcon className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.deliveryAddress.line1}<br />
                  {order.deliveryAddress.line2}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                  <span className="font-bold">{order.deliveryAddress.pincode}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <PhoneIcon className="w-4 h-4 inline mr-1" />
                  {order.deliveryAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="bg-blue-50 rounded-3xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-bold text-gray-900 text-lg">{order.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="font-bold text-gray-900">{order.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Information</h3>
            <div className="space-y-3">
              {[
                { label: 'Order Date', value: order.orderDate },
                { label: 'Payment Method', value: order.paymentMethod.toUpperCase() },
                { label: 'Payment Status', value: order.paymentStatus.toUpperCase(), colored: true },
                { label: 'Ordered From', value: order.orderedFrom }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`font-bold text-sm ${
                    item.colored && order.paymentStatus === 'paid' ? 'text-green-600' : 
                    item.colored ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Customer Notes</p>
                <p className="text-sm text-gray-700 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
