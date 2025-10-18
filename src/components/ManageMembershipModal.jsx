import { useState, useEffect } from 'react';
import { XIcon, CrownIcon, CheckCircleIcon, AlertCircleIcon, CalendarIcon, CreditCardIcon } from './Icons';
import userService from '../services/userService';

export default function ManageMembershipModal({ isOpen, onClose, onSuccess, patient }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [months, setMonths] = useState('1');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [action, setAction] = useState('assign'); // 'assign', 'extend', 'cancel'

  useEffect(() => {
    console.log('🎭 Modal state changed:', { isOpen, patient });
    if (patient?.memberType === 'Zen Member') {
      setAction('extend');
    } else {
      setAction('assign');
    }
  }, [isOpen, patient]);

  const calculateAmount = () => {
    return 1999 * parseInt(months || 1);
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!months || parseInt(months) < 1) {
      setError('Please enter a valid number of months (minimum 1)');
      return;
    }

    setLoading(true);

    try {
      if (action === 'cancel') {
        // Cancel membership
        const response = await userService.cancelMembership(patient.id);
        if (response.success) {
          setSuccess('Membership cancelled successfully!');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1500);
        } else {
          setError(response.message || 'Failed to cancel membership');
        }
      } else {
        // Assign or extend membership
        const response = await userService.assignMembership(patient.id, {
          months: parseInt(months),
          paymentReceived
        });

        if (response.success) {
          setSuccess(response.message || 'Membership updated successfully!');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1500);
        } else {
          setError(response.message || 'Failed to update membership');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMonths('1');
    setPaymentReceived(false);
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  if (!isOpen || !patient) return null;

  const isZenMember = patient.memberType === 'Zen Member';

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-6">
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors"
              disabled={loading}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <CrownIcon className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Manage Membership</h2>
                <p className="text-sm opacity-90">{patient.name}</p>
              </div>
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

            {/* Current Status */}
            <div className="mb-6 p-5 bg-gray-50 rounded-2xl">
              <p className="text-sm font-semibold text-gray-600 mb-2">Current Status</p>
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  isZenMember 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {patient.memberType || 'Regular Member'}
                </span>
                {isZenMember && patient.zenMembershipExpiryDate && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Expires On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatExpiryDate(patient.zenMembershipExpiryDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAction(isZenMember ? 'extend' : 'assign')}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                    action !== 'cancel'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {isZenMember ? '🔄 Extend' : '✨ Assign'}
                </button>
                {isZenMember && (
                  <button
                    type="button"
                    onClick={() => setAction('cancel')}
                    className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                      action === 'cancel'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>

            {action !== 'cancel' && (
              <form onSubmit={handleSubmit}>
                {/* Number of Months */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Months <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none transition-all"
                      placeholder="Enter months"
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">Minimum 1 month, maximum 12 months</p>
                </div>

                {/* Payment Received */}
                <div className="mb-6">
                  <label className="flex items-start space-x-3 p-5 bg-green-50 rounded-2xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={paymentReceived}
                      onChange={(e) => setPaymentReceived(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCardIcon className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Payment Received</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Mark this if you have received ₹{calculateAmount()} from the patient
                      </p>
                    </div>
                  </label>
                </div>

                {/* Amount Summary */}
                <div className="mb-6 p-5 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-700">₹{calculateAmount()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">₹1,999 × {months} month(s)</p>
                </div>
              </form>
            )}

            {action === 'cancel' && (
              <div className="mb-6 p-5 bg-red-50 rounded-2xl border-2 border-red-200">
                <p className="font-semibold text-red-900 mb-2">⚠️ Warning</p>
                <p className="text-sm text-red-700">
                  This will immediately cancel the Zen Membership and downgrade the user to Regular Member. This action cannot be undone.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-8 py-3 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                action === 'cancel'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                action === 'cancel' ? 'Cancel Membership' : isZenMember ? 'Extend Membership' : 'Assign Membership'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
