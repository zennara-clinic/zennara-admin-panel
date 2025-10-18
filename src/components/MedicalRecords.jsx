import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  PrinterIcon,
  ChartIcon,
  CurrencyIcon,
  BellIcon,
  StarIcon
} from './Icons';
import { patients as allPatients, statistics } from '../data/mockData';

export default function MedicalRecords() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination
  const totalPages = Math.ceil(allPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = allPatients.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const patient = selectedPatient || allPatients[0];

  const getMemberBadgeColor = (type) => {
    if (type.includes('Premium') || type.includes('VIP')) {
      return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const treatmentHistory = [
    {
      id: 1,
      date: 'Oct 15, 2025',
      treatment: 'HydraFacial',
      doctor: 'Dr. Rickson Pereira',
      location: 'Jubilee Hills',
      cost: '₹8,850',
      status: 'Completed',
      notes: 'Excellent results, patient very satisfied',
      nextFollowUp: 'Nov 15, 2025'
    },
    {
      id: 2,
      date: 'Sep 10, 2025',
      treatment: 'Chemical Peel',
      doctor: 'Dr. Shilpa Gill',
      location: 'Kondapur',
      cost: '₹6,500',
      status: 'Completed',
      notes: 'Mild redness for 2 days, resolved well',
      nextFollowUp: 'Oct 10, 2025'
    },
    {
      id: 3,
      date: 'Aug 20, 2025',
      treatment: 'Laser Toning',
      doctor: 'Dr. Janaki K Yalamanchili',
      location: 'Financial District',
      cost: '₹12,500',
      status: 'Completed',
      notes: 'Pigmentation reduced by 60%',
      nextFollowUp: 'Sep 20, 2025'
    }
  ];

  const prescriptions = [
    {
      id: 1,
      date: 'Oct 15, 2025',
      doctor: 'Dr. Rickson Pereira',
      medications: [
        { name: 'Tretinoin 0.025% Cream', dosage: 'Apply at night', duration: '30 days' },
        { name: 'Vitamin C Serum 15%', dosage: 'Apply morning', duration: 'Ongoing' },
        { name: 'Sunscreen SPF 50+', dosage: 'Apply every 2-3 hours', duration: 'Daily' }
      ]
    },
    {
      id: 2,
      date: 'Sep 10, 2025',
      doctor: 'Dr. Shilpa Gill',
      medications: [
        { name: 'Glycolic Acid 10% Toner', dosage: 'Every alternate night', duration: '60 days' },
        { name: 'Niacinamide 10% Serum', dosage: 'Morning & Evening', duration: 'Ongoing' }
      ]
    }
  ];

  const beforeAfterPhotos = [
    {
      id: 1,
      treatment: 'HydraFacial',
      date: 'Oct 15, 2025',
      beforeUrl: 'https://i.pravatar.cc/300?img=12',
      afterUrl: 'https://i.pravatar.cc/300?img=13',
      notes: '30 days post-treatment'
    },
    {
      id: 2,
      treatment: 'Chemical Peel',
      date: 'Sep 10, 2025',
      beforeUrl: 'https://i.pravatar.cc/300?img=14',
      afterUrl: 'https://i.pravatar.cc/300?img=15',
      notes: 'Significant improvement in skin texture'
    }
  ];

  const consultationNotes = [
    {
      id: 1,
      date: 'Oct 15, 2025',
      doctor: 'Dr. Rickson Pereira',
      chiefComplaint: 'Pigmentation on cheeks and forehead',
      examination: 'Melasma Grade 2, Sun-induced hyperpigmentation',
      diagnosis: 'Melasma with post-inflammatory hyperpigmentation',
      treatment: 'HydraFacial with brightening serum',
      recommendations: 'Continue sunscreen, start Tretinoin 0.025%',
      followUp: 'Nov 15, 2025'
    },
    {
      id: 2,
      date: 'Sep 10, 2025',
      doctor: 'Dr. Shilpa Gill',
      chiefComplaint: 'Acne scars and uneven skin tone',
      examination: 'Atrophic acne scars, PIH on cheeks',
      diagnosis: 'Post-acne scarring with hyperpigmentation',
      treatment: 'Glycolic acid chemical peel 30%',
      recommendations: 'Home care with AHA products',
      followUp: 'Oct 10, 2025'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'treatments', label: 'Treatment History' },
    { id: 'photos', label: 'Before/After Photos' },
    { id: 'consultations', label: 'Consultation Notes' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'documents', label: 'Documents' },
    { id: 'billing', label: 'Billing History' }
  ];

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Medical Records</h1>
        <p className="text-lg text-gray-600">Comprehensive patient medical history and records</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { title: 'Total Patients', value: statistics.totalPatients.toString(), icon: UsersIcon, color: 'blue', change: '+12%' },
          { title: 'Active Records', value: statistics.totalPatients.toString(), icon: DocumentIcon, color: 'green', change: '+8%' },
          { title: 'This Month', value: '23', icon: CalendarIcon, color: 'purple', change: '+15%' },
          { title: 'Premium Members', value: statistics.premiumMembers.toString(), icon: StarIcon, color: 'yellow', change: '+20%' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className={`bg-white rounded-3xl p-8 shadow-sm border-2 border-${stat.color}-100 hover:shadow-xl transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-bold text-zennara-green">{stat.change}</span>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-10 shadow-lg border border-gray-200 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Search Patient Records</h3>
        <div className="relative">
          <UsersIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-7 h-7 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, ID, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-8 py-5 pl-20 bg-white border-2 border-gray-200 rounded-2xl text-lg font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all hover:border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-5 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Patients ({allPatients.length})</h2>
          <p className="text-base text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{startIndex + 1}-{Math.min(endIndex, allPatients.length)}</span> of <span className="text-gray-900 font-bold">{allPatients.length}</span>
          </p>
        </div>

        {currentPatients.map((pat) => (
          <div
            key={pat.id}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              {/* Left - Patient Info */}
              <div className="flex items-center space-x-6 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={pat.image}
                    alt={pat.name}
                    className="w-24 h-24 rounded-2xl border-2 border-gray-200 shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zennara-green rounded-full border-3 border-white"></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{pat.name}</h3>
                    <span className={`px-4 py-1.5 rounded-xl font-bold text-xs border-2 ${getMemberBadgeColor(pat.memberType)}`}>
                      {pat.memberType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Patient ID</p>
                      <p className="font-bold text-gray-900 text-base">{pat.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Age / Gender</p>
                      <p className="font-semibold text-gray-900 text-base">{pat.age} • {pat.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Contact</p>
                      <p className="font-semibold text-gray-900 text-base">{pat.phone.slice(0, 15)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                      <p className="font-semibold text-gray-900 text-base">{pat.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Stats */}
              <div className="flex items-center space-x-8 ml-8 border-l border-gray-100 pl-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{pat.totalVisits}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-zennara-green">{pat.totalSpent}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Total Spent</p>
                </div>
                <button 
                  onClick={() => navigate(`/patients/records/${pat.id}`)}
                  className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-bold transition-all flex items-center space-x-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>View Records</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-12">
        {/* Items Per Page */}
        <div className="flex items-center space-x-4">
          <label className="text-base font-semibold text-gray-600">Show:</label>
          <div className="relative">
            <select 
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="pl-5 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-base text-gray-500">entries per page</span>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
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
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
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
              <span className="px-4 text-gray-400">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Total Info */}
        <div className="text-base text-gray-600">
          Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
