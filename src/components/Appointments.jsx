import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  PlusIcon,
  ChartIcon,
  DocumentIcon,
  EyeIcon,
  CheckCircleIcon,
  RefreshIcon,
  XCircleIcon,
  ChatIcon,
  PhoneIcon,
  BellIcon,
  CurrencyIcon,
  PrinterIcon,
  ChevronDownIcon,
  UsersIcon,
  DoctorIcon,
  LocationIcon
} from './Icons';
import { appointments as allAppointments } from '../data/mockData';

export default function Appointments() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(allAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = allAppointments.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const actionMenuItems = [
    { label: 'View Details', icon: EyeIcon, color: 'text-blue-600', bgColor: 'hover:bg-blue-50' },
    { label: 'Check-In Patient', icon: CheckCircleIcon, color: 'text-green-600', bgColor: 'hover:bg-green-50' },
    { label: 'Start Treatment', icon: UsersIcon, color: 'text-purple-600', bgColor: 'hover:bg-purple-50' },
    { label: 'Complete & Rate', icon: CheckCircleIcon, color: 'text-indigo-600', bgColor: 'hover:bg-indigo-50' },
    { label: 'Mark No-Show', icon: XCircleIcon, color: 'text-red-600', bgColor: 'hover:bg-red-50' },
    { label: 'Reschedule', icon: RefreshIcon, color: 'text-orange-600', bgColor: 'hover:bg-orange-50' },
    { label: 'Cancel', icon: XCircleIcon, color: 'text-pink-600', bgColor: 'hover:bg-pink-50' },
    { label: 'View Form', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'hover:bg-purple-50' },
    { label: 'Send Message', icon: ChatIcon, color: 'text-indigo-600', bgColor: 'hover:bg-indigo-50' },
    { label: 'Send Reminder', icon: BellIcon, color: 'text-yellow-600', bgColor: 'hover:bg-yellow-50' },
    { label: 'View Payment', icon: CurrencyIcon, color: 'text-emerald-600', bgColor: 'hover:bg-emerald-50' },
    { label: 'Generate Slip', icon: PrinterIcon, color: 'text-gray-700', bgColor: 'hover:bg-gray-50' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Rescheduled':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700 animate-pulse';
      case 'Completed':
        return 'bg-indigo-100 text-indigo-700';
      case 'No Show':
        return 'bg-red-100 text-red-700';
      case 'Cancelled':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointments Management</h1>
        <p className="text-gray-500 text-base">Manage all clinic appointments and schedules</p>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Filters & Search</h3>
            <p className="text-sm text-gray-500">Refine your appointment search</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-zennara-green hover:bg-zennara-green hover:text-white rounded-xl transition-all border-2 border-zennara-green">
            Reset All
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">DATE RANGE</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">STATUS</label>
            <div className="relative">
              <CheckCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Rescheduled</option>
                <option>No Show</option>
                <option>Cancelled</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Doctor Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">DOCTOR</label>
            <div className="relative">
              <DoctorIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>All Doctors</option>
                <option>Dr. Rickson Pereira</option>
                <option>Dr. Shilpa Gill</option>
                <option>Dr. Janaki K Yalamanchili</option>
                <option>Dr. Spoorthy Nagineni</option>
                <option>Dr. Madhurya</option>
                <option>Dr. Meghana</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Location Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">LOCATION</label>
            <div className="relative">
              <LocationIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>All Locations</option>
                <option>Jubilee Hills</option>
                <option>Kondapur</option>
                <option>Financial District</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">SEARCH APPOINTMENTS</label>
          <div className="relative">
            <UsersIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, phone number, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-16 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all hover:border-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
            <PlusIcon className="w-5 h-5" />
            <span>New Appointment</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
            <ChartIcon className="w-5 h-5" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
            <CalendarIcon className="w-5 h-5" />
            <span>Calendar View</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 font-medium">Showing <span className="text-gray-900 font-bold">{startIndex + 1}-{Math.min(endIndex, allAppointments.length)}</span> of <span className="text-gray-900 font-bold">{allAppointments.length}</span> appointments</p>
      </div>

      {/* Appointments Cards */}
      <div className="space-y-4">
        {currentAppointments.map((appointment, index) => (
          <div 
            key={appointment.id} 
            onClick={() => navigate(`/appointments/${appointment.id}/details`)}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              {/* Left Side - Main Info */}
              <div className="flex items-center space-x-6 flex-1">
                {/* Patient Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={appointment.patient.image}
                    alt={appointment.patient.name}
                    className="w-20 h-20 rounded-2xl border-3 border-gray-200 shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zennara-green rounded-full border-3 border-white"></div>
                </div>

                {/* Patient & Treatment Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{appointment.patient.name}</h3>
                    <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.hasForm && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
                        <DocumentIcon className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-bold text-green-600">Form Complete</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Treatment</p>
                      <p className="font-semibold text-gray-900">{appointment.treatment.name}</p>
                      <p className="text-sm font-bold text-zennara-green">{appointment.treatment.price}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-900">{appointment.dateTime.date}</p>
                      <p className="text-sm text-gray-600">{appointment.dateTime.time}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Doctor</p>
                      <p className="font-semibold text-gray-900">{appointment.dateTime.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.dateTime.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Booking ID</p>
                      <p className="font-bold text-gray-900">{appointment.id}</p>
                      <p className="text-sm text-gray-600">{appointment.patient.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex-shrink-0 ml-6 relative">
                <button
                  onClick={() => setOpenActionMenu(openActionMenu === index ? null : index)}
                  className="flex items-center space-x-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-sm transition-all group-hover:bg-zennara-green group-hover:text-white"
                >
                  <span>Actions</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {/* Actions Dropdown */}
                {openActionMenu === index && (
                  <div className="absolute right-0 top-14 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in">
                    {actionMenuItems.map((action, idx) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={idx}
                          className={`w-full flex items-center space-x-3 px-5 py-3 ${action.bgColor} transition-all text-left group/item`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <IconComponent className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-10">
        {/* Items Per Page Selector */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-semibold text-gray-600">Show:</label>
          <div className="relative">
            <select 
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500">entries per page</span>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page Numbers Logic */}
          {[...Array(Math.min(5, totalPages))].map((_, idx) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = idx + 1;
            } else if (currentPage <= 3) {
              pageNum = idx + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + idx;
            } else {
              pageNum = currentPage - 2 + idx;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-3 text-gray-400">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Total Info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(endIndex, allAppointments.length)}</span> of <span className="font-bold text-gray-900">{allAppointments.length}</span>
        </div>
      </div>
    </div>
  );
}
