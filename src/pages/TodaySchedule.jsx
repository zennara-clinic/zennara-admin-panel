import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  LocationIcon,
  PhoneIcon,
  MailIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../components/Icons';

export default function TodaySchedule() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchBookingsForDate(selectedDate);
  }, [selectedDate]);

  // Auto-refresh bookings every 30 seconds to catch automatic status changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookingsForDate(selectedDate);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Helper function to format date without timezone issues
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchBookingsForDate = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const dateStr = formatDateString(date);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter bookings where confirmedDate matches selected date
      const filteredBookings = (response.data.data || []).filter(booking => {
        if (!booking.confirmedDate) return false;
        const confirmedDate = formatDateString(new Date(booking.confirmedDate));
        return confirmedDate === dateStr && booking.status !== 'Awaiting Confirmation';
      });

      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'bg-amber-500',
      'Confirmed': 'bg-emerald-500',
      'Rescheduled': 'bg-blue-500',
      'In Progress': 'bg-violet-500',
      'Completed': 'bg-slate-500',
      'Cancelled': 'bg-red-500',
      'No Show': 'bg-orange-500'
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'bg-yellow-50',
      'Confirmed': 'bg-green-50',
      'Rescheduled': 'bg-blue-50',
      'In Progress': 'bg-purple-50',
      'Completed': 'bg-gray-50',
      'Cancelled': 'bg-red-50',
      'No Show': 'bg-orange-50'
    };
    return colors[status] || 'bg-gray-50';
  };

  const getStatusTextColor = (status) => {
    const colors = {
      'Awaiting Confirmation': 'text-yellow-700',
      'Confirmed': 'text-green-700',
      'Rescheduled': 'text-blue-700',
      'In Progress': 'text-purple-700',
      'Completed': 'text-gray-700',
      'Cancelled': 'text-red-700',
      'No Show': 'text-orange-700'
    };
    return colors[status] || 'text-gray-700';
  };

  const formatTime = (slots) => {
    return Array.isArray(slots) ? slots[0] : slots;
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, firstDay, lastDay };
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() && 
           currentMonth.getMonth() === selectedDate.getMonth() && 
           currentMonth.getFullYear() === selectedDate.getFullYear();
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateClick = (day) => {
    if (!isPastDate(day)) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(newDate);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getSelectedDateDisplay = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Time slots from 10 AM to 7 PM
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM'
  ];

  // Define filteredBookings first
  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : selectedStatus === 'Confirmed'
      ? bookings.filter(b => b.status === 'Confirmed' || b.status === 'Rescheduled')
      : bookings.filter(b => b.status === selectedStatus);

  const statusCounts = {
    all: bookings.length,
    'Awaiting Confirmation': bookings.filter(b => b.status === 'Awaiting Confirmation').length,
    'Confirmed': bookings.filter(b => b.status === 'Confirmed' || b.status === 'Rescheduled').length,
    'In Progress': bookings.filter(b => b.status === 'In Progress').length,
    'Completed': bookings.filter(b => b.status === 'Completed').length,
  };

  // Now define function that uses filteredBookings
  const getBookingsForTimeSlot = (timeSlot) => {
    return filteredBookings.filter(booking => {
      const bookingTime = booking.confirmedTime || formatTime(booking.preferredTimeSlots);
      return bookingTime === timeSlot;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/bookings')}
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-zennara-green mb-6 transition-all duration-200 hover:translate-x-1"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to All Bookings</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-zennara-green/10 to-emerald-100 rounded-2xl">
                  <CalendarIcon className="w-8 h-8 text-zennara-green" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Today's Schedule
                  </h1>
                  <p className="text-lg text-slate-600 font-medium mt-1">
                    {getSelectedDateDisplay()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-6 shadow-xl shadow-slate-200/50">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-zennara-green to-emerald-600 bg-clip-text text-transparent">
                    {bookings.length}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 mt-1">
                    Total Appointments
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-6 shadow-xl shadow-slate-200/50">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    {statusCounts['Confirmed']}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 mt-1">
                    Confirmed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Sidebar - Calendar Widget */}
          <div className="xl:col-span-1">
            {/* Mini Calendar */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-slate-200/30 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
                </button>
                <h3 className="text-lg font-bold text-slate-900">{getMonthYear()}</h3>
                <button
                  onClick={nextMonth}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <ChevronRightIcon className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="text-center text-xs font-bold text-slate-500 py-3">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month starts */}
                {[...Array(startingDayOfWeek)].map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square" />
                ))}
                
                {/* Days of the month */}
                {[...Array(daysInMonth)].map((_, idx) => {
                  const day = idx + 1;
                  const isTodayDate = isToday(day);
                  const isSelectedDate = isSelected(day);
                  const isPast = isPastDate(day);
                  
                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-2xl transition-all duration-300 ${
                        isPast
                          ? 'text-slate-300 cursor-not-allowed'
                          : isSelectedDate
                            ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110 cursor-pointer'
                            : isTodayDate
                              ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 font-bold cursor-pointer hover:shadow-lg hover:scale-105'
                              : 'hover:bg-slate-100 text-slate-700 cursor-pointer hover:scale-105'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-slate-200/30 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Status Overview</h3>
              <div className="space-y-4">
                {[
                  { status: 'Confirmed', color: 'bg-emerald-500', count: statusCounts['Confirmed'], gradient: 'from-emerald-500 to-green-600' },
                  { status: 'Awaiting', color: 'bg-amber-500', count: statusCounts['Awaiting Confirmation'], gradient: 'from-amber-500 to-orange-600' },
                  { status: 'In Progress', color: 'bg-violet-500', count: statusCounts['In Progress'], gradient: 'from-violet-500 to-purple-600' },
                  { status: 'Completed', color: 'bg-slate-500', count: statusCounts['Completed'], gradient: 'from-slate-500 to-gray-600' }
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} shadow-lg`} />
                      <span className="text-sm font-semibold text-slate-700">{item.status}</span>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full">
                      <span className="text-sm font-bold text-slate-900">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Section - Day View Time Slots */}
          <div className="xl:col-span-4">
            {/* Status Filters */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl shadow-slate-200/30 mb-8">
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {[
                  { label: 'All', value: 'all', count: statusCounts.all, color: 'from-slate-600 to-slate-700' },
                  { label: 'Awaiting', value: 'Awaiting Confirmation', count: statusCounts['Awaiting Confirmation'], color: 'from-amber-500 to-orange-600' },
                  { label: 'Confirmed', value: 'Confirmed', count: statusCounts['Confirmed'], color: 'from-emerald-500 to-green-600' },
                  { label: 'In Progress', value: 'In Progress', count: statusCounts['In Progress'], color: 'from-violet-500 to-purple-600' },
                  { label: 'Completed', value: 'Completed', count: statusCounts['Completed'], color: 'from-slate-500 to-gray-600' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                      selectedStatus === filter.value
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-xl shadow-slate-200`
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-lg'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Day Planner View */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-slate-200/30 overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                    <CalendarIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No Appointments</h3>
                  <p className="text-slate-500 text-lg">
                    {selectedStatus === 'all' 
                      ? "No appointments scheduled for today."
                      : `No ${selectedStatus.toLowerCase()} appointments.`}
                  </p>
                </div>
              ) : (
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {timeSlots.map((timeSlot) => {
                    const slotBookings = getBookingsForTimeSlot(timeSlot);
                    
                    return (
                      <div key={timeSlot} className="border-b border-slate-100/50 last:border-0">
                        <div className="flex">
                          {/* Time Column */}
                          <div className="w-32 flex-shrink-0 p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 border-r border-slate-100/50">
                            <div className="text-base font-bold text-slate-700">{timeSlot}</div>
                          </div>

                          {/* Appointments Column */}
                          <div className="flex-1 p-6">
                            {slotBookings.length === 0 ? (
                              <div className="text-slate-400 italic font-medium">No appointments</div>
                            ) : (
                              <div className="space-y-2">
                                {slotBookings.map((booking) => (
                                  <div
                                    key={booking._id}
                                    onClick={() => navigate(`/bookings/${booking._id}`)}
                                    className={`${getStatusColor(booking.status)} rounded-lg p-3 cursor-pointer hover:shadow-lg transition-all duration-200 group border-l-4 border-l-white/20`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <h4 className="text-sm font-bold text-white group-hover:text-white/90 transition-colors">
                                            {booking.fullName}
                                          </h4>
                                          <span className="text-xs px-2 py-0.5 bg-white/20 text-white rounded-full font-medium">
                                            {booking.status === 'Rescheduled' ? 'Rescheduled' : booking.status}
                                          </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-xs text-white/80">
                                          <div className="flex items-center space-x-1">
                                            <UsersIcon className="w-3 h-3" />
                                            <span>{booking.referenceNumber}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <PhoneIcon className="w-3 h-3" />
                                            <span>{booking.mobileNumber}</span>
                                          </div>
                                        </div>

                                        <div className="mt-2 flex items-center space-x-2">
                                          <div className="px-2 py-1 bg-white/15 rounded text-xs font-medium text-white">
                                            {booking.consultationId?.name || 'N/A'}
                                          </div>
                                          <div className="flex items-center space-x-1 text-xs text-white/70">
                                            <LocationIcon className="w-3 h-3" />
                                            <span>{booking.preferredLocation}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRightIcon className="w-4 h-4 text-white/80" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
