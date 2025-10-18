import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/package-assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignment(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = () => {
    if (!assignment || !assignment.packageDetails.services) return 0;
    const totalServices = assignment.packageDetails.services.length;
    if (totalServices === 0) return 0;
    const completedServices = assignment.completedServices?.length || 0;
    return Math.round((completedServices / totalServices) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zennara-green mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h3>
          <p className="text-gray-600 mb-6">The assignment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/consultations/assign-packages')}
            className="px-6 py-2.5 bg-zennara-green text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleSendCancellationOtp = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setSendingOtp(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/package-assignments/${id}/cancel/send-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCancelModal(false);
      setShowOtpModal(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyCancellation = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/package-assignments/${id}/cancel/verify-otp`,
        { otp, reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        await fetchAssignmentDetails();
        setShowOtpModal(false);
        setOtp('');
        setCancelReason('');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Failed to cancel package');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/consultations/assign-packages')}
            className="inline-flex items-center text-gray-600 hover:text-zennara-green transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Assignments</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Package Assignment Details</h1>
              <p className="text-sm text-gray-600">
                Assignment ID: <span className="font-mono font-medium text-zennara-green">{assignment.assignmentId}</span>
                <span className="ml-4 text-gray-600">
                  • Progress: <span className={`font-semibold ${
                    getCompletionPercentage() === 100 ? 'text-green-600' : 'text-blue-600'
                  }`}>{getCompletionPercentage()}%</span>
                  {' '}({assignment.completedServices?.length || 0}/{assignment.packageDetails.services.length} services)
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {assignment.status !== 'Cancelled' && assignment.status !== 'Completed' && getCompletionPercentage() < 100 && (
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-white text-red-600 font-medium border-2 border-red-600 rounded-lg hover:bg-red-50 transition-all active:scale-95"
                >
                  Cancel Package
                </button>
              )}
              <button
                onClick={() => navigate(`/consultations/assign-packages/${id}/progress`)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Progress</span>
              </button>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                assignment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                assignment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {assignment.status}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {assignment.userDetails.fullName?.charAt(0) || assignment.userDetails.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Full Name</p>
                    <p className="text-base font-semibold text-gray-900">{assignment.userDetails.fullName || assignment.userDetails.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Patient ID</p>
                  <p className="text-base font-semibold text-gray-900 font-mono">{assignment.userDetails.patientId}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Email Address</p>
                  <p className="text-base text-gray-900">{assignment.userDetails.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                  <p className="text-base text-gray-900">{assignment.userDetails.phone}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Member Type</p>
                  <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    {assignment.userDetails.memberType === 'Zen Member' && (
                      <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                    <span className="text-sm font-semibold text-purple-900">{assignment.userDetails.memberType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Package Name</p>
                  <p className="text-lg font-bold text-gray-900">{assignment.packageDetails.packageName}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-3">Included Services</p>
                  <div className="space-y-2">
                    {assignment.packageDetails.services && assignment.packageDetails.services.length > 0 ? (
                      assignment.packageDetails.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{service.serviceName}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No services listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            {assignment.payment.proofUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Proof</h2>
                </div>

                <div className="relative group">
                  <img 
                    src={assignment.payment.proofUrl} 
                    alt="Payment Proof" 
                    className="w-full h-auto rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    onClick={() => window.open(assignment.payment.proofUrl, '_blank')}
                  >
                    <button 
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-5 py-2.5 rounded-xl shadow-lg font-semibold text-gray-900 hover:bg-gray-50 hover:scale-105 transform transition-all flex items-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(assignment.payment.proofUrl, '_blank');
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <span>View Full Size</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Payment */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <div className="bg-gradient-to-br from-zennara-green to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-6">Pricing Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Original Amount</span>
                  <span className="font-semibold">{formatCurrency(assignment.pricing.originalAmount)}</span>
                </div>

                {assignment.pricing.discountPercentage > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">
                        Discount ({assignment.pricing.discountPercentage}%)
                        {assignment.pricing.isZenMemberDiscount && (
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">Zen</span>
                        )}
                      </span>
                      <span className="font-semibold">- {formatCurrency(assignment.pricing.discountAmount)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-4"></div>
                  </>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Final Amount</span>
                  <span className="text-2xl font-bold">{formatCurrency(assignment.pricing.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Payment Status</p>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold ${
                    assignment.payment.isReceived 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      {assignment.payment.isReceived ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      )}
                    </svg>
                    {assignment.payment.isReceived ? 'Received' : 'Pending'}
                  </div>
                </div>

                {assignment.payment.paymentMethod && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Payment Method</p>
                    <p className="text-base font-semibold text-gray-900">{assignment.payment.paymentMethod}</p>
                  </div>
                )}

                {assignment.payment.transactionId && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Transaction ID</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
                        {assignment.payment.transactionId}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(assignment.payment.transactionId)}
                        className="p-2 text-gray-500 hover:text-zennara-green transition-colors"
                        title="Copy Transaction ID"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {assignment.payment.receivedDate && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Payment Received On</p>
                    <p className="text-base text-gray-900">{formatDate(assignment.payment.receivedDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Assignment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Assigned On</p>
                  <p className="text-base text-gray-900">{formatDate(assignment.createdAt)}</p>
                </div>

                {assignment.validFrom && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Valid From</p>
                    <p className="text-base text-gray-900">{formatDate(assignment.validFrom)}</p>
                  </div>
                )}

                {assignment.validUntil && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Valid Until</p>
                    <p className="text-base text-gray-900">{formatDate(assignment.validUntil)}</p>
                  </div>
                )}

                {assignment.assignedByName && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Assigned By</p>
                    <p className="text-base text-gray-900">{assignment.assignedByName}</p>
                  </div>
                )}

                {assignment.notes && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">{assignment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Package</h3>
              <p className="text-sm text-gray-600">
                This action will send an OTP to the customer's email for confirmation.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSendCancellationOtp}
                disabled={!cancelReason.trim() || sendingOtp}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h3>
              <p className="text-sm text-gray-600">
                We've sent a 6-digit code to<br/>
                <span className="font-semibold text-gray-900">{assignment.userDetails.email}</span>
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && otp.length === 6) {
                    handleVerifyCancellation();
                  }
                }}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP expires in 5 minutes
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyCancellation}
                disabled={otp.length !== 6 || verifyingOtp}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? 'Verifying...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentDetails;
