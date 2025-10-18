import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const AppleDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  required = false,
  className = "",
  label = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const dropdownRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isNextMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
        date: new Date(year, month, day)
      });
    }
    
    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    handleDateSelect(today);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
          {label} {required && '*'}
        </label>
      )}
      
      {/* Input Field */}
      <div
        className={`relative cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={selectedDate ? formatDisplayDate(selectedDate) : ''}
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-12 cursor-pointer"
        />
        <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <h3 className="text-lg font-bold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center py-2">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, index) => {
                const { day, isCurrentMonth, date } = dayObj;
                const today = isToday(date);
                const selected = isSelected(date);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      relative w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 
                      ${!isCurrentMonth 
                        ? 'text-gray-300 hover:text-gray-400' 
                        : selected
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                          : today
                            ? 'bg-blue-50 text-blue-600 border-2 border-blue-500'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }
                    `}
                  >
                    {day}
                    {today && !selected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100/50 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDate(null);
                  onChange('');
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Clear
              </button>
              
              <button
                onClick={goToToday}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleDatePicker;
