import { useState, useEffect } from 'react';
import {
  UsersIcon,
  UserPlusIcon,
  TrendingUpIcon,
  CakeIcon,
  ExclamationIcon,
  ChartIcon
} from '../../components/Icons';
import {
  getPatientAnalytics,
  getPatientAcquisitionTrend,
  getTopPatients,
  getPatientDemographics,
  getPatientSources,
  sendBirthdayWish
} from '../../services/analyticsService';

export default function PatientCustomerAnalytics() {
  const [patientData, setPatientData] = useState(null);
  const [acquisitionTrend, setAcquisitionTrend] = useState([]);
  const [topPatients, setTopPatients] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [sendingWishes, setSendingWishes] = useState({}); // Track sending status per user

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [patients, acquisition, top, demo, src] = await Promise.all([
        getPatientAnalytics({ days: dateRange }),
        getPatientAcquisitionTrend(),
        getTopPatients(5),
        getPatientDemographics(),
        getPatientSources()
      ]);

      setPatientData(patients.data);
      setAcquisitionTrend(acquisition.data);
      setTopPatients(top.data);
      setDemographics(demo.data);
      setSources(src.data);
    } catch (err) {
      console.error('Error fetching patient analytics:', err);
      setError('Failed to load patient analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWish = async (patient) => {
    try {
      // Mark this patient as sending
      setSendingWishes(prev => ({ ...prev, [patient._id]: true }));

      // Send birthday wish
      await sendBirthdayWish(patient._id);

      // Show success message (you can add a toast notification here)
      alert(`🎉 Birthday wish sent successfully to ${patient.name}!`);

      // Mark as sent
      setSendingWishes(prev => ({ ...prev, [patient._id]: false }));
    } catch (error) {
      console.error('Error sending birthday wish:', error);
      alert(`❌ Failed to send birthday wish to ${patient.name}. Please try again.`);
      
      // Reset sending state
      setSendingWishes(prev => ({ ...prev, [patient._id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-sm border border-gray-200">
          <ExclamationIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2.5 bg-zennara-green text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!patientData) return null;

  const { overview, birthdaysToday, inactivePatients, membershipStatus } = patientData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Patient & Customer</h1>
              <p className="text-base text-gray-600">Comprehensive patient insights and demographics</p>
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-zennara-green/20 focus:border-zennara-green transition-all shadow-sm"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Patient Base */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-1 ring-blue-100">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Total Patient Base</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {overview.totalPatients.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Active registered patients</p>
          </div>

          {/* Patient Retention Rate */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ring-1 ring-green-100">
                <TrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Retention Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {overview.retentionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Returning patients</p>
          </div>

          {/* Birthday Patients Today */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center ring-1 ring-pink-100">
                <CakeIcon className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Birthdays Today</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {birthdaysToday.length}
            </p>
            <p className="text-sm text-gray-600">Patients to follow up</p>
          </div>

          {/* Inactive Patients Alert */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center ring-1 ring-orange-100">
                <ExclamationIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Inactive Patients</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {inactivePatients.count}
            </p>
            <p className="text-sm text-gray-600">No visit in 3+ months</p>
          </div>
        </div>

        {/* New vs Returning Ratio + Acquisition Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* New vs Returning Ratio */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">New vs Returning Patients</h3>
              <p className="text-sm text-gray-600">Patient type distribution</p>
            </div>
            
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                {/* Simple donut chart representation */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    strokeDasharray={`${(overview.newPatientRatio / 100) * 251.2} 251.2`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={`${(overview.returningPatientRatio / 100) * 251.2} 251.2`}
                    strokeDashoffset={`-${(overview.newPatientRatio / 100) * 251.2}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-sm font-semibold text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.totalPatients}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-gray-700">New Patients</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{overview.newPatientRatio.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 mt-1">{overview.newPatients} patients</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Returning</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{overview.returningPatientRatio.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 mt-1">{overview.returningPatients} patients</p>
              </div>
            </div>
          </div>

          {/* Patient Acquisition Trend */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Patient Acquisition Trend</h3>
              <p className="text-sm text-gray-600">Monthly new patient registrations</p>
            </div>

            <div className="h-72 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs font-semibold text-gray-500">
                {[100, 75, 50, 25, 0].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>

              {/* Chart area */}
              <div className="ml-12 h-full relative pb-8">
                <div className="h-[calc(100%-2rem)] flex items-end justify-between gap-2">
                  {acquisitionTrend.map((item, index) => {
                    const maxPatients = Math.max(...acquisitionTrend.map(d => d.count));
                    const height = (item.count / maxPatients) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="w-full h-full flex items-end justify-center">
                          <div
                            className="w-full max-w-[32px] bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-300 group-hover:scale-105"
                            style={{ height: `${height}%`, minHeight: height > 0 ? '3px' : '0px' }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Month labels */}
                <div className="flex items-center justify-between gap-1 mt-3">
                  {acquisitionTrend.map((item, index) => {
                    // Extract just the month abbreviation (e.g., "Nov" from "Nov 2024")
                    const monthOnly = item.month.split(' ')[0];
                    return (
                      <div key={index} className="flex-1 text-center">
                        <div 
                          className="text-[10px] font-medium text-gray-600 transform -rotate-45 origin-center whitespace-nowrap"
                          title={item.month}
                        >
                          {monthOnly}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Most Valuable Patients */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200 mb-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Top 5 Most Valuable Patients</h3>
            <p className="text-sm text-gray-600">Highest lifetime spending</p>
          </div>

          <div className="space-y-4">
            {topPatients.map((patient, index) => (
              <div key={patient._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zennara-green to-emerald-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{patient.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{patient.visitCount} visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Age Distribution */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Age Distribution</h3>
              <p className="text-sm text-gray-600">Patient age groups</p>
            </div>

            <div className="space-y-4">
              {demographics.ageGroups.map((group, index) => {
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{group.range}</span>
                      <span className="text-sm font-bold text-gray-900">{group.count} ({group.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Gender Distribution</h3>
              <p className="text-sm text-gray-600">Patient gender breakdown</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    strokeDasharray={`${(demographics.gender.male / demographics.gender.total) * 251.2} 251.2`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="12"
                    strokeDasharray={`${(demographics.gender.female / demographics.gender.total) * 251.2} 251.2`}
                    strokeDashoffset={`-${(demographics.gender.male / demographics.gender.total) * 251.2}`}
                  />
                  {demographics.gender.other > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="12"
                      strokeDasharray={`${(demographics.gender.other / demographics.gender.total) * 251.2} 251.2`}
                      strokeDashoffset={`-${((demographics.gender.male + demographics.gender.female) / demographics.gender.total) * 251.2}`}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-sm font-semibold text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{demographics.gender.total}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Male</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{demographics.gender.male}</p>
                <p className="text-sm text-gray-600 mt-1">{((demographics.gender.male / demographics.gender.total) * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Female</span>
                </div>
                <p className="text-2xl font-bold text-pink-600">{demographics.gender.female}</p>
                <p className="text-sm text-gray-600 mt-1">{((demographics.gender.female / demographics.gender.total) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Sources */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200 mb-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Patient Sources</h3>
            <p className="text-sm text-gray-600">How patients found you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sources.map((source, index) => {
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
                { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
                { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
                { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-100' }
              ];
              const color = colors[index % colors.length];

              return (
                <div key={source.source} className={`${color.bg} rounded-xl p-6 ring-1 ${color.ring}`}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">{source.source}</p>
                  <p className={`text-3xl font-bold ${color.text} mb-1`}>{source.count}</p>
                  <p className="text-sm text-gray-600">{source.percentage.toFixed(1)}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Membership Status + Birthday Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Status */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Membership Status</h3>
              <p className="text-sm text-gray-600">Current membership overview</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 bg-green-50 rounded-xl ring-1 ring-green-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Active</p>
                <p className="text-3xl font-bold text-green-600">{membershipStatus.active}</p>
              </div>
              <div className="text-center p-5 bg-red-50 rounded-xl ring-1 ring-red-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Expired</p>
                <p className="text-3xl font-bold text-red-600">{membershipStatus.expired}</p>
              </div>
              <div className="text-center p-5 bg-orange-50 rounded-xl ring-1 ring-orange-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{membershipStatus.pending}</p>
              </div>
            </div>
          </div>

          {/* Birthday Patients Today */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Birthday Patients Today</h3>
              <p className="text-sm text-gray-600">Send them wishes and special offers</p>
            </div>

            {birthdaysToday.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {birthdaysToday.map((patient) => (
                  <div key={patient._id} className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <CakeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSendWish(patient)}
                      disabled={sendingWishes[patient._id]}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sendingWishes[patient._id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Wish'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CakeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No birthdays today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
