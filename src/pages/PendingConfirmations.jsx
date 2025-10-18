import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  SearchIcon,
  CheckIcon
} from '../components/Icons';

export default function PendingConfirmations() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPendingBookings();
  }, [searchQuery]);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      params.append('status', 'Awaiting Confirmation');
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`${API_BASE_URL}/api/bookings/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCleanup = async () => {
    if (!confirm('This will delete all expired "Awaiting Confirmation" bookings. Continue?')) {
      return;
    }

    try {
      setCleaningUp(true);
      const token = localStorage.getItem('adminToken');
      
      await axios.post(
        `${API_BASE_URL}/api/bookings/admin/cleanup-expired`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchPendingBookings(); // Refresh the list
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      setCleaningUp(false);
    }
  };

  const handleConfirmClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedTimeSlot(booking.preferredTimeSlots?.[0] || '');
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTimeSlot || !selectedBooking) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      const confirmedDate = selectedBooking.preferredDate;
      
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${selectedBooking._id}/confirm`,
        { 
          confirmedDate, 
          confirmedTime: selectedTimeSlot 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowConfirmModal(false);
      setSelectedBooking(null);
      setSelectedTimeSlot('');
      fetchPendingBookings(); // Refresh the list
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-[1400px] mx-auto">
      {/* Header with clean typography */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Pending Confirmations</h1>
          <p className="text-base text-gray-600 font-normal">Review and confirm bookings awaiting your approval</p>
        </div>
        <button
          onClick={handleManualCleanup}
          disabled={cleaningUp}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>{cleaningUp ? 'Cleaning...' : 'Cleanup Expired'}</span>
        </button>
      </div>

      {/* Elegant Stats Banner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border border-orange-100/50 shadow-sm">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
            <ClockIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-semibold text-gray-900">{bookings.length}</span>
              <span className="text-sm font-medium text-gray-600">bookings awaiting confirmation</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Review and confirm to notify customers via email
            </p>
          </div>
        </div>
      </div>

      {/* Clean Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient name, email or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green/20 focus:border-zennara-green outline-none transition-all text-sm placeholder-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Card-based Bookings List */}
      {currentBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No pending confirmations</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'No bookings match your search' : 'All bookings have been confirmed'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {currentBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 group"
            >
              <div className="flex items-center justify-between">
                {/* Left: Patient Info */}
                <div className="flex items-start space-x-5 flex-1">
                  {/* Patient Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {booking.fullName.charAt(0)}
                    </span>
                  </div>

                  {/* Patient Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {booking.fullName}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {booking.referenceNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        {booking.email}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{booking.mobileNumber}</span>
                    </div>

                    {/* Treatment & Location */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.consultationId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{booking.consultationId?.category || ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <LocationIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-gray-600">{booking.preferredLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Date, Time & Actions */}
                <div className="flex items-center space-x-8 ml-6">
                  {/* Date & Time Slots */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {formatDate(booking.preferredDate)}
                    </p>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {booking.preferredTimeSlots?.map((slot, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleConfirmClick(booking)}
                      className="px-5 py-2.5 bg-zennara-green hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => navigate(`/bookings/${booking._id}`)}
                      className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-200 text-sm whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clean Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}–{Math.min(endIndex, bookings.length)}</span> of <span className="font-semibold text-gray-900">{bookings.length}</span>
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Elegant Confirmation Modal */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Confirm Booking</h2>
            
            {/* Patient Info Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 mb-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patient Name</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{selectedBooking.fullName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{selectedBooking.referenceNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Treatment</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {selectedBooking.consultationId?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{selectedBooking.preferredLocation}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Date</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formatDateTime(selectedBooking.preferredDate)}
                </p>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Select Confirmed Time Slot
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose one time slot from patient's preferred options
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {selectedBooking.preferredTimeSlots?.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      selectedTimeSlot === slot
                        ? 'border-zennara-green bg-emerald-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ClockIcon className={`w-5 h-5 ${selectedTimeSlot === slot ? 'text-zennara-green' : 'text-gray-600'}`} />
                      <span className={`text-lg font-medium ${selectedTimeSlot === slot ? 'text-zennara-green' : 'text-gray-900'}`}>
                        {slot}
                      </span>
                    </div>
                    {selectedTimeSlot === slot && (
                      <div className="mt-2 flex justify-center">
                        <div className="w-6 h-6 bg-zennara-green rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Note:</span> The patient will receive an email notification with the confirmed date and time. Booking status will change to "Confirmed".
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                  setSelectedTimeSlot('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={processing || !selectedTimeSlot}
                className="flex-1 px-6 py-3 bg-zennara-green text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
