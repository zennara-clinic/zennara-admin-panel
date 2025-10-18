import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ChevronDownIcon,
  LocationIcon,
  DoctorIcon,
  ClockIcon,
  UsersIcon
} from './Icons';
import { appointments } from '../data/mockData';

export default function AppointmentCalendar() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('week'); // day, week, month
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  // Generate calendar data
  const generateWeekDays = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dates = [14, 15, 16, 17, 18, 19, 20];
    return days.map((day, idx) => ({ day, date: dates[idx] }));
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const weekDays = generateWeekDays();

  // Sample calendar appointments mapping
  const calendarAppointments = {
    'Monday-09:00 AM': [{ ...appointments[0], color: 'bg-green-100 border-green-300' }],
    'Monday-10:00 AM': [{ ...appointments[1], color: 'bg-blue-100 border-blue-300' }],
    'Tuesday-11:00 AM': [{ ...appointments[2], color: 'bg-purple-100 border-purple-300' }],
    'Wednesday-02:00 PM': [{ ...appointments[3], color: 'bg-yellow-100 border-yellow-300' }],
    'Thursday-10:00 AM': [{ ...appointments[4], color: 'bg-pink-100 border-pink-300' }],
    'Friday-03:00 PM': [{ ...appointments[5], color: 'bg-indigo-100 border-indigo-300' }],
  };

  const getAppointmentForSlot = (day, time) => {
    const key = `${day}-${time}`;
    return calendarAppointments[key] || [];
  };

  return (
    <div className="min-h-screen p-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointment Calendar</h1>
          <p className="text-base text-gray-500">Visual calendar view of all appointments</p>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
        >
          List View
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between">
          {/* View Mode Selector */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('day')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
              ◀ Previous
            </button>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-gray-400" />
              <span className="text-xl font-bold text-gray-900">Oct 14-20, 2025</span>
            </div>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
              Next ▶
            </button>
            <button className="px-4 py-2 bg-zennara-green text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
              Today
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="jubilee">Jubilee Hills</option>
                <option value="kondapur">Kondapur</option>
                <option value="financial">Financial District</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Week View Calendar */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1400px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-600 text-sm w-24 sticky left-0 bg-gray-50">
                    TIME
                  </th>
                  {weekDays.map((day, idx) => (
                    <th key={idx} className="text-center py-4 px-2 min-w-[180px]">
                      <div className="font-bold text-gray-900 text-base">{day.day}</div>
                      <div className="text-gray-500 text-sm mt-1">Oct {day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIdx) => (
                  <tr key={timeIdx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 text-sm sticky left-0 bg-white border-r border-gray-100">
                      {time}
                    </td>
                    {weekDays.map((day, dayIdx) => {
                      const appts = getAppointmentForSlot(day.day, time);
                      return (
                        <td key={dayIdx} className="py-2 px-2 align-top">
                          <div className="space-y-2">
                            {appts.map((appt, apptIdx) => (
                              <div
                                key={apptIdx}
                                onClick={() => navigate(`/appointments/${appt.id}/details`)}
                                className={`p-3 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${appt.color}`}
                              >
                                <p className="font-bold text-gray-900 text-xs mb-1">{appt.patient.name}</p>
                                <p className="text-xs text-gray-700 font-semibold">{appt.treatment.name}</p>
                                <p className="text-xs text-gray-600 mt-1">{appt.dateTime.doctor.split(' ').slice(1).join(' ')}</p>
                              </div>
                            ))}
                            {appts.length === 0 && (
                              <div className="h-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <button className="text-xs text-gray-400 hover:text-zennara-green font-semibold">
                                  + Add
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Monday, Oct 14, 2025</h2>
          <div className="space-y-3">
            {timeSlots.map((time, idx) => {
              const appts = getAppointmentForSlot('Monday', time);
              return (
                <div key={idx} className="flex items-start space-x-4 border-b border-gray-100 pb-3">
                  <div className="w-24 flex-shrink-0 font-bold text-gray-700">{time}</div>
                  <div className="flex-1">
                    {appts.length > 0 ? (
                      appts.map((appt, apptIdx) => (
                        <div
                          key={apptIdx}
                          onClick={() => navigate(`/appointments/${appt.id}/details`)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer hover:shadow-md transition-all ${appt.color}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-gray-900 text-base mb-1">{appt.patient.name}</p>
                              <p className="text-sm text-gray-700 font-semibold">{appt.treatment.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{appt.dateTime.doctor}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-zennara-green">{appt.treatment.price}</p>
                              <p className="text-xs text-gray-600 mt-1">{appt.dateTime.location}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm italic">No appointments</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">October 2025</h2>
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={idx} className="text-center font-bold text-gray-700 py-3">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {[...Array(35)].map((_, idx) => {
              const dayNum = idx - 6 + 14; // Oct 14-20 visible
              const isCurrentWeek = dayNum >= 14 && dayNum <= 20;
              const hasAppointments = isCurrentWeek && (idx % 3 === 0);
              
              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-3 border-2 rounded-2xl transition-all ${
                    isCurrentWeek
                      ? 'border-gray-200 bg-white hover:border-zennara-green cursor-pointer'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {dayNum > 0 && dayNum <= 31 && (
                    <>
                      <div className="font-bold text-gray-900 mb-2">{dayNum}</div>
                      {hasAppointments && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 bg-green-100 rounded text-green-700 font-semibold truncate">
                            3 appts
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Legend:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-sm font-medium text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-sm font-medium text-gray-700">Rescheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-purple-100 border-2 border-purple-300"></div>
            <span className="text-sm font-medium text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-pink-100 border-2 border-pink-300"></div>
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
            <span className="text-sm font-medium text-gray-700">Cancelled / No Show</span>
          </div>
        </div>
      </div>
    </div>
  );
}
