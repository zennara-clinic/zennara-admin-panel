import api, { API_BASE_URL } from '../config/api';

const NOTIFICATION_BASE_URL = `${API_BASE_URL}/api/notifications/admin`;

class NotificationService {
  /**
   * Get all notifications with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} Notifications data
   */
  async getAllNotifications(params = {}) {
    try {
      const response = await api.get(NOTIFICATION_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get recent notifications (for popup)
   * @param {number} limit - Number of notifications to fetch
   * @returns {Promise} Recent notifications
   */
  async getRecentNotifications(limit = 3) {
    try {
      const response = await api.get(`${NOTIFICATION_BASE_URL}/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @returns {Promise} Unread count
   */
  async getUnreadCount() {
    try {
      const response = await api.get(`${NOTIFICATION_BASE_URL}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise} Notification data
   */
  async getNotificationById(id) {
    try {
      const response = await api.get(`${NOTIFICATION_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} Updated notification
   */
  async markAsRead(id) {
    try {
      const response = await api.patch(`${NOTIFICATION_BASE_URL}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} Result
   */
  async markAllAsRead() {
    try {
      const response = await api.patch(`${NOTIFICATION_BASE_URL}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise} Result
   */
  async deleteNotification(id) {
    try {
      const response = await api.delete(`${NOTIFICATION_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all read notifications
   * @returns {Promise} Result
   */
  async deleteAllRead() {
    try {
      const response = await api.delete(`${NOTIFICATION_BASE_URL}/read/all`);
      return response.data;
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   * @returns {Promise} Statistics data
   */
  async getNotificationStats() {
    try {
      const response = await api.get(`${NOTIFICATION_BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  /**
   * Format time ago helper
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted time ago string
   */
  formatTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = now - past;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  /**
   * Get notification icon and color by type
   * @param {string} type - Notification type
   * @returns {Object} Icon and color configuration
   */
  getNotificationStyle(type) {
    const styles = {
      booking: {
        iconName: 'calendar',
        color: 'bg-blue-100 text-blue-600',
        badgeColor: 'bg-blue-500'
      },
      order: {
        iconName: 'currency',
        color: 'bg-green-100 text-green-600',
        badgeColor: 'bg-green-500'
      },
      consultation: {
        iconName: 'users',
        color: 'bg-purple-100 text-purple-600',
        badgeColor: 'bg-purple-500'
      },
      product: {
        iconName: 'package',
        color: 'bg-orange-100 text-orange-600',
        badgeColor: 'bg-orange-500'
      },
      inventory: {
        iconName: 'package',
        color: 'bg-red-100 text-red-600',
        badgeColor: 'bg-red-500'
      }
    };

    return styles[type] || {
      iconName: 'bell',
      color: 'bg-gray-100 text-gray-600',
      badgeColor: 'bg-gray-500'
    };
  }
}

export default new NotificationService();
