import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  LocationIcon,
  FilterIcon,
  SearchIcon
} from '../components/Icons';

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  const itemsPerPage = 10;

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!dateFilter) return false;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return dateStr === dateFilter;
  };

  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setDateFilter(`${year}-${month}-${dayStr}`);
    setShowDatePicker(false);
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, locationFilter, searchQuery, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/branches?activeOnly=true`);
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (locationFilter !== 'all') params.append('location', locationFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (dateFilter) params.append('date', dateFilter);

      const response = await axios.get(`${API_BASE_URL}/api/bookings/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get all bookings (including Awaiting Confirmation for stats)
      let allBookings = response.data.data || [];

      // If filtering by Confirmed, also include Rescheduled bookings
      if (statusFilter === 'Confirmed') {
        allBookings = allBookings.filter(
          booking => booking.status === 'Confirmed' || booking.status === 'Rescheduled'
        );
      }
      
      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Confirmed': 'bg-green-50 text-green-700 border-green-200',
      'Rescheduled': 'bg-blue-50 text-blue-700 border-blue-200',
      'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
      'Completed': 'bg-gray-50 text-gray-700 border-gray-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
      'No Show': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (slots) => {
    return Array.isArray(slots) ? slots[0] : slots;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter out "Awaiting Confirmation" for table display only (keep them for stats)
  const displayBookings = bookings.filter(b => b.status !== 'Awaiting Confirmation');
  
  // Stats - Include Rescheduled in Confirmed count
  const stats = [
    {
      title: 'Total Bookings',
      value: displayBookings.length,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Confirmed',
      value: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Rescheduled').length,
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Confirmation',
      value: bookings.filter(b => b.status === 'Awaiting Confirmation').length,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Cancelled',
      value: bookings.filter(b => b.status === 'Cancelled').length,
      icon: CalendarIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Completed',
      value: bookings.filter(b => b.status === 'Completed').length,
      icon: CalendarIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Rescheduled',
      value: bookings.filter(b => b.status === 'Rescheduled').length,
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];
  
  // Pagination
  const totalPages = Math.ceil(displayBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = displayBookings.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Bookings</h1>
        <p className="text-gray-500 text-base">View confirmed and completed bookings</p>
      </div>

      {/* Info Banner - Link to Pending Confirmations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <ClockIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Looking for bookings awaiting confirmation?</p>
            <p className="text-sm text-gray-600">Pending confirmations are managed on a separate page for better organization.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/bookings/pending')}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
        >
          View Pending Confirmations
        </button>
      </div>

      {/* Stats Cards - 6 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border-2 border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-zennara-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FilterIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filter Bookings</h3>
              <p className="text-xs text-gray-500">Find exactly what you're looking for</p>
            </div>
          </div>
          <button
            onClick={() => {
              setStatusFilter('all');
              setLocationFilter('all');
              setSearchQuery('');
              setDateFilter('');
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative group">
            <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Search Bookings</label>
            <SearchIcon className="absolute left-4 top-[38px] w-5 h-5 text-gray-400 group-focus-within:text-zennara-green transition-colors" />
            <input
              type="text"
              placeholder="Name, email, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all text-sm font-medium placeholder-gray-400 shadow-sm hover:border-gray-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Status</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-zennara-green"></div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-8 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all text-sm font-semibold text-gray-700 appearance-none cursor-pointer shadow-sm hover:border-gray-300"
              >
                <option value="all">All Status</option>
                <option value="Confirmed">✓ Confirmed</option>
                <option value="Rescheduled">↻ Rescheduled</option>
                <option value="In Progress">⏳ In Progress</option>
                <option value="Completed">✔ Completed</option>
                <option value="Cancelled">✕ Cancelled</option>
                <option value="No Show">⚠ No Show</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Location</label>
            <div className="relative">
              <LocationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all text-sm font-semibold text-gray-700 appearance-none cursor-pointer shadow-sm hover:border-gray-300"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location._id} value={location.name}>
                    📍 {location.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Filter with Beautiful Calendar Picker */}
          <div className="relative" ref={datePickerRef}>
            <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Date</label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all text-sm font-semibold text-gray-700 text-left shadow-sm hover:border-gray-300 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-zennara-green transition-colors" />
                <span className="group-hover:text-gray-900 transition-colors">
                  {dateFilter ? new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                </span>
              </div>
              {dateFilter && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter('');
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>

            {/* Beautiful Calendar Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 z-50 w-[340px] overflow-hidden">
                {/* Calendar Header */}
                <div className="bg-gradient-to-r from-zennara-green to-emerald-600 px-6 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-bold text-white">{formatMonthYear(currentMonth)}</h3>
                    <button
                      onClick={() => changeMonth(1)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Calendar Body */}
                <div className="p-4">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center py-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                      const days = [];
                      
                      // Empty cells for days before month starts
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="aspect-square" />
                        );
                      }
                      
                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day);
                        const today = isToday(date);
                        const selected = isSelected(date);
                        
                        days.push(
                          <button
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            className={`
                              aspect-square rounded-xl text-sm font-semibold transition-all relative
                              ${
                                selected
                                  ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white shadow-lg scale-105'
                                  : today
                                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-300 hover:bg-blue-100'
                                  : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                              }
                            `}
                          >
                            {day}
                            {today && !selected && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                            )}
                          </button>
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                </div>

                {/* Calendar Footer */}
                <div className="px-4 pb-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setDateFilter(new Date().toISOString().split('T')[0]);
                      setCurrentMonth(new Date());
                      setShowDatePicker(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      setDateFilter('');
                      setShowDatePicker(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || statusFilter !== 'all' || locationFilter !== 'all' || dateFilter) && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-blue-900">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-200">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('all')} className="ml-2 hover:text-green-900">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {locationFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200">
                  Location: {locationFilter}
                  <button onClick={() => setLocationFilter('all')} className="ml-2 hover:text-purple-900">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {dateFilter && (
                <span className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold border border-orange-200">
                  Date: {new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <button onClick={() => setDateFilter('')} className="ml-2 hover:text-orange-900">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {currentBookings.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || locationFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Bookings will appear here once customers make reservations'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reference & Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Treatment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((booking) => (
                  <tr 
                    key={booking._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {booking.referenceNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {booking.consultationId?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.consultationId?.category || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(booking.confirmedDate || booking.preferredDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.confirmedTime || formatTime(booking.preferredTimeSlots)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <LocationIcon className="w-4 h-4 mr-1" />
                        {booking.preferredLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bookings/${booking._id}`);
                        }}
                        className="text-zennara-green hover:text-emerald-700 font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(endIndex, bookings.length)}</span> of <span className="font-bold text-gray-900">{bookings.length}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
