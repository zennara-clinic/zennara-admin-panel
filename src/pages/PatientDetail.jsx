import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CrownIcon,
  CheckCircleIcon,
  ClockIcon,
  LocationIcon,
  StarIcon,
  RefreshIcon,
  XIcon,
  EyeIcon
} from '../components/Icons';
import Avatar from '../components/Avatar';
import userService from '../services/userService';
import PatientDetailSkeleton from '../components/skeletons/PatientDetailSkeleton';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 PatientDetail mounted with ID:', id);
    if (id) {
      fetchPatientDetails();
    } else {
      console.error('❌ No patient ID provided');
      setError('No patient ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching patient details for ID:', id);
      const response = await userService.getUserById(id);
      console.log('📥 Patient details response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Patient data loaded:', response.data);
        setPatient(response.data);
      } else {
        console.error('❌ API returned error:', response);
        setError(response.message || 'Failed to load patient details');
      }
    } catch (err) {
      console.error('❌ Error fetching patient:', err);
      setError(err.message || 'Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleEditPatient = () => {
    // Navigate to edit page or enable edit mode
    navigate(`/patients/edit/${id}`);
  };

  const handleDeletePatient = async () => {
    try {
      setActionLoading(true);
      setError('');
      const response = await userService.deleteUser(id);
      
      if (response.success) {
        setSuccess('Patient deleted successfully. Redirecting...');
        setTimeout(() => {
          navigate('/patients/all');
        }, 1500);
      } else {
        setError(response.message || 'Failed to delete patient');
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete patient');
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      const newStatus = !patient.isActive; // Toggle the status
      const response = await userService.toggleUserStatus(id, newStatus);
      
      if (response.success) {
        setSuccess(`Patient ${newStatus ? 'activated' : 'deactivated'} successfully`);
        // Refresh patient data to show updated status
        await fetchPatientDetails();
        setShowDeactivateModal(false);
      } else {
        setError(response.message || `Failed to ${newStatus ? 'activate' : 'deactivate'} patient`);
        setShowDeactivateModal(false);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setError(err.message || 'Failed to update patient status');
      setShowDeactivateModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  console.log('🎨 Rendering PatientDetail. State:', { loading, error, hasPatient: !!patient, id });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <PatientDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <p className="text-red-600 font-medium mb-4">{error || 'Patient not found'}</p>
          <p className="text-sm text-gray-600 mb-4">Patient ID: {id}</p>
          <button
            onClick={() => navigate('/patients/all')}
            className="px-6 py-3 bg-zennara-green text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const isZenMember = patient.memberType === 'Zen Member';

  return (
    <div className="min-h-screen bg-gray-50 p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/patients/all')}
          className="flex items-center space-x-2 text-gray-600 hover:text-zennara-green font-semibold mb-4 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to All Patients</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Patient Details</h1>
            <p className="text-gray-500 text-base mt-2">Complete patient information and activity</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEditPatient}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25"
              disabled={actionLoading}
            >
              <UserIcon className="w-5 h-5" />
              <span>Edit Patient</span>
            </button>
            
            <button
              onClick={() => setShowDeactivateModal(true)}
              className={`flex items-center space-x-2 px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg ${
                patient.isActive 
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/25' 
                  : 'bg-green-600 hover:bg-green-700 shadow-green-600/25'
              }`}
              disabled={actionLoading}
            >
              <ClockIcon className="w-5 h-5" />
              <span>{patient.isActive ? 'Deactivate' : 'Activate'}</span>
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-600/25"
              disabled={actionLoading}
            >
              <XIcon className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center space-x-3">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <p className="text-green-700 font-semibold">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-3">
          <XIcon className="w-6 h-6 text-red-600" />
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Patient Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <Avatar
              src={patient.profilePhoto}
              name={patient.name}
              size="xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h2>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  isZenMember 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {isZenMember && <CrownIcon className="w-4 h-4 inline mr-1" />}
                  {patient.memberType || 'Regular Member'}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                  {patient.patientId}
                </span>
              </div>
              {isZenMember && patient.zenMembershipExpiryDate && (
                <p className="text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Membership expires: <span className="font-semibold">{formatDate(patient.zenMembershipExpiryDate)}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-zennara-green">{patient.totalVisits || 0}</p>
              <p className="text-sm text-gray-500 font-medium">Total Visits</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">₹{(patient.totalSpent || 0).toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{patient.upcomingAppointments || 0}</p>
              <p className="text-sm text-gray-500 font-medium">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info & Location */}
        <div className="lg:col-span-1 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <UserIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <MailIcon className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{patient.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Phone</label>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{patient.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Date of Birth</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                    {calculateAge(patient.dateOfBirth)} years
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Gender</label>
                <p className="text-gray-900 font-medium">{patient.gender}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Member Since</label>
                <p className="text-gray-900 font-medium">{formatDate(patient.createdAt)}</p>
              </div>

              {patient.isVerified && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Verified Account</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location & Branch */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <LocationIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Location & Branch
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">Preferred Location</label>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-zennara-green" />
                  <p className="text-gray-900 font-bold">{patient.location}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <p className="text-sm font-semibold text-green-900 mb-1">Branch Details</p>
                <p className="text-sm text-green-700">
                  Zennara Clinic - {patient.location}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Mon-Sat: 10:00 AM - 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Appointments & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-zennara-green" />
                Appointments
              </h3>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">
                {patient.totalVisits || 0} Total
              </span>
            </div>

            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No appointments yet</p>
              <button className="mt-4 px-6 py-3 bg-zennara-green text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                Book First Appointment
              </button>
            </div>
          </div>

          {/* Products Purchased */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-2 text-zennara-green" />
                Products Purchased
              </h3>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-bold">
                ₹{(patient.totalSpent || 0).toLocaleString('en-IN')} Total
              </span>
            </div>

            {patient.totalSpent > 0 ? (
              <div className="space-y-4">
                {/* Placeholder for products - you can fetch actual data */}
                <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-zennara-green transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Wellness Package</p>
                        <p className="text-sm text-gray-600 mt-1">Dec 15, 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zennara-green">₹2,499</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Showing recent purchases</p>
                  <button className="mt-4 px-6 py-2 bg-zennara-green text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                    View All Orders
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No products purchased yet</p>
                <button className="mt-4 px-6 py-3 bg-zennara-green text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                  Browse Products
                </button>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="w-6 h-6 mr-2 text-zennara-green" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(patient.createdAt)}</p>
                </div>
              </div>

              {patient.lastLogin && (
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Last Login</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(patient.lastLogin)}</p>
                  </div>
                </div>
              )}

              {isZenMember && patient.zenMembershipStartDate && (
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <CrownIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Became Zen Member</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(patient.zenMembershipStartDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowDeleteModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Patient?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{patient.name}</span>? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePatient}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Deactivate/Activate Confirmation Modal */}
      {showDeactivateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowDeactivateModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  patient.isActive ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <ClockIcon className={`w-8 h-8 ${patient.isActive ? 'text-orange-600' : 'text-green-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {patient.isActive ? 'Deactivate' : 'Activate'} Patient?
                </h3>
                <p className="text-gray-600 mb-6">
                  {patient.isActive ? (
                    <>
                      Are you sure you want to deactivate <span className="font-semibold">{patient.name}</span>? 
                      They will be logged out and won't be able to access their account until reactivated.
                    </>
                  ) : (
                    <>
                      Are you sure you want to activate <span className="font-semibold">{patient.name}</span>? 
                      They will be able to access their account again.
                    </>
                  )}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleUserStatus}
                    className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all ${
                      patient.isActive 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={actionLoading}
                  >
                    {actionLoading 
                      ? (patient.isActive ? 'Deactivating...' : 'Activating...') 
                      : (patient.isActive ? 'Deactivate' : 'Activate')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
