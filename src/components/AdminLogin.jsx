import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '../services/adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Check if already authenticated
  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Request OTP
      const response = await adminAuthService.requestOTP(email);
      
      if (response.success) {
        setSuccess('OTP sent successfully! Please check your email.');
        setStep('otp');
        setCountdown(60); // Start 60-second countdown
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Verify OTP
      const response = await adminAuthService.verifyOTP(email, otp);
      
      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload to update auth state
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await adminAuthService.resendOTP(email);
      
      if (response.success) {
        setSuccess('OTP resent successfully!');
        setCountdown(60);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-zennara-pastel-green flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zennara-green via-emerald-700 to-teal-800 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="animate-fade-in">
              <img
                src="https://res.cloudinary.com/dimlozhrx/image/upload/v1760513399/zennara_logo_white_2_zohjug.png"
                alt="Zennara"
                className="h-24 w-auto mx-auto mb-8 drop-shadow-2xl"
              />
            </div>
            
            {/* Title */}
            <div className="space-y-4 animate-slide-in">
              <h1 className="text-5xl font-bold leading-tight">
                Admin Portal
              </h1>
              <p className="text-md text-white/90 font-light">
                Secure access to Zennara's administrative dashboard
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 space-y-4 text-left">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Enhanced Security</h3>
                  <p className="text-sm text-white/80">Two-factor authentication with OTP</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Authorized Access</h3>
                  <p className="text-sm text-white/80">Only verified administrators allowed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Instant Access</h3>
                  <p className="text-sm text-white/80">Quick and seamless login experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <img
              src="https://res.cloudinary.com/dimlozhrx/image/upload/v1760513399/zennara_logo_white_2_zohjug.png"
              alt="Zennara"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-zennara-green to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                {step === 'email' ? 'Welcome Back' : 'Verify Your Identity'}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {step === 'email' 
                  ? 'Enter your authorized email to continue' 
                  : 'Enter the verification code sent to your email'}
              </p>
            </div>

            <div className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl animate-fade-in">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl animate-fade-in">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-emerald-700 text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Email Step */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@zennara.in"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-zennara-green/20 focus:border-zennara-green transition-all text-gray-700 placeholder-gray-400"
                        disabled={loading}
                      />
                    </div>
                    <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-blue-700">
                        Only authorized administrators can access this panel
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-gradient-to-r from-zennara-green to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* OTP Step */}
              {step === 'otp' && (
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      required
                      maxLength="6"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-zennara-green/20 focus:border-zennara-green transition-all text-center text-3xl tracking-[0.5em] font-mono font-bold text-gray-700"
                      disabled={loading}
                      autoFocus
                    />
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Code sent to <span className="font-semibold text-zennara-green">{email}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-zennara-green to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Login
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="text-gray-600 hover:text-zennara-green font-medium text-sm flex items-center gap-1.5 transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Change Email
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading || countdown > 0}
                      className="text-zennara-green hover:text-emerald-700 font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}


            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Zennara Clinic. Secure Admin Access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
