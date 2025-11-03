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
  const [showServiceCardModal, setShowServiceCardModal] = useState(false);
  const [serviceCardData, setServiceCardData] = useState({
    doctor: '',
    therapist: '',
    manager: '',
    grading: 5,
    notes: ''
  });
  const [savingServiceCard, setSavingServiceCard] = useState(false);
  const [consentStatus, setConsentStatus] = useState({});
  const [showConsentWarningModal, setShowConsentWarningModal] = useState(false);

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
      
      // Check consent status for each service
      const consents = {};
      if (assignmentData.serviceConsents) {
        assignmentData.packageDetails.services.forEach(service => {
          const hasConsent = assignmentData.serviceConsents.has ? 
            assignmentData.serviceConsents.has(service.serviceId) :
            Object.keys(assignmentData.serviceConsents).includes(service.serviceId);
          consents[service.serviceId] = hasConsent;
        });
      }
      setConsentStatus(consents);
      
      setServices(servicesWithStatus);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      setLoading(false);
    }
  };

  const handleCompleteService = (service) => {
    console.log('Complete Service clicked for:', service);
    
    // Check if user has submitted consent for this service
    const serviceId = service.serviceId || service._id;
    const hasConsent = consentStatus[serviceId];
    
    if (!hasConsent) {
      setSelectedService(service);
      setShowConsentWarningModal(true);
      return;
    }
    
    setSelectedService(service);
    // Reset service card data
    setServiceCardData({
      doctor: '',
      therapist: '',
      manager: '',
      grading: 5,
      notes: ''
    });
    setShowServiceCardModal(true);
  };

  const handleSaveServiceCard = async () => {
    // Validate required fields
    if (!serviceCardData.doctor.trim()) {
      alert('Doctor name is required');
      return;
    }
    if (!serviceCardData.manager.trim()) {
      alert('Manager name is required');
      return;
    }
    if (serviceCardData.grading < 0 || serviceCardData.grading > 10) {
      alert('Grading must be between 0 and 10');
      return;
    }

    setSavingServiceCard(true);

    try {
      const token = localStorage.getItem('adminToken');
      const serviceCardPayload = {
        assignmentId: id,
        serviceId: selectedService.serviceId || selectedService._id,
        doctor: serviceCardData.doctor.trim(),
        therapist: serviceCardData.therapist.trim() || undefined,
        manager: serviceCardData.manager.trim(),
        grading: Number(serviceCardData.grading),
        notes: serviceCardData.notes.trim() || undefined
      };

      console.log('Saving service card:', serviceCardPayload);

      await axios.post(
        `${API_BASE_URL}/api/package-assignments/service-card`,
        serviceCardPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Service card saved successfully');
      
      // Close service card modal and send OTP
      setShowServiceCardModal(false);
      await handleSendOtp();
    } catch (error) {
      console.error('Error saving service card:', error);
      alert(error.response?.data?.message || 'Failed to save service card');
    } finally {
      setSavingServiceCard(false);
    }
  };

  const handleSendOtp = async () => {
    setShowOtpModal(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const otpPayload = {
        assignmentId: id,
        serviceId: selectedService.serviceId || selectedService._id,
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
      const errorData = error.response?.data;
      
      if (errorData?.requiresConsent) {
        setShowOtpModal(false);
        setShowConsentWarningModal(true);
      } else {
        alert(errorData?.message || 'Failed to send OTP');
        setShowOtpModal(false);
      }
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
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP. Please try again.';
      alert(errorMessage);
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
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{service.serviceName}</h3>
                        {!service.completed && (
                          consentStatus[service.serviceId] ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Consent Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Consent Required
                            </span>
                          )
                        )}
                      </div>
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

      {/* Service Card Modal - Apple Design */}
      {showServiceCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full" 
               style={{ 
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
               }}>
            
            {/* Content */}
            <div>
              {/* Header with Icon */}
              <div className="bg-gradient-to-b from-white to-white/95 backdrop-blur-xl px-6 pt-6 pb-4 border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Service Card</h3>
                      <p className="text-xs text-gray-500 font-medium">Complete service details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-5">
                {/* Client Info Card */}
                <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-emerald-50/80 rounded-[20px] p-4 border border-emerald-100/50 shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-1">Client</p>
                      <p className="font-semibold text-sm text-gray-900 truncate">{assignment.userDetails.fullName || assignment.userDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-1">ID</p>
                      <p className="font-semibold text-sm text-gray-900">{assignment.userDetails.patientId || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-1">Service</p>
                      <p className="font-semibold text-sm text-gray-900 leading-tight">{selectedService?.serviceName}</p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Doctor */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                      DOCTOR <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceCardData.doctor}
                      onChange={(e) => setServiceCardData({...serviceCardData, doctor: e.target.value})}
                      placeholder="e.g., Dr. Spoorthy"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* Therapist */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                      THERAPIST <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={serviceCardData.therapist}
                      onChange={(e) => setServiceCardData({...serviceCardData, therapist: e.target.value})}
                      placeholder="Enter therapist name"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* Manager */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                      MANAGER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceCardData.manager}
                      onChange={(e) => setServiceCardData({...serviceCardData, manager: e.target.value})}
                      placeholder="e.g., Irans"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* Grading - Apple Style */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                      RELIEF GRADING <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[20px] p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-600">No Relief</span>
                        <div className="px-4 py-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
                          <span className="text-2xl font-bold text-white tabular-nums">{serviceCardData.grading}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Complete</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={serviceCardData.grading}
                        onChange={(e) => setServiceCardData({...serviceCardData, grading: e.target.value})}
                        className="w-full h-2 bg-gradient-to-r from-gray-300 via-emerald-400 to-emerald-600 rounded-full appearance-none cursor-pointer accent-emerald-600 slider-thumb"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${serviceCardData.grading * 10}%, #e5e7eb ${serviceCardData.grading * 10}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-2 px-1">
                        {[0, 2, 4, 6, 8, 10].map(num => (
                          <span key={num} className={`text-[10px] font-semibold ${Number(serviceCardData.grading) === num ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                      NOTES <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={serviceCardData.notes}
                      onChange={(e) => setServiceCardData({...serviceCardData, notes: e.target.value})}
                      placeholder="Add any additional notes..."
                      rows="2"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-xl px-6 py-4 border-t border-gray-100 rounded-b-3xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowServiceCardModal(false);
                      setServiceCardData({
                        doctor: '',
                        therapist: '',
                        manager: '',
                        grading: 5,
                        notes: ''
                      });
                    }}
                    disabled={savingServiceCard}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveServiceCard}
                    disabled={savingServiceCard}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/30"
                  >
                    {savingServiceCard ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </span>
                    ) : 'Save & Send OTP'}
                  </button>
                </div>
              </div>
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

      {/* Consent Warning Modal */}
      {showConsentWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header with Warning Icon */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Patient Consent Required</h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-gray-700 mb-4 leading-relaxed">
                The patient must complete the consent form on their mobile app before this service can be marked complete.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Please ask the patient to:</p>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span>Open Zennara mobile app</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span>Go to <strong>Forms → Package Service Consent</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span>Select this package</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">4</span>
                    <span>Fill consent for this service</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Once consent is submitted, you can proceed with service completion.</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowConsentWarningModal(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                OK, I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageProgress;
