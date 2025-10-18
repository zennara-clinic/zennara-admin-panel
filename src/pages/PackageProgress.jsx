import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

function PackageProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState('');
  const [uploadingPrescription, setUploadingPrescription] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/package-assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const assignmentData = response.data.data;
      setAssignment(assignmentData);
      
      // Initialize services with completion status
      const servicesWithStatus = assignmentData.packageDetails.services.map(service => ({
        ...service,
        completed: assignmentData.completedServices?.some(cs => cs.serviceId === service.serviceId) || false,
        completedAt: assignmentData.completedServices?.find(cs => cs.serviceId === service.serviceId)?.completedAt,
        prescriptions: assignmentData.completedServices?.find(cs => cs.serviceId === service.serviceId)?.prescriptions || []
      }));
      
      setServices(servicesWithStatus);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      setLoading(false);
    }
  };

  const handleCompleteService = async (service) => {
    console.log('Complete Service clicked for:', service);
    console.log('Service ID:', service.serviceId || service._id);
    console.log('Assignment user ID:', assignment.userId);
    
    setSelectedService(service);
    setShowOtpModal(true);
    
    // Send OTP to user's email
    try {
      const token = localStorage.getItem('adminToken');
      const otpPayload = {
        assignmentId: id,
        serviceId: service.serviceId || service._id,
        userId: assignment.userId
      };
      
      console.log('Sending OTP with payload:', otpPayload);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/package-assignments/send-otp`,
        otpPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('OTP sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending OTP:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      console.log('Invalid OTP length:', otp.length);
      return;
    }
    
    console.log('Verifying OTP:', otp);
    setOtpLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const serviceIdentifier = selectedService.serviceId || selectedService._id;
      
      console.log('Verify OTP payload:', {
        assignmentId: id,
        serviceId: serviceIdentifier,
        otp: otp
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/api/package-assignments/verify-otp`,
        {
          assignmentId: id,
          serviceId: serviceIdentifier,
          otp: otp
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('OTP verification response:', response.data);
      
      if (response.data.success) {
        console.log('OTP verified successfully, marking service as completed');
        
        // Mark service as completed
        setServices(services.map(s => {
          const currentServiceId = s.serviceId || s._id;
          return currentServiceId === serviceIdentifier 
            ? { ...s, completed: true, completedAt: new Date().toISOString() }
            : s;
        }));
        
        setShowOtpModal(false);
        setOtp('');
        // Prescription modal will not auto-open - user can click "Upload Prescription" button when ready
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
      setPrescriptionPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitPrescription = async () => {
    if (!prescriptionFile) {
      console.log('No prescription file selected');
      return;
    }
    
    console.log('Starting prescription upload for service:', selectedService?.serviceName);
    setUploadingPrescription(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('media', prescriptionFile); // Changed from 'files' to 'media'
      
      console.log('Uploading to cloudinary...');
      // Upload to cloudinary
      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      console.log('Upload result:', uploadResult);
      
      if (uploadResult.success && uploadResult.data && uploadResult.data.length > 0) {
        const prescriptionUrl = uploadResult.data[0].url;
        console.log('Prescription uploaded successfully:', prescriptionUrl);
        console.log('Saving to assignment...');
        
        // Save prescription to assignment
        const serviceIdentifier = selectedService.serviceId || selectedService._id;
        console.log('Service identifier:', serviceIdentifier);
        
        const saveResponse = await axios.post(
          `${API_BASE_URL}/api/package-assignments/${id}/prescription`,
          {
            serviceId: serviceIdentifier,
            prescriptionUrl: prescriptionUrl
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('Save response:', saveResponse.data);
        
        // Update local state
        setServices(services.map(s => {
          const currentServiceId = s.serviceId || s._id;
          return currentServiceId === serviceIdentifier 
            ? { ...s, prescriptions: [...(s.prescriptions || []), prescriptionUrl] }
            : s;
        }));
        
        console.log('Prescription uploaded and saved successfully!');
        setShowPrescriptionModal(false);
        setPrescriptionFile(null);
        setPrescriptionPreview('');
      } else {
        console.error('Upload failed:', uploadResult.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error uploading prescription:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setUploadingPrescription(false);
    }
  };

  const getCompletionPercentage = () => {
    if (services.length === 0) return 0;
    const completed = services.filter(s => s.completed).length;
    return Math.round((completed / services.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zennara-green mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h3>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/consultations/assign-packages/${id}`)}
            className="inline-flex items-center text-gray-600 hover:text-zennara-green transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Details</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Package Progress</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {assignment.userDetails.fullName || assignment.userDetails.name} • {assignment.packageDetails.packageName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-zennara-green">{getCompletionPercentage()}%</div>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-zennara-green to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {services.filter(s => s.completed).length} of {services.length} services completed
              </span>
              <span className="text-gray-500 font-mono text-xs">{assignment.assignmentId}</span>
            </div>
          </div>
        </div>

        {/* Services Checklist */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <div 
              key={service.serviceId}
              className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                service.completed 
                  ? 'border-zennara-green bg-green-50/30' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Checkbox/Status Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      service.completed 
                        ? 'bg-gradient-to-br from-zennara-green to-emerald-600' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      {service.completed ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{index + 1}</span>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.serviceName}</h3>
                      {service.completed && service.completedAt && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Completed on {new Date(service.completedAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {!service.completed ? (
                      <button
                        onClick={() => handleCompleteService(service)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Complete Service</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setShowPrescriptionModal(true);
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Upload Prescription</span>
                        </button>
                        
                        {service.prescriptions && service.prescriptions.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <span>{service.prescriptions.length} file(s)</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Prescriptions Display */}
                {service.completed && service.prescriptions && service.prescriptions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Prescriptions:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {service.prescriptions.map((url, idx) => (
                        <div key={idx} className="relative group cursor-pointer" onClick={() => window.open(url, '_blank')}>
                          <img 
                            src={url} 
                            alt={`Prescription ${idx + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-zennara-green transition-colors"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
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
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || otpLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Prescription</h3>
              <button
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setPrescriptionFile(null);
                  setPrescriptionPreview('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Prescription Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePrescriptionUpload}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:border-purple-500 outline-none cursor-pointer hover:border-purple-500 transition-colors"
              />
            </div>

            {prescriptionPreview && (
              <div className="mb-6">
                <img 
                  src={prescriptionPreview} 
                  alt="Prescription Preview" 
                  className="w-full h-64 object-contain rounded-xl border-2 border-gray-200"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setPrescriptionFile(null);
                  setPrescriptionPreview('');
                }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPrescription}
                disabled={!prescriptionFile || uploadingPrescription}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPrescription ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageProgress;
