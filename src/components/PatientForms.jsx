import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartIcon,
  UsersIcon,
  CalendarIcon,
  LocationIcon,
  ChevronDownIcon,
  EyeIcon,
  BellIcon,
  SettingsIcon
} from './Icons';

export default function PatientForms() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statistics = [
    {
      title: 'Total Forms',
      value: '234',
      icon: DocumentIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Submitted',
      value: '189',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Reviewed',
      value: '156',
      icon: EyeIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Pending',
      value: '45',
      icon: ClockIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    }
  ];

  const forms = [
    {
      id: 'FORM_001234',
      patient: {
        name: 'Khushnoor',
        image: 'https://i.pravatar.cc/150?img=12'
      },
      treatment: 'HydraFacial',
      doctor: 'Dr. Rickson Pereira',
      submitted: 'Oct 15, 2:45 PM',
      status: 'Complete',
      sections: '8/8',
      reviewed: true
    },
    {
      id: 'FORM_001235',
      patient: {
        name: 'Priya Sharma',
        image: 'https://i.pravatar.cc/150?img=47'
      },
      treatment: 'Botox Treatment',
      doctor: 'Dr. Shilpa Gill',
      submitted: 'Not submitted',
      status: 'Pending',
      sections: '5/8',
      reviewed: false
    },
    {
      id: 'FORM_001236',
      patient: {
        name: 'Amit Patel',
        image: 'https://i.pravatar.cc/150?img=33'
      },
      treatment: 'PRP Hair Therapy',
      doctor: 'Dr. Janaki K Yalamanchili',
      submitted: 'Oct 14, 11:20 AM',
      status: 'Needs Review',
      sections: '8/8',
      reviewed: false
    },
    {
      id: 'FORM_001237',
      patient: {
        name: 'Anjali Singh',
        image: 'https://i.pravatar.cc/150?img=45'
      },
      treatment: 'Laser Toning',
      doctor: 'Dr. Spoorthy Nagineni',
      submitted: 'Oct 15, 9:30 AM',
      status: 'Complete',
      sections: '8/8',
      reviewed: true
    },
    {
      id: 'FORM_001238',
      patient: {
        name: 'Rahul Gupta',
        image: 'https://i.pravatar.cc/150?img=51'
      },
      treatment: 'Chemical Peel',
      doctor: 'Dr. Madhurya',
      submitted: 'Oct 14, 3:15 PM',
      status: 'Complete',
      sections: '8/8',
      reviewed: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Needs Review':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActionButton = (status, form) => {
    if (status === 'Complete') {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/patients/forms/${form.id}/view`); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-sm transition-all"
        >
          <EyeIcon className="w-4 h-4" />
          <span>View</span>
        </button>
      );
    } else if (status === 'Pending') {
      return (
        <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl font-semibold text-sm transition-all">
          <BellIcon className="w-4 h-4" />
          <span>Remind</span>
        </button>
      );
    } else {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/patients/forms/${form.id}/view`); }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl font-semibold text-sm transition-all"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Review</span>
        </button>
      );
    }
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Medical Forms</h1>
        <p className="text-gray-500 text-base">Manage and review patient medical forms</p>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Filters & Search</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">STATUS</label>
            <div className="relative">
              <CheckCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>All Status</option>
                <option>Complete</option>
                <option>Pending</option>
                <option>Needs Review</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">DATE RANGE</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all appearance-none cursor-pointer hover:border-gray-300">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
                <option>Custom Range</option>
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
          <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">SEARCH FORMS</label>
          <div className="relative">
            <UsersIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or form ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-16 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all hover:border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
            <ChartIcon className="w-5 h-5" />
            <span>Export All</span>
          </button>
          <button 
            onClick={() => navigate('/patients/forms/settings')}
            className="flex items-center space-x-2 px-6 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Form Template Settings</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${stat.borderColor} hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <div key={form.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              {/* Left - Patient Info */}
              <div className="flex items-center space-x-5 flex-1">
                <img
                  src={form.patient.image}
                  alt={form.patient.name}
                  className="w-16 h-16 rounded-2xl border-2 border-gray-200 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{form.patient.name}</h3>
                    <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase border-2 ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                    {form.reviewed && (
                      <span className="text-xs font-semibold text-green-600">Reviewed</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Form ID</p>
                      <p className="font-bold text-gray-900">{form.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Treatment</p>
                      <p className="font-semibold text-gray-900">{form.treatment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Doctor</p>
                      <p className="font-semibold text-gray-900">{form.doctor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle - Submission Info */}
              <div className="flex flex-col items-center px-6 border-l border-r border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Submitted</p>
                <p className="font-bold text-gray-900 text-center">{form.submitted}</p>
              </div>

              {/* Right - Sections & Action */}
              <div className="flex items-center space-x-4 ml-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Sections</p>
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-gray-900">{form.sections}</span>
                  </div>
                </div>
                {getActionButton(form.status, form)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-10">
        <div className="flex items-center space-x-2">
          <button className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Previous
          </button>
          <button className="px-5 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold shadow-sm">1</button>
          <button className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">2</button>
          <button className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">3</button>
          <button className="px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
