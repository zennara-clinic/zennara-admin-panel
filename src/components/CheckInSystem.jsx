import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  LocationIcon,
  DoctorIcon,
  XCircleIcon
} from './Icons';
import { appointments } from '../data/mockData';

export default function CheckInSystem() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter appointments that can be checked in (within 15 min window)
  const checkInEligibleAppointments = appointments.slice(0, 10);

  const handleCheckIn = (appointment) => {
    setSelectedAppointment(appointment);
    // In real app, this would update the appointment status
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Check-In System</h1>
        <p className="text-base text-gray-500">Patient check-in and waiting time management</p>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-zennara-green/10 to-emerald-50/50 rounded-3xl p-8 border-2 border-zennara-green/20 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Check-In</h2>
        <div className="relative">
          <UsersIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, phone number, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-16 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all hover:border-gray-300"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Waiting</p>
          <p className="text-4xl font-bold text-yellow-600">8</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">In Progress</p>
          <p className="text-4xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Completed Today</p>
          <p className="text-4xl font-bold text-green-600">23</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-2">Avg Wait Time</p>
          <p className="text-4xl font-bold text-purple-600">12m</p>
        </div>
      </div>

      {/* Eligible for Check-In */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligible for Check-In (15 min window)</h2>
        <div className="space-y-4">
          {checkInEligibleAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-zennara-green transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1">
                  <img
                    src={appointment.patient.image}
                    alt={appointment.patient.name}
                    className="w-16 h-16 rounded-2xl border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{appointment.patient.name}</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Time</p>
                        <p className="font-semibold text-gray-900">{appointment.dateTime.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Treatment</p>
                        <p className="font-semibold text-gray-900">{appointment.treatment.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Doctor</p>
                        <p className="font-semibold text-gray-900">{appointment.dateTime.doctor.split(' ').slice(-1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Booking ID</p>
                        <p className="font-semibold text-gray-900">{appointment.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleCheckIn(appointment)}
                    className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                  >
                    Check In
                  </button>
                  <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold transition-all">
                    QR Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Waiting */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Currently Waiting</h2>
        <div className="space-y-3">
          {appointments.slice(0, 5).map((appointment, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-200"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={appointment.patient.image}
                  alt={appointment.patient.name}
                  className="w-12 h-12 rounded-xl"
                />
                <div>
                  <p className="font-bold text-gray-900">{appointment.patient.name}</p>
                  <p className="text-sm text-gray-600">{appointment.treatment.name} • {appointment.dateTime.doctor}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Check-in Time</p>
                  <p className="font-bold text-gray-900">9:{45 + idx * 3} AM</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Waiting</p>
                  <p className="font-bold text-yellow-600">{5 + idx * 2}m</p>
                </div>
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">
                  Start Treatment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Check-In Success Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <CheckCircleIcon className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Check-In Successful!</h2>
              <p className="text-gray-600 mb-6">
                {selectedAppointment.patient.name} has been checked in at {new Date().toLocaleTimeString()}
              </p>
              
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-2xl p-8 mb-6">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center border-4 border-gray-300">
                  <p className="text-gray-400 font-bold">QR CODE</p>
                </div>
                <p className="text-sm text-gray-600 mt-4">Booking ID: {selectedAppointment.id}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="w-full py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  Done
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
                >
                  Print Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
