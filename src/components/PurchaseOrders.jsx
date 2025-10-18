import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyIcon,
  DocumentIcon,
  PhoneIcon,
  MailIcon
} from './Icons';
import { purchaseOrders, suppliers } from '../data/productsData';

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = activeTab === 'all' ? purchaseOrders :
                        purchaseOrders.filter(order => order.status.toLowerCase() === activeTab);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      case 'delivered': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid' ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <button
            onClick={() => navigate('/products/list')}
            className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Products</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
          <p className="text-base text-gray-500">Manage supplier orders and deliveries</p>
        </div>
        <button
          onClick={() => navigate('/products/orders/new')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Orders', value: purchaseOrders.length, color: 'blue' },
          { title: 'Pending', value: purchaseOrders.filter(o => o.status === 'Pending').length, color: 'yellow' },
          { title: 'Approved', value: purchaseOrders.filter(o => o.status === 'Approved').length, color: 'green' },
          { title: 'Total Value', value: `₹${(purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0) / 100000).toFixed(1)}L`, color: 'purple' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 mb-8 inline-flex space-x-2">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'pending', label: 'Pending' },
          { id: 'approved', label: 'Approved' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Purchase Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{order.id}</h3>
                  <span className={`px-4 py-1 rounded-xl font-bold text-xs uppercase border-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`font-bold text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Supplier: <span className="font-bold text-gray-700">{order.supplier}</span></p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-zennara-green">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">Total Amount</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-3 gap-6 mb-6 p-6 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Order Date</p>
                <p className="font-bold text-gray-900">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Expected Delivery</p>
                <p className="font-bold text-gray-900">{order.expectedDelivery}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Items</p>
                <p className="font-bold text-gray-900">{order.items.length} products</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h4 className="text-base font-bold text-gray-900 mb-3">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 rounded-t-xl">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.productName}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 font-bold text-zennara-green">₹{item.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                Download PDF
              </button>
              {order.status === 'Pending' && (
                <>
                  <button className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold transition-all">
                    Reject
                  </button>
                  <button className="px-5 py-2 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    Approve Order
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suppliers Section */}
      <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Suppliers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-zennara-green transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{supplier.name}</h4>
                  <p className="text-sm text-gray-600">{supplier.contact}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-gray-900 text-sm">{supplier.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MailIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{supplier.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Delivery Time</p>
                  <p className="font-bold text-gray-900 text-sm">{supplier.deliveryTime}</p>
                </div>
                <button
                  onClick={() => navigate('/products/orders/new')}
                  className="px-4 py-2 bg-zennara-green text-white rounded-xl font-bold text-sm hover:shadow-md transition-all"
                >
                  Create Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
