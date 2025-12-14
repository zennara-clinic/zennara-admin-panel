import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Star rating display component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
      <span className="ml-1.5 text-sm font-semibold text-gray-700">{rating}.0</span>
    </div>
  );
};

// Review type badge
const ReviewTypeBadge = ({ type }) => {
  const typeConfig = {
    'Product': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🛍️' },
    'Consultation': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🩺' },
    'Treatment': { bg: 'bg-green-100', text: 'text-green-700', icon: '💆' },
  };

  const config = typeConfig[type] || typeConfig['Product'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      {type}
    </span>
  );
};

// Approval status badge
const ApprovalBadge = ({ isApproved }) => {
  if (isApproved) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      Pending
    </span>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');

      // Fetch all three types of reviews in parallel
      const [productReviews, consultationReviews, treatmentReviews] = await Promise.all([
        // Product Reviews
        axios.get(`${API_BASE_URL}/api/admin/product-reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { success: false, data: [] } })),
        
        // Consultation Reviews
        axios.get(`${API_BASE_URL}/api/admin/consultation-reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { success: false, data: [] } })),
        
        // Treatment/Package Service Reviews
        axios.get(`${API_BASE_URL}/api/admin/package-service-reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { success: false, data: [] } }))
      ]);

      // Combine and normalize all reviews
      const allReviews = [
        ...(productReviews.data.data || productReviews.data.reviews || []).map(review => ({
          ...review,
          type: 'Product',
          itemName: review.productId?.name || 'Unknown Product',
          userName: review.userId?.fullName || 'Anonymous',
          userEmail: review.userId?.email || '',
          userPhone: review.userId?.phone || '',
          profilePicture: review.userId?.profilePicture || '',
        })),
        ...(consultationReviews.data.data || consultationReviews.data.reviews || []).map(review => ({
          ...review,
          type: 'Consultation',
          itemName: review.consultationId?.name || review.consultationId?.title || 'Medical Consultation',
          userName: review.userId?.fullName || 'Anonymous',
          userEmail: review.userId?.email || '',
          userPhone: review.userId?.phone || '',
          profilePicture: review.userId?.profilePicture || '',
        })),
        ...(treatmentReviews.data.data || treatmentReviews.data.reviews || []).map(review => ({
          ...review,
          type: 'Treatment',
          itemName: review.serviceName || 'Treatment Service',
          userName: review.userId?.fullName || 'Anonymous',
          userEmail: review.userId?.email || '',
          userPhone: review.userId?.phone || '',
          profilePicture: review.userId?.profilePicture || '',
        }))
      ];

      // Sort by creation date (newest first)
      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReviews(allReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId, currentStatus, reviewType) => {
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = '';

      if (reviewType === 'Product') {
        endpoint = `${API_BASE_URL}/api/admin/product-reviews/${reviewId}/approval`;
      } else if (reviewType === 'Consultation') {
        endpoint = `${API_BASE_URL}/api/admin/consultation-reviews/${reviewId}/approval`;
      } else if (reviewType === 'Treatment') {
        endpoint = `${API_BASE_URL}/api/admin/package-service-reviews/${reviewId}/approval`;
      }

      await axios.put(
        endpoint,
        { isApproved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setReviews(reviews.map(review =>
        review._id === reviewId
          ? { ...review, isApproved: !currentStatus }
          : review
      ));
    } catch (err) {
      console.error('Error updating approval status:', err);
      alert('Failed to update approval status');
    }
  };

  const handleDeleteReview = async (reviewId, reviewType) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = '';

      if (reviewType === 'Product') {
        endpoint = `${API_BASE_URL}/api/admin/product-reviews/${reviewId}`;
      } else if (reviewType === 'Consultation') {
        endpoint = `${API_BASE_URL}/api/admin/consultation-reviews/${reviewId}`;
      } else if (reviewType === 'Treatment') {
        endpoint = `${API_BASE_URL}/api/admin/package-service-reviews/${reviewId}`;
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || review.type === typeFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesApproval = 
      approvalFilter === 'all' || 
      (approvalFilter === 'approved' && review.isApproved) ||
      (approvalFilter === 'pending' && !review.isApproved);

    return matchesSearch && matchesType && matchesRating && matchesApproval;
  });

  // Calculate stats
  const stats = {
    total: reviews.length,
    products: reviews.filter(r => r.type === 'Product').length,
    consultations: reviews.filter(r => r.type === 'Consultation').length,
    treatments: reviews.filter(r => r.type === 'Treatment').length,
    approved: reviews.filter(r => r.isApproved).length,
    pending: reviews.filter(r => !r.isApproved).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchAllReviews}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-8">
      {/* Header - Apple Style */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Reviews & Ratings</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">Customer feedback across all services</p>
          </div>
          <button
            onClick={fetchAllReviews}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Apple Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {/* Total Reviews */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>

        {/* Product Reviews */}
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-xl rounded-2xl shadow-sm border border-blue-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Products</p>
          <p className="text-3xl font-bold text-blue-900">{stats.products}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
        </div>

        {/* Consultation Reviews */}
        <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-xl rounded-2xl shadow-sm border border-purple-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">Consultations</p>
          <p className="text-3xl font-bold text-purple-900">{stats.consultations}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"></div>
        </div>

        {/* Treatment Reviews */}
        <div className="group bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-xl rounded-2xl shadow-sm border border-green-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Treatments</p>
          <p className="text-3xl font-bold text-green-900">{stats.treatments}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-green-400 to-green-300 rounded-full"></div>
        </div>

        {/* Approved */}
        <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-xl rounded-2xl shadow-sm border border-emerald-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Approved</p>
          <p className="text-3xl font-bold text-emerald-900">{stats.approved}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"></div>
        </div>

        {/* Pending */}
        <div className="group bg-gradient-to-br from-amber-50 to-amber-100/50 backdrop-blur-xl rounded-2xl shadow-sm border border-amber-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Pending</p>
          <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"></div>
        </div>

        {/* Average Rating */}
        <div className="group bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl shadow-lg p-5 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2">Avg Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.averageRating}</p>
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="mt-3 h-1 w-12 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = stats[`${['one', 'two', 'three', 'four', 'five'][star - 1]}Stars`];
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-16 text-right">{count} ({percentage.toFixed(0)}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters - Apple Style */}
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Search Reviews
            </label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by customer, product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Review Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Product">Products</option>
              <option value="Consultation">Consultations</option>
              <option value="Treatment">Treatments</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Approval Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Status
            </label>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List - Apple Style Cards */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="mt-4 text-lg text-gray-500">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              onMouseEnter={() => setHoveredRow(review._id)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 transition-all duration-300 ${
                hoveredRow === review._id ? 'shadow-xl scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.profilePicture ? (
                      <img
                        src={review.profilePicture}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-gray-200">
                        {review.userName?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>

                  {/* Review Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{review.userName}</h3>
                      <ReviewTypeBadge type={review.type} />
                      <ApprovalBadge isApproved={review.isApproved} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{review.itemName}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                      {review.userEmail && (
                        <>
                          <span>•</span>
                          <span>{review.userEmail}</span>
                        </>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprovalToggle(review._id, review.isApproved, review.type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      review.isApproved
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {review.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id, review.type)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform duration-200 cursor-pointer"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Count */}
              {review.helpfulCount > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{review.helpfulCount} people found this helpful</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
