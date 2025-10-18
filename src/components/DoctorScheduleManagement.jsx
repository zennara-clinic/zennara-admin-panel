import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  SettingsIcon,
  ChevronDownIcon,
  LocationIcon,
  UsersIcon,
  ChartIcon
} from './Icons';
import { doctors } from '../data/mockData';

export default function DoctorScheduleManagement() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('Oct 16, 2025');
  const [viewMode, setViewMode] = useState('day'); // day, week

  // Time slots for the day
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  // Sample schedule data for each doctor (0=Free, 1=Booked, 2=Break, 3=Off)
  const scheduleData = {
    'DOC001': [1, 1, 0, 2, 1, 0, 1, 0, 1, 0, 1],
    'DOC002': [0, 1, 1, 2, 0, 1, 1, 0, 3, 3, 3],
    'DOC003': [1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 3],
    'DOC004': [1, 1, 0, 2, 0, 1, 0, 1, 0, 3, 3],
    'DOC005': [0, 1, 1, 2, 1, 0, 1, 0, 1, 3, 3],
    'DOC006': [1, 0, 0, 2, 1, 1, 0, 1, 0, 3, 3]
  };

  const getSlotStyle = (status) => {
    switch (status) {
      case 0: return 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200';
      case 1: return 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200';
      case 2: return 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200';
      case 3: return 'bg-gray-100 border-gray-300 text-gray-500';
      default: return 'bg-white border-gray-200';
    }
  };

  const getSlotLabel = (status) => {
    switch (status) {
      case 0: return '✓ Free';
      case 1: return '● Booked';
      case 2: return '☕ Break';
      case 3: return '✕ Off';
      default: return '';
    }
  };

  const getSlotCount = (doctorId, status) => {
    return scheduleData[doctorId].filter(s => s === status).length;
  };

  return (
    <div className="min-h-screen p-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-base text-gray-500">Manage doctor schedules and availability</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all">
            <PlusIcon className="w-5 h-5" />
            <span>Add Schedule</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            <SettingsIcon className="w-5 h-5" />
            <span>Bulk Update</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            <ChartIcon className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Date Selector & Stats */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <CalendarIcon className="w-8 h-8 text-zennara-green" />
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Selected Date</p>
              <p className="text-2xl font-bold text-gray-900">{selectedDate}</p>
            </div>
            <div className="flex items-center space-x-3 ml-6">
              <button className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold transition-all">
                ◀ Previous Day
              </button>
              <button className="px-5 py-2.5 bg-zennara-green text-white hover:bg-emerald-700 rounded-xl font-semibold transition-all">
                Today
              </button>
              <button className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold transition-all">
                Next Day ▶
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center px-6 py-3 bg-green-50 rounded-2xl border-2 border-green-200">
              <p className="text-2xl font-bold text-green-700">32</p>
              <p className="text-xs font-semibold text-gray-600">Available Slots</p>
            </div>
            <div className="text-center px-6 py-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <p className="text-2xl font-bold text-blue-700">28</p>
              <p className="text-xs font-semibold text-gray-600">Booked</p>
            </div>
            <div className="text-center px-6 py-3 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <p className="text-2xl font-bold text-gray-700">6</p>
              <p className="text-xs font-semibold text-gray-600">Doctors Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-8">
          <p className="font-bold text-gray-900">Legend:</p>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-sm font-medium text-gray-700">Free / Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-sm font-medium text-gray-700">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-sm font-medium text-gray-700">Break / Lunch</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gray-100 border-2 border-gray-300"></div>
            <span className="text-sm font-medium text-gray-700">Off / Unavailable</span>
          </div>
        </div>
      </div>

      {/* Doctor Schedule Cards */}
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Doctor Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl border-2 border-gray-200 shadow-sm"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1 text-xs font-semibold text-gray-500">
                        <LocationIcon className="w-4 h-4" />
                        <span>{doctor.locations[0].name}</span>
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-semibold text-gray-500">
                        {doctor.workingHours.weekdays}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{getSlotCount(doctor.id, 0)}</p>
                    <p className="text-xs text-gray-500 font-medium">Free</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{getSlotCount(doctor.id, 1)}</p>
                    <p className="text-xs text-gray-500 font-medium">Booked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{getSlotCount(doctor.id, 2)}</p>
                    <p className="text-xs text-gray-500 font-medium">Break</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/doctors/${doctor.id}/schedule`)}
                    className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold transition-all text-sm"
                  >
                    View Full Schedule →
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="p-6">
              <div className="grid grid-cols-11 gap-2">
                {timeSlots.map((time, idx) => {
                  const status = scheduleData[doctor.id][idx];
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${getSlotStyle(status)}`}
                      onClick={() => status !== 3 && console.log(`Clicked ${doctor.name} at ${time}`)}
                    >
                      <p className="text-xs font-bold mb-1">{time}</p>
                      <p className="text-xs font-semibold">{getSlotLabel(status)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="mt-10 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-sm border-2 border-blue-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-4">
          <button className="p-6 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 text-center font-bold text-gray-700 transition-all hover:shadow-md">
            <CalendarIcon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <span>Copy Schedule</span>
          </button>
          <button className="p-6 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 text-center font-bold text-gray-700 transition-all hover:shadow-md">
            <ClockIcon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <span>Set Breaks</span>
          </button>
          <button className="p-6 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 text-center font-bold text-gray-700 transition-all hover:shadow-md">
            <UsersIcon className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <span>Add Leave</span>
          </button>
          <button className="p-6 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 text-center font-bold text-gray-700 transition-all hover:shadow-md">
            <SettingsIcon className="w-8 h-8 mx-auto mb-3 text-orange-600" />
            <span>Bulk Update</span>
          </button>
        </div>
      </div>
    </div>
  );
}
