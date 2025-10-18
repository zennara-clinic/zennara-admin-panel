import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  CalendarIcon,
  UsersIcon,
  LocationIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
  CheckIcon,
  XMarkIcon,
  DocumentIcon,
  StarIcon
} from '../components/Icons';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/bookings/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooking(response.data.data);
      
      // Pre-fill dates for confirmation
      if (response.data.data.preferredDate) {
        setConfirmedDate(new Date(response.data.data.preferredDate).toISOString().split('T')[0]);
      }
      if (response.data.data.preferredTimeSlots?.length > 0) {
        setConfirmedTime(response.data.data.preferredTimeSlots[0]);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${id}/confirm`,
        { confirmedDate, confirmedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowConfirmModal(false);
      fetchBookingDetails();
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkNoShow = async () => {
    if (!window.confirm('Are you sure you want to mark this booking as No Show?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${id}/no-show`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchBookingDetails();
    } catch (error) {
      console.error('Error marking no-show:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${id}/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowCheckOutModal(false);
      fetchBookingDetails();
    } catch (error) {
      console.error('Error checking out:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewSlip = () => {
    navigate(`/bookings/${id}/slip`);
  };

  const handleCancelBooking = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/bookings/admin/${id}/cancel`,
        { reason: cancellationReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowCancelModal(false);
      setCancellationReason('');
      fetchBookingDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Confirmed': 'bg-green-100 text-green-700 border-green-300',
      'Rescheduled': 'bg-blue-100 text-blue-700 border-blue-300',
      'In Progress': 'bg-purple-100 text-purple-700 border-purple-300',
      'Completed': 'bg-gray-100 text-gray-700 border-gray-300',
      'Cancelled': 'bg-red-100 text-red-700 border-red-300',
      'No Show': 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 px-6 py-2 bg-zennara-green text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  // Determine back navigation based on booking status
  const getBackNavigation = () => {
    if (booking.status === 'Awaiting Confirmation') {
      return '/bookings/pending';
    }
    return '/bookings';
  };

  const getBackLabel = () => {
    if (booking.status === 'Awaiting Confirmation') {
      return 'Back to Pending Confirmations';
    }
    return 'Back to Bookings';
  };

  return (
    <div className="min-h-screen p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(getBackNavigation())}
          className="text-sm font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>{getBackLabel()}</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Details</h1>
            <p className="text-gray-500">Reference: {booking.referenceNumber}</p>
          </div>
          <div className={`px-6 py-3 rounded-2xl text-lg font-bold border-2 ${getStatusColor(booking.status)}`}>
            {booking.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <UsersIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-base font-semibold text-gray-900 mt-1">{booking.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Patient ID</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {booking.userId?.patientId || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base font-semibold text-gray-900 mt-1 flex items-center">
                  <MailIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {booking.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="text-base font-semibold text-gray-900 mt-1 flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {booking.mobileNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Treatment Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Treatment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Treatment Name</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {booking.consultationId?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {booking.consultationId?.category || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formatCurrency(booking.consultationId?.price || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Schedule Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Show ONLY confirmed date/time when available, otherwise show preferred */}
              {booking.confirmedDate ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Confirmed Date</label>
                    <p className="text-base font-semibold text-green-600 mt-1">
                      {formatDate(booking.confirmedDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Confirmed Time</label>
                    <p className="text-base font-semibold text-green-600 mt-1">
                      {booking.confirmedTime}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Date</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Time Slots</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {booking.preferredTimeSlots?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-base font-semibold text-gray-900 mt-1 flex items-center">
                  <LocationIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {booking.preferredLocation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {/* Awaiting Confirmation Status */}
              {booking.status === 'Awaiting Confirmation' && (
                <>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}

              {/* Confirmed Status */}
              {booking.status === 'Confirmed' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}

              {/* No Show Status */}
              {booking.status === 'No Show' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}

              {/* Rescheduled Status */}
              {booking.status === 'Rescheduled' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}

              {/* In Progress Status */}
              {booking.status === 'In Progress' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                  <button
                    onClick={() => setShowCheckOutModal(true)}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Check-Out
                  </button>
                </>
              )}

              {/* Cancelled Status */}
              {booking.status === 'Cancelled' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}

              {/* Completed Status */}
              {booking.status === 'Completed' && (
                <>
                  <button
                    onClick={handleViewSlip}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Slip
                  </button>
                  <button
                    onClick={() => navigate(getBackNavigation())}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to Bookings
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                <label className="text-xs font-medium text-gray-500">Created</label>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
              {booking.confirmedDate && (
                <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <label className="text-xs font-medium text-gray-500">Confirmed</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {booking.checkInTime && (
                <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                  <label className="text-xs font-medium text-gray-500">Checked In</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(booking.checkInTime).toLocaleString()}
                  </p>
                </div>
              )}
              {booking.checkOutTime && (
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-500"></div>
                  <label className="text-xs font-medium text-gray-500">Checked Out</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(booking.checkOutTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rating - For Completed Bookings */}
          {booking.status === 'Completed' && booking.rating && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Rating</h3>
              <div className="flex items-center space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-8 h-8 ${
                      star <= booking.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900">{booking.rating}/5</p>
              <p className="text-sm text-gray-500 mt-1">Treatment Rating</p>
            </div>
          )}

          {/* Session Summary - For Completed Bookings */}
          {booking.status === 'Completed' && booking.checkInTime && booking.checkOutTime && (
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <CheckIcon className="w-6 h-6 mr-2" />
                Session Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Check-in</span>
                  <span className="text-sm font-semibold text-green-900">
                    {new Date(booking.checkInTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Check-out</span>
                  <span className="text-sm font-semibold text-green-900">
                    {new Date(booking.checkOutTime).toLocaleTimeString()}
                  </span>
                </div>
                {booking.sessionDuration && (
                  <div className="flex justify-between items-center pt-3 border-t border-green-300">
                    <span className="text-sm font-medium text-green-800">Duration</span>
                    <span className="text-base font-bold text-green-900">
                      {booking.sessionDuration} minutes
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* In Progress Alert */}
          {booking.status === 'In Progress' && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
                <ClockIcon className="w-6 h-6 mr-2" />
                Treatment in Progress
              </h3>
              <p className="text-sm text-purple-800 mb-4">
                Patient checked in at {booking.checkInTime && new Date(booking.checkInTime).toLocaleTimeString()}
              </p>
              <p className="text-xs text-purple-700">
                Click "Check Out Patient" when the treatment session is complete.
              </p>
            </div>
          )}

          {/* Additional Info */}
          {(booking.notes || booking.adminNotes) && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
              {booking.notes && (
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-500">Patient Notes</label>
                  <p className="text-sm text-gray-700 mt-1">{booking.notes}</p>
                </div>
              )}
              {booking.adminNotes && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Admin Notes</label>
                  <p className="text-sm text-gray-700 mt-1">{booking.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Booking Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmed Date
                </label>
                <input
                  type="date"
                  value={confirmedDate}
                  onChange={(e) => setConfirmedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmed Time
                </label>
                <select
                  value={confirmedTime}
                  onChange={(e) => setConfirmedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none"
                >
                  <option value="">Select time</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={processing || !confirmedDate || !confirmedTime}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Check Out Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Treatment Session</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to check out this patient? This will mark the treatment session as complete.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Check-in Time</p>
                  <p className="text-sm text-purple-700">
                    {booking.checkInTime && new Date(booking.checkInTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckOutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Check Out Patient'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Booking</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? A cancellation email will be sent to the patient.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> This action cannot be undone. The patient will be notified via email.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                disabled={processing}
              >
                Go Back
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={processing || !cancellationReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
