import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, UserCircleIcon, SettingsIcon, LogoutIcon, BellIcon, CheckCircleIcon, XIcon, CalendarIcon, CurrencyIcon, UsersIcon, PackageIcon } from './Icons';
import adminAuthService from '../services/adminAuth';
import Avatar from './Avatar';

export default function Header() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const adminData = adminAuthService.getAdminData();

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Appointment Booked', message: 'John Doe has booked an appointment for tomorrow at 10:00 AM', time: '5 mins ago', unread: true, type: 'appointment' },
    { id: 2, title: 'Payment Received', message: 'Payment of ₹2,500 received from Sarah Johnson', time: '1 hour ago', unread: true, type: 'payment' },
    { id: 3, title: 'New Patient Registration', message: 'Michael Smith completed registration and medical form', time: '3 hours ago', unread: false, type: 'patient' },
    { id: 4, title: 'Inventory Alert', message: 'Low stock alert: Face Serum - Only 5 units remaining', time: '5 hours ago', unread: true, type: 'inventory' }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => notif.id === id ? { ...notif, unread: false } : notif));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const getNotificationIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch(type) {
      case 'appointment': 
        return { icon: CalendarIcon, color: 'bg-blue-100 text-blue-600' };
      case 'payment': 
        return { icon: CurrencyIcon, color: 'bg-green-100 text-green-600' };
      case 'patient': 
        return { icon: UsersIcon, color: 'bg-purple-100 text-purple-600' };
      case 'inventory': 
        return { icon: PackageIcon, color: 'bg-orange-100 text-orange-600' };
      default: 
        return { icon: BellIcon, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      navigate('/login');
    }
  };

  const displayName = adminData?.name || adminData?.email?.split('@')[0] || 'Admin';
  const displayEmail = adminData?.email || 'admin@zennara.in';
  const displayRole = adminData?.role ? adminData.role.replace('_', ' ').toUpperCase() : 'ADMINISTRATOR';

  return (
    <header className="sticky top-0 z-50 px-8 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="https://res.cloudinary.com/dimlozhrx/image/upload/v1760515905/Zen_Logo_Green_s9yv1e.png" 
            alt="Zennara" 
            className="h-12 w-auto"
          />
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative z-[70]">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 group"
          >
            <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-zennara-green" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Modal */}
          {isNotificationOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]"
                onClick={() => setIsNotificationOpen(false)}
              />
              
              {/* Modal */}
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl z-[90] animate-fade-in border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-zennara-green to-emerald-500 text-white flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <p className="text-xs opacity-90">{unreadCount} unread messages</p>
                  </div>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Mark all as read button */}
                {unreadCount > 0 && (
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-zennara-green hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Mark all as read
                    </button>
                  </div>
                )}

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => {
                    const { icon: IconComponent, color } = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-semibold text-gray-900 ${
                                notification.unread ? 'font-bold' : ''
                              }`}>
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer - View All */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      // Navigate to notifications page
                    }}
                    className="w-full py-2.5 bg-zennara-green hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative z-[70]">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 group"
          >
            <Avatar
              src={adminData?.profilePhoto}
              name={displayName}
              size="md"
              showOnlineDot={true}
              shape="circle"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-500">{displayRole}</p>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl py-4 animate-fade-in border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-zennara-green to-emerald-500 text-white">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={adminData?.profilePhoto}
                    name={displayName}
                    size="lg"
                    shape="circle"
                    className="border-3 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-bold text-lg">{displayName}</p>
                    <p className="text-xs opacity-90">{displayEmail}</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <a href="#profile" className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <UserCircleIcon className="w-5 h-5 text-zennara-green" />
                  <div>
                    <p className="font-semibold text-sm">My Profile</p>
                    <p className="text-xs text-gray-500">View and edit profile</p>
                  </div>
                </a>
                <a href="#settings" className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <SettingsIcon className="w-5 h-5 text-zennara-green" />
                  <div>
                    <p className="font-semibold text-sm">Settings</p>
                    <p className="text-xs text-gray-500">Manage preferences</p>
                  </div>
                </a>
                <hr className="my-2 border-gray-100" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 mx-2 rounded-xl"
                >
                  <LogoutIcon className="w-5 h-5 text-red-500" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Logout</p>
                    <p className="text-xs text-red-400">Sign out of account</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
