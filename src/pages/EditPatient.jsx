import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
  RefreshIcon,
  CheckCircleIcon,
  XMarkIcon
} from '../components/Icons';
import Avatar from '../components/Avatar';
import userService from '../services/userService';
import branchService from '../services/branchService';
import EditPatientSkeleton from '../components/skeletons/EditPatientSkeleton';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    profilePhoto: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    fetchPatientDetails();
    fetchBranches();
  }, [id]);

  // Debug location state
  useEffect(() => {
    console.log('🔍 Current form location:', formData.location);
    console.log('🔍 Available branches:', branches.length);
  }, [formData.location, branches]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      
      if (response.success && response.data) {
        const patient = response.data;
        console.log('📋 Patient data received:', patient);
        console.log('📍 Patient location:', patient.location);
        
        setFormData({
          name: patient.name || '',
          phone: patient.phone || '',
          email: patient.email || '',
          location: patient.location || '',
          profilePhoto: patient.profilePhoto || ''
        });
        setPreviewImage(patient.profilePhoto);
      } else {
        setError('Failed to load patient details');
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await branchService.getAllBranches();
      console.log('🏢 Branches API response:', response);
      if (response.success && response.data) {
        console.log('🏢 Branches loaded:', response.data);
        console.log('🏢 Branch names:', response.data.map(b => b.name));
        setBranches(response.data);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setRemovePhoto(false);
      };
      reader.readAsDataURL(file);
      
      // Store the file for upload
      setFormData(prev => ({
        ...prev,
        profilePhotoFile: file
      }));
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setRemovePhoto(true);
    setFormData(prev => ({
      ...prev,
      profilePhotoFile: null,
      profilePhoto: ''
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    // Location validation
    if (!formData.location) {
      errors.location = 'Please select a branch';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('fullName', formData.name.trim());
      submitData.append('phone', formData.phone.replace(/\s+/g, ''));
      submitData.append('location', formData.location);
      
      if (formData.profilePhotoFile) {
        submitData.append('profilePicture', formData.profilePhotoFile);
      } else if (removePhoto) {
        submitData.append('removeProfilePicture', 'true');
      }

      const response = await userService.updateUser(id, submitData);
      
      if (response.success) {
        setSuccess('Patient updated successfully!');
        setTimeout(() => {
          navigate(`/patients/records/${id}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to update patient');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <EditPatientSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(`/patients/records/${id}`)}
            className="group flex items-center space-x-2 text-gray-500 hover:text-gray-900 font-medium mb-6 transition-all duration-200"
          >
            <ChevronLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Patient Details</span>
          </button>
          <h1 className="text-5xl font-semibold text-gray-900 tracking-tight mb-3">Edit Patient</h1>
          <p className="text-gray-500 text-lg">Update patient information</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-8 p-5 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl flex items-center space-x-3 shadow-sm animate-fadeIn">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-white" />
            </div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center space-x-3 shadow-sm animate-fadeIn">
            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200/50 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo Upload */}
            <div className="pt-12 pb-10 px-8 bg-gradient-to-b from-gray-50/50 to-transparent border-b border-gray-100">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-zennara-green to-emerald-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                  <div className="relative">
                    <Avatar
                      src={previewImage}
                      name={formData.name}
                      size="2xl"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="absolute -bottom-2 -right-2 bg-zennara-green text-white p-3 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-zennara-green/30 hover:shadow-xl hover:shadow-zennara-green/40"
                    >
                      <UserIcon className="w-5 h-5" />
                    </label>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2.5 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                        title="Remove photo"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      type="file"
                      id="profilePhoto"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="mt-6 text-center space-y-1">
                  <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                  <p className="text-xs text-gray-500">Click the green button to upload a new photo</p>
                  {previewImage && (
                    <p className="text-xs text-gray-400">Click red button to remove</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Name */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-3 transition-colors group-focus-within:text-zennara-green">
                  <UserIcon className="w-4 h-4" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${
                    validationErrors.name
                      ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/10'
                  }`}
                  placeholder="Enter full name"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-2 ml-1 animate-fadeIn">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-3 transition-colors group-focus-within:text-zennara-green">
                  <PhoneIcon className="w-4 h-4" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${
                    validationErrors.phone
                      ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/10'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-2 ml-1 animate-fadeIn">{validationErrors.phone}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-3">
                  <MailIcon className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed"
                    placeholder="Email address"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">Email cannot be changed</p>
              </div>

              {/* Branch/Location */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-3 transition-colors group-focus-within:text-zennara-green">
                  <LocationIcon className="w-4 h-4" />
                  <span>Preferred Branch *</span>
                </label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    disabled={loadingBranches}
                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 appearance-none cursor-pointer ${
                      validationErrors.location
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/10'
                    } ${loadingBranches ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {validationErrors.location && (
                  <p className="text-red-500 text-xs mt-2 ml-1 animate-fadeIn">{validationErrors.location}</p>
                )}
                {loadingBranches && (
                  <p className="text-gray-500 text-xs mt-2 ml-1 flex items-center space-x-2">
                    <RefreshIcon className="w-3 h-3 animate-spin" />
                    <span>Loading branches...</span>
                  </p>
                )}
                {!loadingBranches && formData.location && (
                  <p className="text-zennara-green text-xs mt-2 ml-1 flex items-center space-x-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    <span>Current: {formData.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/patients/records/${id}`)}
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl font-medium transition-all duration-200 border border-gray-200 shadow-sm hover:shadow active:scale-[0.98]"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 bg-zennara-green hover:bg-emerald-600 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-zennara-green/30 hover:shadow-xl hover:shadow-zennara-green/40 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshIcon className="w-5 h-5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
