import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  PlusIcon,
  ChartIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  ClockIcon,
  CurrencyIcon,
  StarIcon,
  CheckCircleIcon,
  SettingsIcon,
  BellIcon,
  DocumentIcon,
  XCircleIcon
} from './Icons';
import { doctors } from '../data/mockData';

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [expandedDoctor, setExpandedDoctor] = useState(null);

  const toggleDoctor = (id) => {
    setExpandedDoctor(expandedDoctor === id ? null : id);
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Management</h1>
          <p className="text-base text-gray-500">Manage doctor profiles, schedules, and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all">
            <PlusIcon className="w-5 h-5" />
            <span>Add New Doctor</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            <ChartIcon className="w-5 h-5" />
            <span>Performance Report</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            <SettingsIcon className="w-5 h-5" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { title: 'Total Doctors', value: doctors.length.toString(), icon: UsersIcon, color: 'blue' },
          { title: 'Active Doctors', value: doctors.filter(d => d.status === 'Active').length.toString(), icon: CheckCircleIcon, color: 'green' },
          { title: 'Total Patients', value: doctors.reduce((sum, d) => sum + d.stats.patients, 0).toString(), icon: UsersIcon, color: 'purple' },
          { title: 'Total Revenue', value: `₹${(doctors.reduce((sum, d) => sum + d.stats.revenue, 0) / 100000).toFixed(1)}L`, icon: CurrencyIcon, color: 'emerald' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className={`bg-white rounded-3xl p-8 shadow-sm border-2 border-${stat.color}-100 hover:shadow-xl transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-2">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Doctor Cards */}
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Doctor Header */}
            <div className="bg-gradient-to-r from-zennara-green to-emerald-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl"
                  />
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{doctor.name}</h2>
                    <p className="text-lg opacity-90">{doctor.specialization}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="px-3 py-1 bg-white/20 rounded-xl text-sm font-bold flex items-center space-x-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>{doctor.status}</span>
                      </span>
                      <span className="text-sm opacity-90 flex items-center space-x-1">
                        <StarIcon className="w-4 h-4" />
                        <span>{doctor.stats.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleDoctor(doctor.id)}
                  className="px-6 py-3 bg-white text-zennara-green rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  {expandedDoctor === doctor.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>

            {/* Doctor Details (Collapsible) */}
            {expandedDoctor === doctor.id && (
              <div className="p-8 space-y-8">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-gray-600 font-medium w-32">Experience:</span>
                        <span className="font-bold text-gray-900">{doctor.experience}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-gray-600 font-medium w-32">Qualification:</span>
                        <span className="font-bold text-gray-900">{doctor.qualification}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-gray-600 font-medium w-32">Registration:</span>
                        <span className="font-bold text-gray-900">{doctor.registration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MailIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">{doctor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations & Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <LocationIcon className="w-6 h-6 text-blue-600" />
                      <span>Assigned Locations</span>
                    </h3>
                    <div className="space-y-2">
                      {doctor.locations.map((loc, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <LocationIcon className="w-6 h-6 text-blue-600" />
                          <span className="font-semibold text-gray-900">{loc.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                            {loc.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                      <span>Working Hours</span>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium w-24">Mon-Sat:</span>
                        <span className="font-bold text-gray-900">{doctor.workingHours.weekdays}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium w-24">Sunday:</span>
                        <span className="font-bold text-gray-900">{doctor.workingHours.sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Speciality Services</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {doctor.services.map((service, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white border-2 border-green-200 text-gray-900 rounded-xl font-semibold text-sm">
                        • {service}
                      </span>
                    ))}
                  </div>
                  <button className="text-zennara-green font-bold hover:underline">
                    View All {doctor.totalServices} Services →
                  </button>
                </div>

                {/* Fees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Consultation Fee</p>
                      <p className="text-3xl font-bold text-gray-900">₹{doctor.consultationFee.toLocaleString('en-IN')}</p>
                    </div>
                    <CurrencyIcon className="w-12 h-12 text-yellow-600" />
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Follow-up Fee</p>
                      <p className="text-3xl font-bold text-gray-900">₹{doctor.followUpFee.toLocaleString('en-IN')}</p>
                    </div>
                    <CurrencyIcon className="w-12 h-12 text-orange-600" />
                  </div>
                </div>

                {/* This Month Stats */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">This Month Statistics</h3>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Patients</p>
                      <p className="text-4xl font-bold text-gray-900">{doctor.stats.patients}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Rating</p>
                      <div className="flex items-center justify-center space-x-2">
                        <StarIcon className="w-10 h-10 text-yellow-600" />
                        <p className="text-4xl font-bold text-yellow-600">{doctor.stats.rating}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Revenue</p>
                      <p className="text-4xl font-bold text-zennara-green">₹{(doctor.stats.revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Completed</p>
                      <p className="text-4xl font-bold text-blue-600">{doctor.stats.completed}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-bold transition-all">
                    <DocumentIcon className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/doctors/${doctor.id}/schedule`)}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-2xl font-bold transition-all"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>View Schedule</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl font-bold transition-all">
                    <ChartIcon className="w-5 h-5" />
                    <span>Analytics</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-2xl font-bold transition-all">
                    <SettingsIcon className="w-5 h-5" />
                    <span>Access Control</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl font-bold transition-all">
                    <MailIcon className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all">
                    <XCircleIcon className="w-5 h-5" />
                    <span>Deactivate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
