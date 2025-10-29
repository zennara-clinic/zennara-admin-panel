import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { 
  BellIcon, 
  CalendarIcon, 
  CurrencyIcon, 
  UsersIcon, 
  PackageIcon,
  FilterIcon,
  CheckCircleIcon,
  TrashIcon,
  RefreshIcon,
  XIcon
} from '../components/Icons';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    isRead: '',
    priority: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await notificationService.getAllNotifications(params);
      if (response.success) {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await notificationService.getNotificationStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      fetchStats();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      fetchStats();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Delete all read
  const handleDeleteAllRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) return;
    
    try {
      await notificationService.deleteAllRead();
      setNotifications(notifications.filter(n => !n.isRead));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  // Get icon and color
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'booking': 
        return { icon: CalendarIcon, color: 'bg-blue-100 text-blue-600' };
      case 'order': 
        return { icon: CurrencyIcon, color: 'bg-green-100 text-green-600' };
      case 'consultation': 
        return { icon: UsersIcon, color: 'bg-purple-100 text-purple-600' };
      case 'product': 
        return { icon: PackageIcon, color: 'bg-orange-100 text-orange-600' };
      case 'inventory': 
        return { icon: PackageIcon, color: 'bg-red-100 text-red-600' };
      default: 
        return { icon: BellIcon, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-blue-100 text-blue-700 border-blue-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return badges[priority] || badges.medium;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BellIcon className="w-8 h-8 text-zennara-green" />
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">Manage all your admin notifications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FilterIcon className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total</span>
              <BellIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.overall.total || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600">Unread</span>
              <BellIcon className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.overall.unread || 0}</p>
          </div>
          {stats.byType.map((item) => {
            const { icon: IconComponent, color } = getNotificationIcon(item._id);
            return (
              <div key={item._id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 capitalize">{item._id}</span>
                  <IconComponent className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                {item.unread > 0 && (
                  <p className="text-xs text-blue-600 mt-1">{item.unread} unread</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Notifications</h3>
            <button
              onClick={() => setFilters({ type: '', isRead: '', priority: '' })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="booking">Bookings</option>
                <option value="order">Orders</option>
                <option value="consultation">Consultations</option>
                <option value="product">Products</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.isRead}
                onChange={(e) => setFilters({ ...filters, isRead: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-zennara-green text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Mark All as Read
          </button>
          <button
            onClick={handleDeleteAllRead}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Delete All Read
          </button>
        </div>
        {pagination && (
          <p className="text-sm text-gray-600">
            Showing {notifications.length} of {pagination.total} notifications
          </p>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const { icon: IconComponent, color } = getNotificationIcon(notification.type);
              const timeAgo = notificationService.formatTimeAgo(notification.createdAt);
              
              return (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-semibold text-gray-900 ${
                              !notification.isRead ? 'font-bold' : ''
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-gray-500">{timeAgo}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadge(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl transition-colors ${
                  page === i + 1
                    ? 'bg-zennara-green text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
