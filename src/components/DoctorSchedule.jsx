import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  LocationIcon,
  PlusIcon,
  SettingsIcon,
  ChartIcon,
  XCircleIcon,
  BellIcon
} from './Icons';
import { getDoctorById } from '../data/mockData';

export default function DoctorSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLocation, setSelectedLocation] = useState('Jubilee Hills');
  const [currentWeek, setCurrentWeek] = useState('Oct 14 - Oct 20, 2025');

  const doctor = getDoctorById(id) || getDoctorById('DOC001');

  // Weekly schedule data
  const weekDays = [
    { day: 'MON', date: 14 },
    { day: 'TUE', date: 15 },
    { day: 'WED', date: 16 },
    { day: 'THU', date: 17 },
    { day: 'FRI', date: 18 },
    { day: 'SAT', date: 19 },
    { day: 'SUN', date: 20 }
  ];

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM'
  ];

  // Sample schedule data (0=Available, 1=Booked, 2=Lunch, 3=Leave, 4=Unavailable)
  const scheduleData = {
    'MON': [1, 1, 0, 2, 1, 0, 1, 0, 1],
    'TUE': [1, 0, 1, 2, 0, 1, 1, 3, 3],
    'WED': [1, 1, 0, 2, 1, 1, 0, 0, 1],
    'THU': [0, 1, 0, 2, 0, 1, 0, 1, 0],
    'FRI': [1, 1, 1, 2, 0, 0, 1, 0, 1],
    'SAT': [0, 1, 0, 2, 1, 0, 3, 3, 3],
    'SUN': [3, 4, 4, 4, 4, 4, 4, 4, 4]
  };

  const getSlotStyle = (status) => {
    switch (status) {
      case 0: // Available
        return 'bg-green-100 border-green-300 text-green-700';
      case 1: // Booked
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 2: // Lunch
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 3: // Leave
        return 'bg-red-100 border-red-300 text-red-700';
      case 4: // Unavailable
        return 'bg-gray-100 border-gray-300 text-gray-500';
      default:
        return 'bg-white border-gray-200 text-gray-700';
    }
  };

  const getSlotLabel = (status) => {
    switch (status) {
      case 0: return 'Avail';
      case 1: return 'Booked';
      case 2: return 'LUNCH';
      case 3: return 'Leave';
      case 4: return '-';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen p-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <button
            onClick={() => navigate('/doctors')}
            className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Doctors</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-base text-gray-500">{doctor.name}</p>
        </div>
      </div>

      {/* Week Selector & Location */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-gray-400" />
              <span className="text-lg font-bold text-gray-900">Week View:</span>
              <span className="text-lg font-semibold text-zennara-green">{currentWeek}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
                ◀ Previous
              </button>
              <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">
                Next ▶
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LocationIcon className="w-6 h-6 text-gray-400" />
            <span className="text-base font-semibold text-gray-700">Location:</span>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300"
              >
                {doctor.locations.map((loc, idx) => (
                  <option key={idx} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 font-bold text-gray-600 text-sm">TIME</th>
              {weekDays.map((day, idx) => (
                <th key={idx} className="text-center py-4 px-3 min-w-[120px]">
                  <div className="font-bold text-gray-900 text-lg">{day.day}</div>
                  <div className="text-gray-500 text-sm mt-1">{day.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIdx) => (
              <tr key={timeIdx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-700">{time}</td>
                {weekDays.map((day, dayIdx) => {
                  const status = scheduleData[day.day][timeIdx];
                  return (
                    <td key={dayIdx} className="py-3 px-3">
                      <div
                        className={`px-3 py-2 rounded-lg border-2 text-center font-bold text-sm cursor-pointer hover:scale-105 transition-all ${getSlotStyle(status)}`}
                      >
                        {getSlotLabel(status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all">
            <XCircleIcon className="w-5 h-5" />
            <span>Block Time Slot</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-2xl font-bold transition-all">
            <CalendarIcon className="w-5 h-5" />
            <span>Add Leave</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-bold transition-all">
            <ClockIcon className="w-5 h-5" />
            <span>Copy to Next Week</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-2xl font-bold transition-all">
            <SettingsIcon className="w-5 h-5" />
            <span>Set Recurring Schedule</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl font-bold transition-all">
            <ChartIcon className="w-5 h-5" />
            <span>View Utilization</span>
          </button>
        </div>
      </div>

      {/* Upcoming Leaves & Conflicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upcoming Leaves */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Leaves</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl">
              <CalendarIcon className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">Nov 2-4, 2025</p>
                <p className="text-sm text-gray-600">Personal Leave</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-2xl">
              <CalendarIcon className="w-5 h-5 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">Dec 24-26, 2025</p>
                <p className="text-sm text-gray-600">Festival Holiday</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Add Leave</span>
            </button>
          </div>
        </div>

        {/* Schedule Conflicts */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Conflicts</h3>
          <div className="space-y-4">
            <div className="p-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <BellIcon className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">⚠️ Overlapping Appointment</p>
                    <p className="text-sm text-gray-700">Oct 19, 5:00 PM - Scheduled at Kondapur</p>
                    <p className="text-sm text-gray-600 mt-1">Conflicts with existing appointment at Jubilee Hills</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold transition-all">
                Resolve Conflict
              </button>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl text-center">
              <p className="text-green-700 font-semibold">✓ No other conflicts found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Legend:</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-sm font-medium text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-sm font-medium text-gray-700">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-sm font-medium text-gray-700">Lunch Break</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
            <span className="text-sm font-medium text-gray-700">Leave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gray-100 border-2 border-gray-300"></div>
            <span className="text-sm font-medium text-gray-700">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
