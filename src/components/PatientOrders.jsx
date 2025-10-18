import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageIcon,
  ChartIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyIcon,
  EyeIcon,
  UsersIcon
} from './Icons';
import { patientOrders, orderStats, orderStatuses, getOrdersByStatus } from '../data/ordersData';

export default function PatientOrders() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = patientOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.patient.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

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

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Orders</h1>
        <p className="text-base text-gray-500">Manage orders placed from mobile app</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Orders', value: orderStats.totalOrders, icon: PackageIcon, color: 'blue' },
          { title: 'Pending', value: orderStats.pendingOrders, icon: ClockIcon, color: 'yellow' },
          { title: 'Delivered', value: orderStats.deliveredOrders, icon: CheckCircleIcon, color: 'green' },
          { title: 'Total Revenue', value: `₹${(orderStats.totalRevenue / 1000).toFixed(1)}K`, icon: CurrencyIcon, color: 'purple' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter by Status</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-5 py-2.5 rounded-2xl font-bold transition-all ${
              selectedStatus === 'all'
                ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders ({patientOrders.length})
          </button>
          {orderStatuses.filter(s => s.id !== 'cancelled').map((status) => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 ${
                selectedStatus === status.id
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{status.name}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {getOrdersByStatus(status.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by order number, patient name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/products/customer-orders/${order.id}`)}
          >
            <div className="flex items-start justify-between">
              {/* Left: Patient & Order Info */}
              <div className="flex items-center space-x-5 flex-1">
                <img
                  src={order.patient.image}
                  alt={order.patient.name}
                  className="w-16 h-16 rounded-2xl border-2 border-gray-200"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                    <span className={`px-4 py-1 rounded-xl font-bold text-xs uppercase border-2 ${getStatusBadgeClasses(order.status)}`}>
                      {orderStatuses.find(s => s.id === order.status)?.name}
                    </span>
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Patient</p>
                      <p className="font-bold text-gray-900 text-sm">{order.patient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Order Date</p>
                      <p className="font-semibold text-gray-900 text-sm">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Items</p>
                      <p className="font-semibold text-gray-900 text-sm">{order.items.length} products</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Payment</p>
                      <p className="font-semibold text-gray-900 text-sm">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Actions */}
              <div className="text-right ml-6 space-y-3">
                <div>
                  <p className="text-3xl font-bold text-zennara-green">₹{order.total.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Total Amount</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/customer-orders/${order.id}`);
                  }}
                  className="px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-bold text-sm transition-all flex items-center space-x-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>

            {/* Products Preview */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {order.items.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="text-sm font-bold text-gray-500">+{order.items.length - 4} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-20">
          <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
