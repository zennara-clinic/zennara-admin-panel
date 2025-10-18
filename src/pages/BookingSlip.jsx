import { useState, useEffect, useRef } from 'react';
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
  PrinterIcon,
  ShareIcon,
  CopyIcon,
  CheckIcon,
  BuildingIcon,
  ArrowLeftIcon
} from '../components/Icons';

export default function BookingSlip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  
  const [booking, setBooking] = useState(null);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetchBookingAndBranch();
  }, [id]);

  const fetchBookingAndBranch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch booking
      const bookingResponse = await axios.get(
        `${API_BASE_URL}/api/bookings/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(bookingResponse.data.data);

      // Fetch branch info based on location
      if (bookingResponse.data.data.preferredLocation) {
        try {
          const branchResponse = await axios.get(`${API_BASE_URL}/api/locations`);
          const branches = branchResponse.data.data || [];
          const matchedBranch = branches.find(
            b => b.name === bookingResponse.data.data.preferredLocation
          );
          if (matchedBranch) setBranch(matchedBranch);
        } catch (err) {
          console.error('Error fetching branch:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to load booking slip');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!booking) return;
    
    const shareText = `
Zennara Appointment Details

Booking ID: ${booking.referenceNumber}
Treatment: ${booking.consultationId?.name || 'N/A'}
Date: ${formatDate(booking.confirmedDate || booking.preferredDate)}
Time: ${booking.confirmedTime || booking.preferredTimeSlots?.join(', ')}
Location: ${booking.preferredLocation}

Patient: ${booking.fullName}
Mobile: ${booking.mobileNumber}

Status: ${booking.status}
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: 'Zennara Appointment Details',
        text: shareText,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      copyToClipboard(shareText, 'details');
      alert('Appointment details copied to clipboard!');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'bg-yellow-50 text-yellow-700 border-yellow-300',
      'Confirmed': 'bg-green-50 text-green-700 border-green-300',
      'Rescheduled': 'bg-blue-50 text-blue-700 border-blue-300',
      'In Progress': 'bg-purple-50 text-purple-700 border-purple-300',
      'Completed': 'bg-gray-100 text-gray-700 border-gray-300',
      'Cancelled': 'bg-red-50 text-red-700 border-red-300',
      'No Show': 'bg-orange-50 text-orange-700 border-orange-300'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-2 bg-zennara-green text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hidden in print */}
      <div className="bg-white border-b border-gray-200 px-10 py-6 print:hidden">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/bookings/${id}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-zennara-green transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Details</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-6 py-2.5 bg-zennara-green hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slip Content */}
      <div ref={printRef} className="max-w-[1200px] mx-auto p-10 print:p-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Zennara</h1>
              <p className="text-lg text-gray-600">Appointment Slip</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-base font-bold border-2 ${getStatusColor(booking.status)}`}>
                {booking.status}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Booking Reference */}
          <div className="bg-gradient-to-r from-zennara-green to-emerald-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Booking Reference</p>
                <p className="text-3xl font-bold">{booking.referenceNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(booking.referenceNumber, 'reference')}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all print:hidden"
              >
                {copied === 'reference' ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <CopyIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Treatment Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-zennara-green bg-opacity-10 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-zennara-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Treatment Information</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Treatment</label>
              <p className="text-lg font-semibold text-gray-900">
                {booking.consultationId?.name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Category</label>
              <p className="text-lg font-semibold text-gray-900">
                {booking.consultationId?.category || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border print:border-gray-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Patient Name</label>
                <p className="text-base font-semibold text-gray-900">{booking.fullName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Patient ID</label>
                <p className="text-base font-semibold text-gray-900">
                  {booking.userId?.patientId || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Mobile Number</label>
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900">{booking.mobileNumber}</p>
                  <button
                    onClick={() => copyToClipboard(booking.mobileNumber, 'phone')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
                  >
                    {copied === 'phone' ? (
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <CopyIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Email</label>
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900 break-all">{booking.email}</p>
                  <button
                    onClick={() => copyToClipboard(booking.email, 'email')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden ml-2"
                  >
                    {copied === 'email' ? (
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <CopyIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border print:border-gray-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Location</label>
                <div className="flex items-center">
                  <LocationIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <p className="text-base font-semibold text-gray-900">{booking.preferredLocation}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  {booking.confirmedDate ? 'Confirmed Date' : 'Preferred Date'}
                </label>
                <p className={`text-base font-semibold ${booking.confirmedDate ? 'text-green-600' : 'text-gray-900'}`}>
                  {formatDate(booking.confirmedDate || booking.preferredDate)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  {booking.confirmedTime ? 'Confirmed Time' : 'Preferred Time Slots'}
                </label>
                <p className={`text-base font-semibold ${booking.confirmedTime ? 'text-green-600' : 'text-gray-900'}`}>
                  {booking.confirmedTime || booking.preferredTimeSlots?.join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Contact Information */}
        {branch && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-6 print:shadow-none print:border print:border-gray-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <BuildingIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Center Contact</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center">
                  <LocationIcon className="w-4 h-4 mr-1" />
                  Address
                </label>
                <p className="text-base text-gray-900 leading-relaxed">
                  {branch.address.line1}
                  {branch.address.line2 && <>, {branch.address.line2}</>}
                  <br />
                  {branch.address.city} - {branch.address.pincode}
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1" />
                    Phone Numbers
                  </label>
                  <div className="space-y-2">
                    {branch.contact.phone.map((phone, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-base text-gray-900">+91 {phone}</p>
                        <button
                          onClick={() => copyToClipboard(`+91 ${phone}`, `branch-phone-${index}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
                        >
                          {copied === `branch-phone-${index}` ? (
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <CopyIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center">
                    <MailIcon className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-base text-gray-900">{branch.contact.email}</p>
                    <button
                      onClick={() => copyToClipboard(branch.contact.email, 'branch-email')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
                    >
                      {copied === 'branch-email' ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <CopyIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Note */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 print:border print:border-yellow-300">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">Important Note</h3>
          <ul className="space-y-2 text-base text-yellow-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please arrive 10-15 minutes before your scheduled appointment time.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bring a valid ID proof and this appointment slip for verification.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-gray-500 print:mt-8">
          <p>This is a computer-generated slip and does not require a signature.</p>
          <p className="mt-1">© {new Date().getFullYear()} Zennara. All rights reserved.</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border-width: 1px !important;
          }
          .print\\:border-gray-300 {
            border-color: rgb(209, 213, 219) !important;
          }
          .print\\:border-yellow-300 {
            border-color: rgb(253, 224, 71) !important;
          }
          .print\\:p-8 {
            padding: 2rem !important;
          }
          .print\\:mt-8 {
            margin-top: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
