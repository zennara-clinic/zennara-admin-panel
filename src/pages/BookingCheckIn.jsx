import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  CalendarIcon,
  UsersIcon,
  CheckIcon,
  SearchIcon
} from '../components/Icons';

export default function BookingCheckIn() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTodayBookings();
  }, []);

  const fetchTodayBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/admin/all?date=${today}&status=Confirmed`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${bookingId}/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Patient checked in successfully!');
      fetchTodayBookings();
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.response?.data?.message || 'Failed to check in patient');
    }
  };

  const formatTime = (slots) => {
    return Array.isArray(slots) ? slots[0] : slots;
  };

  const filteredBookings = bookings.filter(booking => 
    booking.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.mobileNumber.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Check-In System</h1>
        <p className="text-gray-500 text-base">Manage patient check-ins for today's confirmed bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{bookings.length}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Today's Confirmed</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-purple-600">
              {bookings.filter(b => b.checkInTime).length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Checked In</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-green-600">
              {bookings.filter(b => !b.checkInTime).length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Awaiting Check-In</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, reference number, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Eligible for Check-In ({filteredBookings.filter(b => !b.checkInTime).length})
          </h2>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No confirmed bookings today</h3>
            <p className="text-sm text-gray-500">
              Confirmed bookings for today will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  booking.checkInTime ? 'bg-gray-50 opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 flex-1">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {booking.fullName.charAt(0)}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {booking.fullName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {booking.referenceNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {booking.confirmedTime || formatTime(booking.preferredTimeSlots)}
                        </span>
                        <span>•</span>
                        <span className="font-medium">
                          {booking.consultationId?.name || 'N/A'}
                        </span>
                        <span>•</span>
                        <span>{booking.mobileNumber}</span>
                      </div>
                    </div>

                    {/* Time Status */}
                    <div className="text-right mr-6">
                      <div className="text-2xl font-bold text-gray-900">
                        {booking.confirmedTime || formatTime(booking.preferredTimeSlots)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.preferredLocation}
                      </div>
                    </div>
                  </div>

                  {/* Check-In Button */}
                  <div>
                    {booking.checkInTime ? (
                      <div className="text-center">
                        <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl font-medium border-2 border-green-200">
                          Checked In
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(booking.checkInTime).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(booking._id)}
                        className="px-8 py-3 bg-zennara-green text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-md hover:shadow-lg"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>

                {/* View Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                    className="text-sm text-zennara-green hover:text-emerald-700 font-semibold transition-colors"
                  >
                    View Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
