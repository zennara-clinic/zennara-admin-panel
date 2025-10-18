import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function AssignPackageForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    userId: '',
    selectedUser: null,
    packageId: '',
    selectedPackage: null,
    discountPercentage: 0,
    isZenMemberDiscount: false,
    paymentReceived: false,
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  // Generate unique transaction ID
  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN${timestamp}${random}`;
  };

  useEffect(() => {
    fetchUsers();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        (user.patientId && user.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 } // Get all users for the dropdown
      });
      const userData = response.data.data?.users || response.data.users || [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📦 Packages API Response:', response.data);
      
      // API returns: { success, count, data: packages }
      const packagesData = response.data.data || [];
      console.log('📦 Packages Data:', packagesData);
      console.log('📦 Total Packages:', packagesData.length);
      
      setPackages(packagesData);
    } catch (error) {
      console.error('❌ Error fetching packages:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleUserSelect = (user) => {
    const defaultDiscount = user.memberType === 'Zen Member' ? 5 : 0;
    setFormData({
      ...formData,
      userId: user.id, // Use user.id which is the MongoDB _id
      selectedUser: user,
      discountPercentage: defaultDiscount,
      isZenMemberDiscount: user.memberType === 'Zen Member'
    });
  };

  const handlePackageSelect = (pkg) => {
    setFormData({
      ...formData,
      packageId: pkg._id,
      selectedPackage: pkg
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateFinalAmount = () => {
    if (!formData.selectedPackage) return 0;
    const originalAmount = formData.selectedPackage.price;
    const discountAmount = (originalAmount * formData.discountPercentage) / 100;
    return originalAmount - discountAmount;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const assignmentResponse = await axios.post(
        `${API_BASE_URL}/api/package-assignments`,
        {
          userId: formData.userId,
          packageId: formData.packageId,
          discountPercentage: formData.discountPercentage,
          isZenMemberDiscount: formData.isZenMemberDiscount,
          paymentReceived: formData.paymentReceived,
          paymentMethod: formData.paymentMethod || null,
          transactionId: formData.transactionId || null,
          notes: formData.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (formData.paymentReceived && paymentProofFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('proof', paymentProofFile);

        await axios.post(
          `${API_BASE_URL}/api/package-assignments/${assignmentResponse.data.data._id}/payment-proof`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      navigate('/consultations/assign-packages');
    } catch (error) {
      console.error('Error assigning package:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.userId) {
      return;
    }
    if (currentStep === 2 && !formData.packageId) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assign Package</h1>
              <p className="text-sm text-gray-500 mt-1">Follow the steps to assign a package to a customer</p>
            </div>
            <button
              onClick={() => navigate('/consultations/assign-packages')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center relative">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-zennara-green to-emerald-600 border-zennara-green text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step < currentStep ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-lg font-bold">{step}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${step <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step === 1 && 'Select User'}
                      {step === 2 && 'Select Package'}
                      {step === 3 && 'Confirm & Pay'}
                    </p>
                  </div>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    step < currentStep ? 'bg-zennara-green' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Step 1: Select User */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Customer</h2>
                <p className="text-sm text-gray-500">Search and select the customer to assign the package to</p>
              </div>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or patient ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        formData.userId === user.id
                          ? 'border-zennara-green bg-green-50'
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              {user.memberType === 'Zen Member' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  Zen Member
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">{user.phone}</span>
                              {user.patientId && (
                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {user.patientId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {formData.userId === user._id && (
                          <svg className="w-6 h-6 text-zennara-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {formData.selectedUser && formData.selectedUser.memberType === 'Zen Member' && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-purple-900">Zen Member Discount</h3>
                        <p className="text-xs text-purple-600 mt-0.5">Special pricing for premium members</p>
                      </div>
                    </div>
                    
                    {/* Apple-style Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        discountPercentage: formData.discountPercentage > 0 ? 0 : 5
                      })}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        formData.discountPercentage > 0
                          ? 'bg-purple-600 shadow-sm'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          formData.discountPercentage > 0 ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.discountPercentage > 0 && (
                    <div className="space-y-4 pt-4 border-t border-purple-200 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-purple-900">
                          Discount Amount
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-purple-600">{formData.discountPercentage}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={formData.discountPercentage}
                          onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                          className="w-full h-2 bg-purple-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                          style={{
                            background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${formData.discountPercentage * 2}%, rgb(233, 213, 255) ${formData.discountPercentage * 2}%, rgb(233, 213, 255) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-purple-600 font-medium">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-700 font-medium">Quick Select:</span>
                          <div className="flex space-x-2">
                            {[5, 10, 15, 20, 25].map((percent) => (
                              <button
                                key={percent}
                                type="button"
                                onClick={() => setFormData({ ...formData, discountPercentage: percent })}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  formData.discountPercentage === percent
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                                }`}
                              >
                                {percent}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Package */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Package</h2>
                <p className="text-sm text-gray-500">Choose the package to assign to {formData.selectedUser?.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.length === 0 ? (
                  <div className="col-span-2 text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Packages Available</h3>
                    <p className="text-sm text-gray-500 mb-4">Create a package first before assigning it to customers</p>
                    <button
                      onClick={() => window.open('/consultations/packages/add', '_blank')}
                      className="inline-flex items-center px-4 py-2 bg-zennara-green text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Package
                    </button>
                  </div>
                ) : (
                  packages.map((pkg) => (
                    <div
                      key={pkg._id}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`relative p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                        formData.packageId === pkg._id
                          ? 'border-zennara-green bg-green-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {pkg.image && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <img src={pkg.image} alt={pkg.name} className="w-full h-32 object-cover" />
                        </div>
                      )}
                      
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(pkg.price)}</p>
                        </div>
                        {formData.packageId === pkg._id && (
                          <div className="w-8 h-8 bg-zennara-green rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Summary & Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Assignment</h2>
                <p className="text-sm text-gray-500">Review the details and confirm payment</p>
              </div>

              <div className="bg-gradient-to-br from-zennara-green to-emerald-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Assignment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Customer</p>
                      <p className="font-semibold text-lg">{formData.selectedUser?.name}</p>
                      <p className="text-sm opacity-75">{formData.selectedUser?.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-sm opacity-90">Package</p>
                    <p className="font-semibold text-lg">{formData.selectedPackage?.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Package Price</span>
                  <span className="font-semibold">{formatCurrency(formData.selectedPackage?.price || 0)}</span>
                </div>
                {formData.discountPercentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({formData.discountPercentage}%)</span>
                    <span className="font-semibold">
                      - {formatCurrency((formData.selectedPackage?.price || 0) * formData.discountPercentage / 100)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900">
                  <span className="text-lg font-bold">Final Amount</span>
                  <span className="text-2xl font-bold text-zennara-green">{formatCurrency(calculateFinalAmount())}</span>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.paymentReceived}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData({ 
                        ...formData, 
                        paymentReceived: isChecked,
                        transactionId: isChecked ? generateTransactionId() : ''
                      });
                    }}
                    className="w-5 h-5 text-zennara-green border-gray-300 rounded focus:ring-zennara-green"
                  />
                  <span className="text-base font-semibold text-gray-900">Did we receive the payment?</span>
                </label>

                {formData.paymentReceived && (
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green outline-none"
                        >
                          <option value="">Select method</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transaction ID
                          <span className="ml-2 text-xs text-gray-500">(Auto-generated, editable)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.transactionId}
                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            placeholder="Auto-generated"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, transactionId: generateTransactionId() })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-zennara-green transition-colors"
                            title="Generate new ID"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Proof <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none cursor-pointer hover:border-zennara-green transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zennara-green file:text-white hover:file:bg-emerald-600 file:cursor-pointer"
                        />
                      </div>
                      {previewUrl && (
                        <div className="mt-4 relative inline-block">
                          <img src={previewUrl} alt="Preview" className="h-32 rounded-xl object-cover border-2 border-zennara-green shadow-sm" />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-zennara-green to-emerald-600 text-white rounded-full p-1.5 shadow-md">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {!previewUrl && formData.paymentReceived && (
                        <div className="mt-3 flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-red-800">Payment proof required</p>
                            <p className="text-xs text-red-600 mt-0.5">Please upload proof of payment to proceed</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={previousStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            Previous
          </button>
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Continue
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.paymentReceived || !paymentProofFile}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  loading || !formData.paymentReceived || !paymentProofFile
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {loading ? 'Assigning...' : 'Assign Package'}
              </button>
              {(!formData.paymentReceived || !paymentProofFile) && (
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-red-600">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    {!formData.paymentReceived 
                      ? 'Please confirm payment received'
                      : 'Please upload payment proof'
                    }
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
