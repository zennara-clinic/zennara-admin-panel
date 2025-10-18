import { useState } from 'react';
import { XIcon, UserIcon, MailIcon, PhoneIcon, CalendarIcon, MapPinIcon, UsersIcon, CheckCircleIcon, AlertCircleIcon, MaleIcon, FemaleIcon, LockIcon, ChevronDownIcon } from './Icons';
import userService from '../services/userService';

const LOCATIONS = [
  'Jubilee Hills',
  'Financial District',
  'Kondapur',
];

const GENDERS = [
  { value: 'Male', label: 'Male', Icon: MaleIcon, color: 'blue' },
  { value: 'Female', label: 'Female', Icon: FemaleIcon, color: 'pink' },
  { value: 'Other', label: 'Other', Icon: UsersIcon, color: 'purple' },
  { value: 'Prefer not to say', label: 'Prefer not to say', Icon: LockIcon, color: 'gray' }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MEMBER_TYPES = [
  { value: 'Zen Member', label: 'Zen Member', badge: 'Premium', color: 'purple' },
  { value: 'Regular Member', label: 'Regular Member', badge: 'Standard', color: 'gray' }
];

export default function AddPatientModal({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    memberType: 'Regular Member'
  });

  // Date picker state
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Helper function to get days in a month
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, parseInt(month) + 1, 0).getDate();
  };

  // Update dateOfBirth when day, month, or year changes
  const updateDateOfBirth = (day, month, year) => {
    if (day && month !== '' && year) {
      const formattedDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.fullName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      setError('Name can only contain letters and spaces');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }
    if (!/^[6-9]/.test(phoneDigits)) {
      setError('Phone number must start with 6, 7, 8, or 9');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.location) {
      setError('Please select a location');
      return false;
    }
    if (!formData.gender) {
      setError('Please select gender');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Please select date of birth');
      return false;
    }

    // Validate age (must be at least 13 years old)
    const dobDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;
    
    if (actualAge < 13) {
      setError('Patient must be at least 13 years old');
      return false;
    }
    if (actualAge > 120) {
      setError('Please enter a valid date of birth');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setError('');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      const response = await userService.createUser({
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        location: formData.location,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        memberType: formData.memberType
      });

      if (response.success) {
        setSuccess('Patient created successfully!');
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess(response.data);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create patient');
      }
    } catch (err) {
      setError(err.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      dateOfBirth: '',
      gender: '',
      memberType: 'Regular Member'
    });
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    setCurrentStep(1);
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-zennara-green to-emerald-600 text-white px-8 py-6">
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors"
              disabled={loading}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Add New Patient</h2>
                <p className="text-sm opacity-90">Create a new patient record manually</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-2 mt-6">
              <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            </div>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Success!</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start space-x-3">
                <AlertCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h3>
                    <p className="text-sm text-gray-500 mb-6">Enter the patient's personal details</p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 placeholder-gray-400 focus:border-zennara-green focus:bg-white focus:outline-none transition-all"
                        placeholder="Enter full name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 placeholder-gray-400 focus:border-zennara-green focus:bg-white focus:outline-none transition-all"
                        placeholder="patient@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        maxLength="10"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 placeholder-gray-400 focus:border-zennara-green focus:bg-white focus:outline-none transition-all"
                        placeholder="9876543210"
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">10-digit mobile number</p>
                  </div>
                </div>
              )}

              {/* Step 2: Additional Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Additional Details</h3>
                    <p className="text-sm text-gray-500 mb-6">Complete the patient profile</p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Location <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => updateFormData('location', loc)}
                          className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                            formData.location === loc
                              ? 'border-zennara-green bg-zennara-green/5 text-zennara-green'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                          disabled={loading}
                        >
                          <MapPinIcon className="w-5 h-5 mx-auto mb-2" />
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {GENDERS.map((g) => {
                        const IconComponent = g.Icon;
                        const isSelected = formData.gender === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => updateFormData('gender', g.value)}
                            className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm text-left flex items-center space-x-3 ${
                              isSelected
                                ? 'border-zennara-green bg-zennara-green/5 text-zennara-green'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                            disabled={loading}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-zennara-green text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span>{g.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Day Dropdown */}
                      <div className="relative">
                        <select
                          value={selectedDay}
                          onChange={(e) => {
                            setSelectedDay(e.target.value);
                            updateDateOfBirth(e.target.value, selectedMonth, selectedYear);
                          }}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 focus:border-zennara-green focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                          disabled={loading}
                        >
                          <option value="">Day</option>
                          {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      {/* Month Dropdown */}
                      <div className="relative">
                        <select
                          value={selectedMonth}
                          onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            // Reset day if it's invalid for the selected month
                            if (selectedDay && selectedYear) {
                              const maxDays = getDaysInMonth(e.target.value, selectedYear);
                              if (parseInt(selectedDay) > maxDays) {
                                setSelectedDay('');
                              } else {
                                updateDateOfBirth(selectedDay, e.target.value, selectedYear);
                              }
                            }
                          }}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 focus:border-zennara-green focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                          disabled={loading}
                        >
                          <option value="">Month</option>
                          {MONTHS.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      {/* Year Dropdown */}
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            setSelectedYear(e.target.value);
                            // Reset day if it's invalid for the selected year (leap year check)
                            if (selectedDay && selectedMonth !== '') {
                              const maxDays = getDaysInMonth(selectedMonth, e.target.value);
                              if (parseInt(selectedDay) > maxDays) {
                                setSelectedDay('');
                              } else {
                                updateDateOfBirth(selectedDay, selectedMonth, e.target.value);
                              }
                            }
                          }}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 focus:border-zennara-green focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                          disabled={loading}
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 13 - i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    {formData.dateOfBirth && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected: {new Date(formData.dateOfBirth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>

                  {/* Member Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {MEMBER_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateFormData('memberType', type.value)}
                          className={`p-5 rounded-xl border-2 transition-all text-left ${
                            formData.memberType === type.value
                              ? 'border-zennara-green bg-zennara-green/5'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          disabled={loading}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <UsersIcon className={`w-5 h-5 ${formData.memberType === type.value ? 'text-zennara-green' : 'text-gray-400'}`} />
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              type.color === 'purple' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {type.badge}
                            </span>
                          </div>
                          <p className={`font-semibold ${formData.memberType === type.value ? 'text-zennara-green' : 'text-gray-900'}`}>
                            {type.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Step {currentStep} of 2
            </div>
            <div className="flex items-center space-x-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-zennara-green hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-zennara-green/25"
                  disabled={loading}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-zennara-green hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-zennara-green/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating...</span>
                    </span>
                  ) : (
                    'Create Patient'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
