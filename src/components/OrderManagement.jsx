import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  PrinterIcon,
  XCircleIcon,
  PlusIcon,
  ChevronDownIcon
} from './Icons';
import { getOrderById, orderStatuses, getNextStatus } from '../data/ordersData';
import { products } from '../data/productsData';

export default function OrderManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const existingOrder = getOrderById(id);
  
  if (!existingOrder) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</p>
          <button onClick={() => navigate('/products/customer-orders')} className="text-zennara-green font-semibold hover:underline">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const [order, setOrder] = useState(existingOrder);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(existingOrder.trackingNumber || '');
  const [statusNote, setStatusNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(existingOrder.status || 'pending');
  
  // Editable fields
  const [deliveryAddress, setDeliveryAddress] = useState(existingOrder.deliveryAddress || {});
  const [orderItems, setOrderItems] = useState(existingOrder.items || []);
  const [notes, setNotes] = useState(existingOrder.notes || '');

  const currentStatusObj = orderStatuses.find(s => s.id === order.status);
  const selectedStatusObj = orderStatuses.find(s => s.id === selectedStatus);

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
    if (!selectedStatus || selectedStatus === order.status) {
      return;
    }
    
    const updatedOrder = {
      ...order,
      status: selectedStatus,
      trackingNumber: trackingNumber || order.trackingNumber,
      statusHistory: [
        ...order.statusHistory,
        {
          status: selectedStatus,
          timestamp: new Date().toLocaleString('en-IN', { day: 'short', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true }),
          note: statusNote || `Status updated to ${selectedStatusObj?.name}`
        }
      ]
    };
    setOrder(updatedOrder);
    setStatusNote('');
  };

  const handleSaveAddress = () => {
    setOrder({ ...order, deliveryAddress });
    setIsEditingAddress(false);
  };

  const handleSaveItems = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.floor(subtotal * 0.1); // 10% discount example
    const tax = Math.floor(subtotal * 0.09); // 9% tax
    const total = subtotal - discount + tax + order.deliveryCharges;
    
    setOrder({
      ...order,
      items: orderItems,
      subtotal,
      discount,
      tax,
      total
    });
    setIsEditingItems(false);
  };

  const handleSaveNotes = () => {
    setOrder({ ...order, notes });
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index, quantity) => {
    setOrderItems(orderItems.map((item, i) => i === index ? { ...item, quantity: parseInt(quantity) || 1 } : item));
  };

  const addNewItem = () => {
    setOrderItems([...orderItems, { productId: '', name: '', quantity: 1, price: 0, image: products[0]?.images[0] }]);
  };

  const recalculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header with Actions */}
      <div className="mb-10">
        <button onClick={() => navigate('/products/customer-orders')} className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors">
          <span>←</span>
          <span>Back to Orders</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Order {order.orderNumber}</h1>
            <p className="text-base text-gray-500">Complete order management & tracking</p>
          </div>
          <div className="flex items-center space-x-3">
            <a href={`tel:${order.patient.phone}`} className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center space-x-2">
              <PhoneIcon className="w-5 h-5" />
              <span>Call Customer</span>
            </a>
            <button className="px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center space-x-2">
              <PrinterIcon className="w-5 h-5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Status Update */}
          <div className="bg-gradient-to-br from-zennara-green/10 to-emerald-50 rounded-3xl p-8 border-2 border-zennara-green/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircleIcon className="w-6 h-6 text-zennara-green" />
              <span>Update Order Status</span>
            </h2>
            <div className="bg-white rounded-2xl p-6">
              {/* Current Status Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 mb-2">Current Status</p>
                <span className={`inline-flex px-4 py-2 rounded-xl font-bold text-sm border-2 ${getStatusBadgeClasses(order.status)}`}>
                  {currentStatusObj?.name}
                </span>
              </div>

              {/* Status Dropdown Selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">SELECT NEW STATUS *</label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Status --</option>
                    {orderStatuses.filter(s => s.id !== 'cancelled').map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {selectedStatus && selectedStatus !== order.status && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700">
                      Will update to: {selectedStatusObj?.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Tracking Number (shown for shipped status) */}
              {(selectedStatus === 'shipped' || selectedStatus === 'out-for-delivery') && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">TRACKING NUMBER *</label>
                  <input 
                    type="text" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)} 
                    placeholder="Enter tracking number" 
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all" 
                  />
                </div>
              )}

              {/* Status Note */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">STATUS NOTE (Optional)</label>
                <textarea 
                  value={statusNote} 
                  onChange={(e) => setStatusNote(e.target.value)} 
                  placeholder="Add update note..." 
                  rows={2} 
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all resize-none" 
                />
              </div>

              {/* Update Button */}
              <button 
                onClick={handleStatusUpdate} 
                disabled={!selectedStatus || selectedStatus === order.status}
                className={`w-full px-6 py-4 rounded-2xl font-bold transition-all ${
                  selectedStatus && selectedStatus !== order.status
                    ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedStatus && selectedStatus !== order.status 
                  ? `Update to ${selectedStatusObj?.name}` 
                  : 'Select a Status to Update'}
              </button>
            </div>
          </div>

          {/* Order Items - Editable */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              {!isEditingItems ? (
                <button onClick={() => setIsEditingItems(true)} className="px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-bold transition-all">
                  Edit Items
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button onClick={handleSaveItems} className="px-5 py-2 bg-zennara-green text-white rounded-xl font-bold hover:shadow-md transition-all">
                    Save
                  </button>
                  <button onClick={() => { setOrderItems(order.items); setIsEditingItems(false); }} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{item.name}</p>
                    {isEditingItems ? (
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-600">Qty:</label>
                        <input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(idx, e.target.value)} min="1" className="w-20 px-3 py-1.5 border-2 border-gray-300 rounded-lg font-bold" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Quantity: <span className="font-bold text-gray-900">{item.quantity}</span></p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zennara-green text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">₹{item.price} each</p>
                  </div>
                  {isEditingItems && (
                    <button onClick={() => removeItem(idx)} className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all">
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {isEditingItems && (
                <button onClick={addNewItem} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-bold hover:border-zennara-green hover:text-zennara-green transition-all flex items-center justify-center space-x-2">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Item</span>
                </button>
              )}
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">₹{(isEditingItems ? recalculateTotal() : order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery</span>
                <span className="font-semibold text-gray-900">{order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges}`}</span>
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

          {/* Delivery Notes */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Instructions</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add special delivery instructions..." rows={3} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all resize-none mb-3" />
            <button onClick={handleSaveNotes} className="px-6 py-2.5 bg-zennara-green text-white rounded-xl font-bold hover:shadow-md transition-all">
              Save Notes
            </button>
          </div>
        </div>

        {/* Right Column - Customer & Delivery */}
        <div className="space-y-8">
          {/* Customer Details */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-sm border-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">👤 Customer Details</h3>
            <div className="flex items-center space-x-4 mb-6">
              <img src={order.patient.image} alt={order.patient.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-md" />
              <div>
                <p className="font-bold text-gray-900 text-lg mb-1">{order.patient.name}</p>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">{order.patient.memberType}</span>
              </div>
            </div>
            <div className="space-y-3">
              <a href={`tel:${order.patient.phone}`} className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-all group">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{order.patient.phone}</span>
              </a>
              <a href={`mailto:${order.patient.email}`} className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-all group">
                <MailIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">{order.patient.email}</span>
              </a>
            </div>
          </div>

          {/* Delivery Address - Editable */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 shadow-sm border-2 border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <LocationIcon className="w-6 h-6 text-orange-600" />
                <span>Delivery Address</span>
              </h3>
              {!isEditingAddress && (
                <button onClick={() => setIsEditingAddress(true)} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm hover:shadow-md transition-all">
                  Edit
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div className="space-y-3">
                <input type="text" value={deliveryAddress.line1} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })} placeholder="Address Line 1" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                <input type="text" value={deliveryAddress.line2} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })} placeholder="Address Line 2" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={deliveryAddress.city} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })} placeholder="City" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                  <input type="text" value={deliveryAddress.state} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })} placeholder="State" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                <input type="text" value={deliveryAddress.pincode} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })} placeholder="Pincode" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                <input type="tel" value={deliveryAddress.phone} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })} placeholder="Contact Phone" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                <div className="flex space-x-2 pt-2">
                  <button onClick={handleSaveAddress} className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:shadow-md transition-all">
                    Save Address
                  </button>
                  <button onClick={() => { setDeliveryAddress(order.deliveryAddress); setIsEditingAddress(false); }} className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.deliveryAddress.line1}<br />
                  {order.deliveryAddress.line2}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                  <span className="font-bold text-lg">{order.deliveryAddress.pincode}</span>
                </p>
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                  <PhoneIcon className="w-4 h-4 inline mr-2" />
                  {order.deliveryAddress.phone}
                </p>
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Order Info</h3>
            <div className="space-y-3">
              {[
                { label: 'Order ID', value: order.id },
                { label: 'Order Date', value: order.orderDate },
                { label: 'Payment', value: order.paymentMethod.toUpperCase() },
                { label: 'Payment Status', value: order.paymentStatus.toUpperCase(), colored: true },
                { label: 'Ordered From', value: order.orderedFrom }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`font-bold text-sm ${item.colored && order.paymentStatus === 'paid' ? 'text-green-600' : item.colored ? 'text-orange-600' : 'text-gray-900'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                <p className="font-bold text-gray-900 text-lg">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
