import React, { useState, useRef, useEffect } from 'react';

const BeautifulTimePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(value || '10:00 AM');
  const dropdownRef = useRef(null);

  // Parse time
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        period: match[3].toUpperCase()
      };
    }
    return { hour: 10, minute: 0, period: 'AM' };
  };

  const { hour, minute, period } = parseTime(time);

  // Generate options
  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minutes = Array.from({ length: 60 }, (_, i) => i);

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

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    const formattedTime = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')} ${newPeriod}`;
    setTime(formattedTime);
    if (onChange) onChange(formattedTime);
  };

  const formatDisplay = () => {
    return `${hour.toString().padStart(2, '0')} : ${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green/30 focus:border-zennara-green focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 shadow-sm hover:border-gray-300 flex items-center justify-between"
      >
        <span>{formatDisplay()}</span>
        <svg className={`w-5 h-5 text-zennara-green transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Beautiful Custom Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-scale-in">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              
              {/* Hour Column */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Hour</div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleTimeChange(h, minute, period)}
                      className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all mb-1 ${
                        h === hour
                          ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {h.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minute Column */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Min</div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {minutes.filter(m => m % 5 === 0).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleTimeChange(hour, m, period)}
                      className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all mb-1 ${
                        m === minute
                          ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM Column */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Period</div>
                <div>
                  {['AM', 'PM'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleTimeChange(hour, minute, p)}
                      className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all mb-1 ${
                        p === period
                          ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautifulTimePicker;
