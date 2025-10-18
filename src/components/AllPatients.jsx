import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  PlusIcon,
  ChartIcon,
  CalendarIcon,
  LocationIcon,
  ChevronDownIcon,
  EyeIcon,
  PhoneIcon,
  MailIcon,
  DocumentIcon,
  StarIcon,
  CrownIcon
} from './Icons';
import userService from '../services/userService';
import branchService from '../services/branchService';
import Avatar from './Avatar';
import AddPatientModal from './AddPatientModal';
import ManageMembershipModal from './ManageMembershipModal';
import PatientListSkeleton from './skeletons/PatientListSkeleton';

export default function AllPatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberTypeFilter, setMemberTypeFilter] = useState('All Members');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [patients, setPatients] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, memberTypeFilter, locationFilter, searchQuery]);

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await branchService.getAllBranches();
      if (response.success && response.data) {
        setBranches(response.data);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page: currentPage,
        limit: itemsPerPage,
        memberType: memberTypeFilter !== 'All Members' ? memberTypeFilter : undefined,
        location: locationFilter !== 'All Locations' ? locationFilter : undefined,
        search: searchQuery || undefined
      });

      if (response.success) {
        setPatients(response.data.users);
        setStatistics(response.data.statistics);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const statisticsData = [
    {
      title: 'Total Patients',
      value: statistics.totalPatients?.toString() || '0',
      change: '+12%',
      icon: UsersIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'New This Month',
      value: statistics.newThisMonth?.toString() || '0',
      change: '+23%',
      icon: PlusIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Active Patients',
      value: statistics.activePatients?.toString() || '0',
      change: '+8%',
      icon: CalendarIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Zen Members',
      value: statistics.zenMembers?.toString() || '0',
      change: '+15%',
      icon: StarIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    }
  ];

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getMemberBadgeColor = (type) => {
    if (type === 'Zen Member') {
      return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleResetFilters = () => {
    setMemberTypeFilter('All Members');
    setLocationFilter('All Locations');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExportData = async () => {
    try {
      const response = await userService.exportUsers({
        memberType: memberTypeFilter !== 'All Members' ? memberTypeFilter : undefined,
        location: locationFilter !== 'All Locations' ? locationFilter : undefined
      });

      if (response.success) {
        // Convert to CSV and download
        const csvData = convertToCSV(response.data);
        downloadCSV(csvData, 'zennara-patients.csv');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePatientCreated = (newPatient) => {
    // Refresh the patient list
    fetchUsers();
    // Optionally show a success message
    console.log(' New patient added:', newPatient);
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Patients</h1>
        <p className="text-gray-500 text-base">Manage and view all patient records</p>
      </div>

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {statisticsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${stat.borderColor} hover:shadow-md transition-all group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-bold text-zennara-green">{stat.change}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters Section */}
      {!loading && (
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Search & Filter</h3>
            <p className="text-sm text-gray-500">Find patients quickly</p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm font-semibold text-zennara-green hover:bg-zennara-green hover:text-white rounded-xl transition-all border-2 border-zennara-green"
          >
            Reset All
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Member Type Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">MEMBER TYPE</label>
            <div className="relative">
              <StarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select 
                value={memberTypeFilter}
                onChange={(e) => setMemberTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300"
              >
                <option>All Members</option>
                <option>Zen Member</option>
                <option>Regular Member</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Last Visit Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">LAST VISIT</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last Year</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">PREFERRED LOCATION</label>
            <div className="relative">
              <LocationIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300"
                disabled={loadingBranches}
              >
                <option>All Locations</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">SEARCH PATIENTS</label>
          <div className="relative">
            <UsersIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-16 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all hover:border-gray-300"
            />
          </div>
        </div>
      </div>
      )}

      {/* Action Buttons */}
      {!loading && (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddPatientModal(true)}
            className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Patient</span>
          </button>
          <button 
            onClick={handleExportData}
            className="flex items-center space-x-2 px-6 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <ChartIcon className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="text-gray-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalUsers)}</span> of <span className="text-gray-900 font-bold">{totalUsers}</span> patients
        </p>
      </div>
      )}

      {/* Patients List */}
      {loading ? (
        <PatientListSkeleton />
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="space-y-4">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              {/* Left - Patient Info */}
              <div className="flex items-center space-x-5 flex-1">
                <Avatar
                  src={patient.profilePhoto || patient.image}
                  name={patient.name}
                  size="xl"
                  showOnlineDot={true}
                  className="group-hover:scale-105 transition-transform"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                    <span className={`px-3 py-1 rounded-xl font-bold text-xs border-2 ${getMemberBadgeColor(patient.memberType)}`}>
                      {patient.memberType || 'Regular Member'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Patient ID</p>
                      <p className="font-bold text-gray-900">{patient.patientId || patient.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                      <p className="font-semibold text-gray-900 truncate">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Preferred Location</p>
                      <p className="font-semibold text-gray-900">{patient.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Stats & Actions */}
              <div className="flex items-center space-x-6 ml-6 border-l border-gray-100 pl-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{patient.totalVisits}</p>
                  <p className="text-xs text-gray-500 font-medium">Total Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-zennara-green">₹{patient.totalSpent.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500 font-medium">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-500 font-medium">Upcoming</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigate(`/patients/records/${patient.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-sm transition-all"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => {
                      console.log('👑 Membership button clicked for:', patient.name);
                      setSelectedPatient(patient);
                      setShowMembershipModal(true);
                      console.log('✅ Modal state set to true');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl font-semibold text-sm transition-all"
                    title="Manage Zen Membership"
                  >
                    <CrownIcon className="w-4 h-4" />
                    <span>{patient.memberType === 'Zen Member' ? 'Edit Membership' : 'Membership'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-10">
        {/* Items Per Page */}
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
          
          {[...Array(Math.min(5, totalPages))].map((_, idx) => {
            const pageNum = idx + 1;
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
          Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSuccess={handlePatientCreated}
      />

      {/* Manage Membership Modal */}
      <ManageMembershipModal
        isOpen={showMembershipModal}
        onClose={() => {
          setShowMembershipModal(false);
          setSelectedPatient(null);
        }}
        onSuccess={() => {
          fetchUsers(); // Refresh the list
        }}
        patient={selectedPatient}
      />
    </div>
  );
}
