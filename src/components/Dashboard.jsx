import { useState, useEffect } from 'react';
import {
  UsersIcon,
  CalendarIcon,
  CurrencyIcon,
  DoctorIcon,
  PlusIcon,
  DocumentIcon,
  ChartIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationIcon,
  BellIcon,
  BadgeCheckIcon,
  UserCheckIcon,
  XCircleIcon,
  StarIcon,
  LocationIcon
} from './Icons';
import {
  getFinancialAnalytics,
  getMonthlyRevenueTrend,
  getDailyTargetProgress
} from '../services/analyticsService';
import FinancialMetricsCards from './FinancialMetricsCards';
import MonthlyRevenueChart from './charts/MonthlyRevenueChart';
import RevenueByCategoryChart from './charts/RevenueByCategoryChart';
import RevenueByLocationChart from './charts/RevenueByLocationChart';
import PaymentMethodChart from './charts/PaymentMethodChart';

export default function Dashboard() {
  // Financial Analytics State
  const [financialData, setFinancialData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyTarget, setDailyTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Financial Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics data
        const [financial, monthly, target] = await Promise.all([
          getFinancialAnalytics(),
          getMonthlyRevenueTrend(),
          getDailyTargetProgress()
        ]);

        setFinancialData(financial.data);
        setMonthlyRevenue(monthly.data);
        setDailyTarget(target.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load financial analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  const todayMetrics = [
    {
      title: 'Total Appointments',
      value: '45',
      change: '+12%',
      icon: CalendarIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Confirmed',
      value: '38',
      change: '84%',
      icon: CalendarIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: '7',
      change: '16%',
      icon: ClockIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Revenue',
      value: '₹2,45,000',
      change: '+18%',
      icon: CurrencyIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'New Patients',
      value: '12',
      change: '+5',
      icon: UsersIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Repeat Patients',
      value: '33',
      change: '73%',
      icon: UsersIcon,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'No Show Rate',
      value: '2.3%',
      change: '-0.5%',
      icon: ChartIcon,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'App Downloads',
      value: '234',
      change: '+12 today',
      icon: DocumentIcon,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ];

  const activityFeed = [
    { time: '2:45 PM', text: 'Khushnoor checked in for HydraFacial', type: 'checkin' },
    { time: '2:30 PM', text: "Sarah's appointment confirmed", type: 'confirmed' },
    { time: '2:15 PM', text: 'New form submitted by Priya Sharma', type: 'form' },
    { time: '2:00 PM', text: 'Payment received ₹15,000', type: 'payment' },
    { time: '1:45 PM', text: 'Reminder sent to 15 patients', type: 'reminder' },
  ];

  const todayCalendar = [
    {
      time: '10:00 AM',
      patient: 'Khushnoor',
      service: 'HydraFacial',
      doctor: 'Dr. Rickson Pereira',
      status: 'Confirmed',
      hasForm: true,
    },
    {
      time: '11:00 AM',
      patient: 'Sarah Johnson',
      service: 'Botox',
      doctor: 'Dr. Shilpa Gill',
      status: 'Pending',
      hasForm: false,
    },
    {
      time: '12:00 PM',
      patient: 'Priya Sharma',
      service: 'PRP Hair Treatment',
      doctor: 'Dr. Janaki K Yalamanchili',
      status: 'Confirmed',
      hasForm: true,
    },
  ];

  const alerts = [
    { text: '7 appointments pending confirmation', type: 'warning' },
    { text: 'Low stock: Hyaluronic Acid Serum (5 units left)', type: 'critical' },
    { text: '12 patient forms submitted today - needs review', type: 'info' },
  ];

  const topServices = [
    { name: 'HydraFacial', count: 156 },
    { name: 'Botox', count: 134 },
    { name: 'Laser Toning', count: 98 },
    { name: 'Chemical Peel', count: 87 },
    { name: 'Fillers', count: 76 },
  ];

  const doctorPerformance = [
    { name: 'Dr. Rickson Pereira', rating: 4.9, patients: 156, revenue: '₹4,52,000' },
    { name: 'Dr. Shilpa Gill', rating: 4.8, patients: 142, revenue: '₹3,98,000' },
  ];

  const todayAppointments = [
    {
      time: '10:00 AM',
      patient: 'Khushnoor',
      service: 'HydraFacial',
      doctor: 'Dr. Rickson Pereira',
      status: 'Confirmed',
      hasForm: true,
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      time: '11:00 AM',
      patient: 'Priya Sharma',
      service: 'Botox',
      doctor: 'Dr. Shilpa Gill',
      status: 'Pending',
      hasForm: false,
      image: 'https://i.pravatar.cc/150?img=47'
    },
    {
      time: '12:00 PM',
      patient: 'Amit Patel',
      service: 'PRP Hair Treatment',
      doctor: 'Dr. Janaki K Yalamanchili',
      status: 'Confirmed',
      hasForm: true,
      image: 'https://i.pravatar.cc/150?img=33'
    },
    {
      time: '02:30 PM',
      patient: 'Anjali Singh',
      service: 'Laser Toning',
      doctor: 'Dr. Spoorthy Nagineni',
      status: 'Confirmed',
      hasForm: true,
      image: 'https://i.pravatar.cc/150?img=45'
    },
  ];

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-base">Welcome back, Dr. Admin. Here's your clinic overview.</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-semibold">Loading financial analytics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <ExclamationIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Financial Analytics Section */}
      {!loading && !error && financialData && (
        <>
          {/* Financial Metrics Cards */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Financial Overview</h2>
                <p className="text-gray-500 mt-1">Comprehensive revenue analytics and metrics</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-600">
                  Last 30 Days
                </div>
              </div>
            </div>
            <FinancialMetricsCards data={financialData} />
          </div>

          {/* Daily Target Progress */}
          {dailyTarget && (
            <div className="mb-10">
              <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-gray-100 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900">Daily Collection Target</h3>
                    <p className="text-gray-600 mt-1">Track your daily revenue goal progress</p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                    dailyTarget.achieved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {dailyTarget.achieved ? '🎯 Target Achieved!' : '⏱️ In Progress'}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-bold text-gray-500 mb-2">Today's Collection</div>
                    <div className="text-4xl font-extrabold text-zennara-green">
                      ₹{dailyTarget.todayCollection.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-bold text-gray-500 mb-2">Daily Target</div>
                    <div className="text-4xl font-extrabold text-gray-900">
                      ₹{dailyTarget.dailyTarget.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-bold text-gray-500 mb-2">Difference</div>
                    <div className={`text-4xl font-extrabold ${
                      dailyTarget.difference >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {dailyTarget.difference >= 0 ? '+' : ''}₹{Math.abs(dailyTarget.difference).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">Progress</span>
                    <span className="text-lg font-extrabold text-zennara-green">
                      {dailyTarget.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-zennara-green via-emerald-500 to-teal-500 transition-all duration-1000 ease-out flex items-center justify-end pr-4"
                      style={{ width: `${Math.min(dailyTarget.progressPercentage, 100)}%` }}
                    >
                      {dailyTarget.progressPercentage > 10 && (
                        <span className="text-white text-xs font-bold">₹{dailyTarget.todayCollection.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Revenue Trend Chart */}
          <div className="mb-10">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <MonthlyRevenueChart data={monthlyRevenue} />
            </div>
          </div>

          {/* Revenue Breakdown Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Revenue by Category */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <RevenueByCategoryChart data={financialData.revenueByCategory} />
            </div>

            {/* Revenue by Location */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <RevenueByLocationChart data={financialData.revenueByLocation} />
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="mb-10">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <PaymentMethodChart data={financialData.paymentMethodDistribution} />
            </div>
          </div>
        </>
      )}

      {/* Today's Metrics - 8 Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Operational Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {todayMetrics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="relative bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgColor} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-bold text-zennara-green">
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Staff Availability Status */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Availability Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Dr. Rickson Pereira', status: 'Available', location: 'Jubilee Hills', color: 'green' },
            { name: 'Dr. Shilpa Gill', status: 'In Consultation', location: 'Kondapur', color: 'blue' },
            { name: 'Dr. Janaki K Yalamanchili', status: 'Available', location: 'Financial District', color: 'green' },
            { name: 'Dr. Spoorthy Nagineni', status: 'Break', location: 'Jubilee Hills', color: 'yellow' },
            { name: 'Dr. Madhurya', status: 'Off Duty', location: 'Kondapur', color: 'gray' },
            { name: 'Dr. Meghana', status: 'Available', location: 'Financial District', color: 'green' },
          ].map((staff, idx) => (
            <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  staff.color === 'green' ? 'bg-green-500' :
                  staff.color === 'blue' ? 'bg-blue-500' :
                  staff.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></div>
                <p className="font-bold text-gray-900 text-sm">{staff.name}</p>
              </div>
              <p className={`text-xs font-bold mb-1 ${
                staff.color === 'green' ? 'text-green-600' :
                staff.color === 'blue' ? 'text-blue-600' :
                staff.color === 'yellow' ? 'text-yellow-600' :
                'text-gray-500'
              }`}>{staff.status}</p>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <LocationIcon className="w-3 h-3" />
                <span>{staff.location}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts & Notifications - Priority section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-100 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h2>
          <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-2">
            <BellIcon className="w-4 h-4" />
            <span>3 Unread</span>
          </span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-2xl border-2 flex items-start space-x-3 ${
              alert.type === 'critical' ? 'bg-red-100 border-red-300' :
              alert.type === 'warning' ? 'bg-yellow-100 border-yellow-300' :
              'bg-blue-100 border-blue-300'
            }`}>
              {alert.type === 'critical' ? (
                <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : alert.type === 'warning' ? (
                <ExclamationIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              ) : (
                <DocumentIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-semibold text-gray-900 flex-1">{alert.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Activity Feed */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-Time Activity Feed</h2>
        <div className="space-y-3">
          {activityFeed.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'checkin' ? 'bg-blue-100' :
                activity.type === 'confirmed' ? 'bg-green-100' :
                activity.type === 'form' ? 'bg-purple-100' :
                activity.type === 'payment' ? 'bg-emerald-100' :
                'bg-yellow-100'
              }`}>
                {activity.type === 'checkin' ? (
                  <UserCheckIcon className="w-5 h-5 text-blue-600" />
                ) : activity.type === 'confirmed' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                ) : activity.type === 'form' ? (
                  <DocumentIcon className="w-5 h-5 text-purple-600" />
                ) : activity.type === 'payment' ? (
                  <CurrencyIcon className="w-5 h-5 text-emerald-600" />
                ) : (
                  <BellIcon className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600"><span className="font-bold text-gray-900">{activity.time}</span> - {activity.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Today's Appointments</h2>
          <button className="px-5 py-2 bg-zennara-green text-white rounded-xl hover:bg-zennara-green/90 font-medium transition-colors">
            View Full Calendar
          </button>
        </div>
        <div className="space-y-4">
          {todayAppointments.map((appt, index) => (
            <div key={index} className="group relative p-5 rounded-2xl hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={appt.image} 
                      alt={appt.patient}
                      className="w-14 h-14 rounded-2xl shadow-sm border-2 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zennara-green rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-gray-900">{appt.time}</p>
                      <span className="text-gray-300">•</span>
                      <p className="font-semibold text-gray-900">{appt.patient}</p>
                    </div>
                    <p className="text-sm text-gray-500">{appt.service} • {appt.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {appt.hasForm && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <DocumentIcon className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  <span className={`px-4 py-2 rounded-xl font-bold text-xs uppercase ${
                    appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appt.status}
                  </span>
                  <button className="text-zennara-green font-medium text-sm hover:underline">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services & Doctor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Top Services */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Services (This Month)</h2>
          <div className="space-y-3">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-zennara-green">{index + 1}.</span>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                </div>
                <span className="text-lg font-bold text-gray-600">({service.count})</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 bg-zennara-green text-white rounded-xl font-semibold hover:bg-zennara-green/90 transition-colors">
            View Full Report
          </button>
        </div>

        {/* Doctor Performance */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Performance</h2>
          <div className="space-y-4">
            {doctorPerformance.map((doctor, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gradient-to-r from-zennara-green/10 to-emerald-50 border border-zennara-green/20">
                <p className="font-bold text-gray-900 text-lg mb-3">{doctor.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-bold text-gray-900 flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-600" />
                      <span>{doctor.rating}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Patients</span>
                    <span className="font-bold text-gray-900">{doctor.patients} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-bold text-zennara-green">{doctor.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
