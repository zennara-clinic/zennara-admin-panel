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
  LocationIcon,
  HeartIcon,
  PackageIcon,
  TrendingUpIcon,
  OrdersIcon,
  InventoryIcon,
  ShoppingBagIcon,
  CrownIcon,
  UserPlusIcon,
  LightningBoltIcon,
  UserIcon,
  ReceiptIcon
} from './Icons';
import {
  getFinancialAnalytics,
  getMonthlyRevenueTrend,
  getDailyTargetProgress,
  getPatientAnalytics,
  getAppointmentAnalytics,
  getServiceAnalytics,
  getInventoryAnalytics
} from '../services/analyticsService';
import { getOrderStats } from '../services/orderService';
import MonthlyRevenueChart from './charts/MonthlyRevenueChart';
import RevenueByCategoryChart from './charts/RevenueByCategoryChart';
import RevenueByLocationChart from './charts/RevenueByLocationChart';
import PaymentMethodChart from './charts/PaymentMethodChart';

export default function Dashboard() {
  // Tab State
  const [activeTab, setActiveTab] = useState('overview');
  
  // All Analytics State
  const [financialData, setFinancialData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyTarget, setDailyTarget] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'financial', label: 'Financial', icon: CurrencyIcon },
    { id: 'patients', label: 'Patients', icon: UsersIcon },
    { id: 'appointments', label: 'Appointments', icon: CalendarIcon },
    { id: 'services', label: 'Services', icon: HeartIcon },
    { id: 'inventory', label: 'Inventory', icon: InventoryIcon },
    { id: 'orders', label: 'Orders', icon: OrdersIcon },
  ];

  // Fetch All Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics data in parallel
        const [financial, monthly, target, patient, appointment, service, inventory, orders] = await Promise.all([
          getFinancialAnalytics().catch(err => { console.error('Financial:', err); return { data: null }; }),
          getMonthlyRevenueTrend().catch(err => { console.error('Monthly:', err); return { data: [] }; }),
          getDailyTargetProgress().catch(err => { console.error('Target:', err); return { data: null }; }),
          getPatientAnalytics().catch(err => { console.error('Patient:', err); return { data: null }; }),
          getAppointmentAnalytics().catch(err => { console.error('Appointment:', err); return { data: null }; }),
          getServiceAnalytics().catch(err => { console.error('Service:', err); return { data: null }; }),
          getInventoryAnalytics().catch(err => { console.error('Inventory:', err); return { data: null }; }),
          getOrderStats().catch(err => { console.error('Orders:', err); return { data: null }; })
        ]);

        setFinancialData(financial.data);
        setMonthlyRevenue(monthly.data);
        setDailyTarget(target.data);
        setPatientData(patient.data);
        setAppointmentData(appointment.data);
        setServiceData(service.data);
        setInventoryData(inventory.data);
        setOrderData(orders.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Helper functions for formatting
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  const formatCurrency = (num) => {
    if (!num && num !== 0) return '₹0';
    return `₹${num.toLocaleString()}`;
  };

  // Placeholder data for additional sections (can be replaced with backend data)
  const alerts = [];
  const activityFeed = [];
  const todayAppointments = [];
  const topServices = [];
  const doctorPerformance = [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-base">Comprehensive clinic analytics and insights</p>
        </div>

        {/* Apple-Inspired Tab Navigation */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-2xl p-1 inline-flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
            <ExclamationIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Failed to Load Analytics</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab Content */}
        {!loading && !error && (
          <div className="animate-in fade-in duration-300">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Dashboard Overview</h2>
                  <p className="text-gray-600 text-lg">Real-time insights and performance metrics across all departments</p>
                </div>
                
                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Financial KPI */}
                  <div className="group relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <CurrencyIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                        <TrendingUpIcon className="w-3 h-3" />
                        <span>+12%</span>
                      </div>
                    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Revenue</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatCurrency(financialData?.overview?.totalRevenue || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/70 font-medium">Live this month</p>
                    </div>
                  </div>

                  {/* Patients KPI */}
                  <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <UsersIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                        <TrendingUpIcon className="w-3 h-3" />
                        <span>+8%</span>
                      </div>
                    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Patients</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatNumber(patientData?.totalPatients || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/70 font-medium">{formatNumber(patientData?.newPatients || 0)} new this month</p>
                    </div>
                  </div>

                  {/* Appointments KPI */}
                  <div className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <CalendarIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                        <BadgeCheckIcon className="w-3 h-3" />
                        <span>95%</span>
                      </div>
                    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Appointments</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatNumber(appointmentData?.totalBookings || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/70 font-medium">Today's schedule</p>
                    </div>
                  </div>

                  {/* Services KPI */}
                  <div className="group relative bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <HeartIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                        <TrendingUpIcon className="w-3 h-3" />
                        <span>89%</span>
                      </div>
    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Services</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatNumber(serviceData?.servicesProvided || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/70 font-medium">Completed today</p>
                    </div>
                  </div>

                  {/* Inventory KPI */}
                  <div className="group relative bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <InventoryIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30 animate-pulse">
                        <ExclamationIcon className="w-3 h-3" />
                        <span>Alert</span>
                      </div>
                    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Inventory</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatNumber(inventoryData?.lowStockCount || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                      <p className="text-xs text-white/70 font-medium">Low stock items</p>
    </div>
                  </div>

                  {/* Orders KPI */}
                  <div className="group relative bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <OrdersIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                        <ClockIcon className="w-3 h-3" />
                        <span>Active</span>
                      </div>
                    </div>
                    <p className="relative text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Orders</p>
                    <p className="relative text-3xl font-bold text-white mb-2">{formatNumber(orderData?.pendingOrders || 0)}</p>
                    <div className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/70 font-medium">Pending orders</p>
                    </div>
                  </div>
                </div>

                {/* Charts Section - Improved Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Trend Chart */}
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                          <ChartIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span>+15.3%</span>
                      </div>
                    </div>
                    <div className="h-[280px] w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl overflow-hidden">
                      <div className="w-full h-full p-4">
                        <MonthlyRevenueChart data={monthlyRevenue} />
                      </div>
                    </div>
                  </div>

                  {/* Patient Growth Chart */}
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <UsersIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Patient Growth</h3>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                        <UserPlusIcon className="w-4 h-4" />
                        <span>+{formatNumber(patientData?.newPatients || 0)}</span>
                      </div>
                    </div>
                    <div className="h-[280px] w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl relative overflow-hidden p-6">
                      {/* Background Decoration */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl"></div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-between">
                        {/* Top Stats */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-gray-600">Total Patients</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{formatNumber(patientData?.totalPatients || 0)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-600">New This Month</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">+{formatNumber(patientData?.newPatients || 0)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">+8.2%</span>
                          </div>
                        </div>

                        {/* Middle Visual */}
                        <div className="text-center py-4">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl mb-2">
                            <UserPlusIcon className="w-10 h-10 text-white" />
                          </div>
                        </div>

                        {/* Bottom Chart */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                            <span>Last 7 days trend</span>
                            <span className="text-emerald-600 font-semibold">↑ 12%</span>
                          </div>
                          <div className="flex items-end justify-between gap-1.5 h-16 bg-white/50 rounded-xl p-2">
                            <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg h-10 hover:h-12 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg h-12 hover:h-14 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg h-8 hover:h-10 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg h-14 hover:h-16 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-lg h-11 hover:h-13 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-lg h-13 hover:h-15 transition-all duration-300"></div>
                            <div className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-lg h-16 hover:h-full transition-all duration-300 shadow-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule - Full width on smaller screens, spans 2 cols on lg+ */}
                  <div className="lg:col-span-2 group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Today's Schedule</h3>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatNumber(appointmentData?.totalBookings || 0)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl transition-all duration-300 border border-emerald-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Completed</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.completedBookings || 0)} sessions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-600">{((appointmentData?.completedBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all duration-300 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <ClockIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Upcoming</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.upcomingBookings || 0)} scheduled</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">{((appointmentData?.upcomingBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl transition-all duration-300 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                            <XCircleIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Cancelled</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.cancelledBookings || 0)} cancelled</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-orange-600">{((appointmentData?.cancelledBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Quick Actions */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <LightningBoltIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.location.href = '/appointments/new'}
                        className="group w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <PlusIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-bold text-white block text-sm mb-0.5">New Appointment</span>
                          <span className="text-xs text-white/80">Schedule patient consultation</span>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                      <button 
                        onClick={() => window.location.href = '/patients/new'}
                        className="group w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <UserPlusIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-bold text-white block text-sm mb-0.5">Add Patient</span>
                          <span className="text-xs text-white/80">Register new patient</span>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                      <button 
                        onClick={() => window.location.href = '/orders/new'}
                        className="group w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <ShoppingBagIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-bold text-white block text-sm mb-0.5">New Order</span>
                          <span className="text-xs text-white/80">Create product order</span>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl transition-all duration-300 border border-emerald-100">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">New patient registered</p>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Success</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">John Doe - Consultation booked for tomorrow at 10:00 AM</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>2 minutes ago</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              <span>ID: #P12345</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all duration-300 border border-blue-100">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <CurrencyIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">Payment received</p>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Payment</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">₹2,500 - Sarah Smith - Facial Treatment completed</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>15 minutes ago</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ReceiptIcon className="w-3 h-3" />
                              <span>Receipt: #R67890</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl transition-all duration-300 border border-orange-100">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <ExclamationIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">Low stock alert</p>
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse">Urgent</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Vitamin C Serum - Only 3 units remaining in inventory</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>1 hour ago</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <InventoryIcon className="w-3 h-3" />
                              <span>SKU: #VC123</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && financialData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Financial Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive revenue, payments, and financial performance insights</p>
                </div>
                
                {/* Key Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CurrencyIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+12%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatCurrency(financialData?.overview?.totalRevenue || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">This month</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ChartIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span>+8%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Consultation</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatCurrency(financialData?.overview?.consultationRevenue || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">{((financialData?.overview?.consultationRevenue || 0) / (financialData?.overview?.totalRevenue || 1) * 100).toFixed(1)}% of total</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBagIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <span>+15%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Products</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatCurrency(financialData?.overview?.productRevenue || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">{((financialData?.overview?.productRevenue || 0) / (financialData?.overview?.totalRevenue || 1) * 100).toFixed(1)}% of total</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CrownIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                        <span>+22%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Packages</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatCurrency(financialData?.overview?.packageRevenue || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">{((financialData?.overview?.packageRevenue || 0) / (financialData?.overview?.totalRevenue || 1) * 100).toFixed(1)}% of total</p>
                  </div>
                </div>

                {/* Secondary Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                        <span>Alert</span>
                        <ExclamationIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-1">Outstanding</p>
                    <p className="text-2xl font-bold text-orange-900">{formatCurrency(financialData?.overview?.outstandingPayments || 0)}</p>
                    <p className="text-xs text-orange-600 mt-2 font-medium">Pending collections</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ExclamationIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <span>-5%</span>
                        <TrendingUpIcon className="w-3 h-3 rotate-180" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-1">Refunds</p>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(financialData?.overview?.refundsLost || 0)}</p>
                    <p className="text-xs text-red-600 mt-2 font-medium">Revenue lost</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-6 border border-cyan-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ChartIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold">
                        <span>+18%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wide mb-1">Avg Transaction</p>
                    <p className="text-2xl font-bold text-cyan-900">{formatCurrency(financialData?.overview?.averageTransactionValue || 0)}</p>
                    <p className="text-xs text-cyan-600 mt-2 font-medium">Per transaction</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUpIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span>{financialData?.overview?.weekOverWeekGrowth >= 0 ? '+' : ''}{(financialData?.overview?.weekOverWeekGrowth || 0).toFixed(1)}%</span>
                        <TrendingUpIcon className={`w-3 h-3 ${financialData?.overview?.weekOverWeekGrowth >= 0 ? '' : 'rotate-180'}`} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">Growth</p>
                    <p className="text-2xl font-bold text-green-900">{financialData?.overview?.weekOverWeekGrowth >= 0 ? '+' : ''}{(financialData?.overview?.weekOverWeekGrowth || 0).toFixed(1)}%</p>
                    <p className="text-xs text-green-600 mt-2 font-medium">Week over week</p>
                  </div>
                </div>

                {/* Financial Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Revenue Trend Chart */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span>+15.3%</span>
                      </div>
                    </div>
                    <MonthlyRevenueChart data={monthlyRevenue} />
                  </div>

                  {/* Revenue by Category */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <ChartIcon className="w-4 h-4" />
                        <span>4 types</span>
                      </div>
                    </div>
                    <RevenueByCategoryChart data={financialData?.revenueByCategory} />
                  </div>

                  {/* Revenue by Location */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue by Location</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <LocationIcon className="w-4 h-4" />
                        <span>Top 3</span>
                      </div>
                    </div>
                    <RevenueByLocationChart data={financialData?.revenueByLocation} />
                  </div>
                </div>

                {/* Payment Methods & Financial Health */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Payment Methods */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <CurrencyIcon className="w-4 h-4" />
                        <span>Digital</span>
                      </div>
                    </div>
                    <PaymentMethodChart data={financialData?.paymentMethods} />
                  </div>

                  {/* Financial Health Score */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <BadgeCheckIcon className="w-4 h-4" />
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-3xl font-bold text-emerald-900">92</p>
                                <p className="text-xs text-emerald-600 font-medium">Score</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Revenue Growth</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">85%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Profit Margin</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">78%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Cash Flow</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-22 h-2 bg-emerald-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">92%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Debt Ratio</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-18 h-2 bg-emerald-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors duration-300 font-medium text-sm">
                      <span>View All</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CurrencyIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Sarah Smith</p>
                          <p className="text-sm text-gray-600">Facial Treatment - Consultation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">₹3,500</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">John Doe</p>
                          <p className="text-sm text-gray-600">Skincare Package - Premium</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">₹12,000</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <CrownIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Emma Wilson</p>
                          <p className="text-sm text-gray-600">Annual Membership - Gold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">₹25,000</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && patientData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Patient Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive patient demographics, acquisition trends, and health insights</p>
                </div>
                
                {/* Key Patient Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <UsersIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+8%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Patients</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatNumber(patientData?.totalPatients || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Active patients</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <UserPlusIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span>+23</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">New Patients</p>
                    <p className="text-2xl font-bold text-blue-900">{formatNumber(patientData?.newPatients || 0)}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">This month</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HeartIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <span>89%</span>
                        <BadgeCheckIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Returning</p>
                    <p className="text-2xl font-bold text-purple-900">{formatNumber(patientData?.returningPatients || 0)}</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium">Loyalty rate</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-6 border border-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CrownIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                        <span>+12%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-pink-700 uppercase tracking-wide mb-1">VIP Patients</p>
                    <p className="text-2xl font-bold text-pink-900">{formatNumber(patientData?.vipPatients || 0)}</p>
                    <p className="text-xs text-pink-600 mt-2 font-medium">Premium members</p>
                  </div>
                </div>

                {/* Patient Demographics & Health Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Age Distribution */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Age Distribution</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <UsersIcon className="w-4 h-4" />
                        <span>All ages</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">18-25 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-8 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">25%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">26-35 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-12 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">35%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">36-45 years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-8 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">25%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">46+ years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-4 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gender Distribution */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Gender Distribution</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <UsersIcon className="w-4 h-4" />
                        <span>Balanced</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-900">68%</p>
                                <p className="text-xs text-emerald-600 font-medium">Female</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-emerald-50 rounded-2xl">
                          <p className="text-lg font-bold text-emerald-900">68%</p>
                          <p className="text-sm text-emerald-600 font-medium">Female</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-2xl">
                          <p className="text-lg font-bold text-blue-900">32%</p>
                          <p className="text-sm text-blue-600 font-medium">Male</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Types */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Popular Treatments</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <HeartIcon className="w-4 h-4" />
                        <span>Top 5</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Facial Treatment</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">45%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Skin Care</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">28%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Anti-Aging</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">18%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">Hair Treatment</span>
                        </div>
                        <span className="text-sm font-semibold text-pink-700">9%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Growth & Retention */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patient Growth Trend */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Patient Growth Trend</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span>+23%</span>
                      </div>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                      <div className="text-center">
                        <UserPlusIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-emerald-900">{formatNumber(patientData?.newPatients || 0)}</p>
                        <p className="text-sm text-emerald-600 font-medium">New patients this month</p>
                        <div className="mt-4 flex items-center justify-center gap-1">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-3 h-12 bg-emerald-400 rounded-full" style={{height: `${Math.random() * 100}%`}}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Retention Metrics */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Retention Metrics</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <BadgeCheckIcon className="w-4 h-4" />
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <BadgeCheckIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Retention Rate</p>
                            <p className="text-sm text-gray-600">Patients returning</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">89%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Avg Visit Frequency</p>
                            <p className="text-sm text-gray-600">Per month</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">2.3</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                            <CrownIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">VIP Conversion</p>
                            <p className="text-sm text-gray-600">To premium</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-semibold">24%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors duration-300 font-medium text-sm">
                      <span>View All</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <UserCheckIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">New patient - Facial consultation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">28F</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <UserCheckIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Michael Chen</p>
                          <p className="text-sm text-gray-600">Returning - Skin care treatment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">35M</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                          <CrownIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Emma Williams</p>
                          <p className="text-sm text-gray-600">VIP member - Annual package</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-900">42F</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && appointmentData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Appointment Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive booking trends, calendar insights, and attendance metrics</p>
                </div>
                
                {/* Key Appointment Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+15%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatNumber(appointmentData?.totalBookings || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">All time</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span>95%</span>
                        <BadgeCheckIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Confirmed</p>
                    <p className="text-2xl font-bold text-blue-900">{formatNumber(appointmentData?.confirmedBookings || 0)}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Ready to attend</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                        <span>8</span>
                        <ClockIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-900">{formatNumber(appointmentData?.pendingBookings || 0)}</p>
                    <p className="text-xs text-orange-600 mt-2 font-medium">Awaiting confirmation</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BadgeCheckIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span>Excellent</span>
                        <BadgeCheckIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">Attendance</p>
                    <p className="text-2xl font-bold text-green-900">{(appointmentData?.attendanceRate || 0).toFixed(1)}%</p>
                    <p className="text-xs text-green-600 mt-2 font-medium">Show rate</p>
                  </div>
                </div>

                {/* Today's Schedule & Weekly Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Today's Schedule */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatNumber(appointmentData?.totalBookings || 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Completed</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.completedBookings || 0)}</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">{((appointmentData?.completedBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Upcoming</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.upcomingBookings || 0)}</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">{((appointmentData?.upcomingBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                            <XCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Cancelled</p>
                            <p className="text-sm text-gray-600">{formatNumber(appointmentData?.cancelledBookings || 0)}</p>
                          </div>
                        </div>
                        <div className="text-orange-600 font-semibold">{((appointmentData?.cancelledBookings || 0) / (appointmentData?.totalBookings || 1) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Trend */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Weekly Trend</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span>+12%</span>
                      </div>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                      <div className="text-center">
                        <CalendarIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-emerald-900">{formatNumber(appointmentData?.totalBookings || 0)}</p>
                        <p className="text-sm text-emerald-600 font-medium">Appointments this week</p>
                        <div className="mt-4 flex items-center justify-center gap-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className="w-2 h-12 bg-emerald-400 rounded-full" style={{height: `${Math.random() * 100}%`}}></div>
                              <span className="text-xs text-gray-500">{day.slice(0, 1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Types */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Appointment Types</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <HeartIcon className="w-4 h-4" />
                        <span>5 types</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Consultation</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">45%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Treatment</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">30%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Follow-up</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">15%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">Check-up</span>
                        </div>
                        <span className="text-sm font-semibold text-pink-700">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slot Analysis & Cancellation Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Peak Hours */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Peak Hours Analysis</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <ClockIcon className="w-4 h-4" />
                        <span>Busy</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">9:00 AM - 12:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-24 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">12:00 PM - 3:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-20 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">62%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">3:00 PM - 6:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-16 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">50%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">6:00 PM - 9:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-8 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">25%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Metrics */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Cancellation Metrics</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                        <ExclamationIcon className="w-4 h-4" />
                        <span>Monitor</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                            <XCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Cancellation Rate</p>
                            <p className="text-sm text-gray-600">Last 30 days</p>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold">12%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Late Cancellations</p>
                            <p className="text-sm text-gray-600">&lt; 24h notice</p>
                          </div>
                        </div>
                        <div className="text-orange-600 font-semibold">8%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <TrendingUpIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">No-show Rate</p>
                            <p className="text-sm text-gray-600">Missed appointments</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">5%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors duration-300 font-medium text-sm">
                      <span>View All</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">Facial Treatment - 10:00 AM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Michael Chen</p>
                          <p className="text-sm text-gray-600">Consultation - 2:00 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          <ClockIcon className="w-3 h-3" />
                          <span>Upcoming</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">In 3 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Emma Williams</p>
                          <p className="text-sm text-gray-600">Skin Care - 4:30 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                          <ClockIcon className="w-3 h-3" />
                          <span>Pending</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && serviceData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Service Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive treatment performance, revenue breakdowns, and utilization metrics</p>
                </div>
                
                {/* Key Service Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HeartIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+18%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Services</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatNumber(serviceData?.totalServices || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Available treatments</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <StarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span>89%</span>
                        <BadgeCheckIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Provided</p>
                    <p className="text-2xl font-bold text-blue-900">{formatNumber(serviceData?.servicesProvided || 0)}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Completed treatments</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUpIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <span>Top</span>
                        <StarIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Most Popular</p>
                    <p className="text-lg font-bold text-purple-900">{serviceData?.topService?.name || 'N/A'}</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium">Highest demand</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-6 border border-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CurrencyIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                        <span>+25%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-pink-700 uppercase tracking-wide mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-pink-900">{formatCurrency(serviceData?.totalRevenue || 0)}</p>
                    <p className="text-xs text-pink-600 mt-2 font-medium">Service income</p>
                  </div>
                </div>

                {/* Service Performance & Utilization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Service Categories */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Service Categories</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <HeartIcon className="w-4 h-4" />
                        <span>6 types</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Facial Treatments</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">35%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Skin Care</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">25%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Anti-Aging</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">20%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">Hair Treatment</span>
                        </div>
                        <span className="text-sm font-semibold text-pink-700">12%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-medium text-gray-900">Body Treatments</span>
                        </div>
                        <span className="text-sm font-semibold text-orange-700">8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue by Service */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue by Service</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <CurrencyIcon className="w-4 h-4" />
                        <span>Top 5</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Premium Facial</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-28 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹45K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Skin Care Package</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-24 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹38K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Anti-Aging Treatment</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-20 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹32K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Hair Spa</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-16 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹25K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Body Massage</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-12 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹18K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Utilization */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Service Utilization</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <ChartIcon className="w-4 h-4" />
                        <span>High</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-900">78%</p>
                                <p className="text-xs text-emerald-600 font-medium">Utilized</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                              <BadgeCheckIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">Peak Hours</span>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">92%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                              <ClockIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">Avg Duration</span>
                          </div>
                          <span className="text-sm font-semibold text-blue-700">45 min</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                              <TrendingUpIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">Efficiency</span>
                          </div>
                          <span className="text-sm font-semibold text-purple-700">85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Performing Services & Customer Satisfaction */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Services */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Top Performing Services</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <StarIcon className="w-4 h-4" />
                        <span>Best</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                            <HeartIcon className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Premium Facial Treatment</p>
                            <p className="text-sm text-gray-600">156 sessions this month</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">₹45K</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <StarIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Skin Care Package</p>
                            <p className="text-sm text-gray-600">132 sessions this month</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">₹38K</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Anti-Aging Treatment</p>
                            <p className="text-sm text-gray-600">98 sessions this month</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-semibold">₹32K</div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Satisfaction */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <BadgeCheckIcon className="w-4 h-4" />
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <StarIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Average Rating</p>
                            <p className="text-sm text-gray-600">Service quality</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">4.8/5</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <HeartIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Repeat Rate</p>
                            <p className="text-sm text-gray-600">Customer loyalty</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">76%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                            <TrendingUpIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Referral Rate</p>
                            <p className="text-sm text-gray-600">New customers</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-semibold">32%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && inventoryData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Inventory Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive stock levels, demand predictions, and supplier performance metrics</p>
                </div>
                
                {/* Key Inventory Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <InventoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+12</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatNumber(inventoryData?.totalProducts || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Active SKUs</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ExclamationIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                        <span>Alert</span>
                        <ExclamationIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-1">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-900">{formatNumber(inventoryData?.lowStockCount || 0)}</p>
                    <p className="text-xs text-orange-600 mt-2 font-medium">Need restocking</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <PackageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <span>Urgent</span>
                        <ExclamationIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-1">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-900">{formatNumber(inventoryData?.outOfStockCount || 0)}</p>
                    <p className="text-xs text-red-600 mt-2 font-medium">Unavailable</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CurrencyIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <span>+18%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(inventoryData?.totalValue || 0)}</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium">Inventory worth</p>
                  </div>
                </div>

                {/* Stock Analytics & Predictions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Stock Levels */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Stock Levels</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <InventoryIcon className="w-4 h-4" />
                        <span>Live</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">In Stock</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-24 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Low Stock</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-6 h-3 bg-orange-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-orange-700">18%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Out of Stock</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-red-700">7%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demand Predictions */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Demand Predictions</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span>AI</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <TrendingUpIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">High Demand</p>
                            <p className="text-xs text-gray-600">Next 7 days</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">12 items</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                            <ChartIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Moderate Demand</p>
                            <p className="text-xs text-gray-600">Next 7 days</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">28 items</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                            <TrendingUpIcon className="w-4 h-4 text-white rotate-180" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Low Demand</p>
                            <p className="text-xs text-gray-600">Next 7 days</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">45 items</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <StarIcon className="w-4 h-4" />
                        <span>Best</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Premium Serum</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">245 units</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Face Cream</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">189 units</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Anti-Aging Kit</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">156 units</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">Hair Oil</span>
                        </div>
                        <span className="text-sm font-semibold text-pink-700">134 units</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supplier Performance & Reorder Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Supplier Performance */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Supplier Performance</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <BadgeCheckIcon className="w-4 h-4" />
                        <span>Good</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <BadgeCheckIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">On-Time Delivery</p>
                            <p className="text-sm text-gray-600">Supplier reliability</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">92%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <StarIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Quality Score</p>
                            <p className="text-sm text-gray-600">Product quality</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">4.7/5</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                            <CurrencyIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Cost Efficiency</p>
                            <p className="text-sm text-gray-600">Price optimization</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-semibold">85%</div>
                      </div>
                    </div>
                  </div>

                  {/* Reorder Alerts */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Reorder Alerts</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                        <ExclamationIcon className="w-4 h-4" />
                        <span>Urgent</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                            <PackageIcon className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Premium Serum</p>
                            <p className="text-sm text-gray-600">Out of stock - Critical</p>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold">0 units</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <InventoryIcon className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Face Cream</p>
                            <p className="text-sm text-gray-600">Low stock - Reorder soon</p>
                          </div>
                        </div>
                        <div className="text-orange-600 font-semibold">12 units</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                            <PackageIcon className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Anti-Aging Kit</p>
                            <p className="text-sm text-gray-600">Moderate stock - Monitor</p>
                          </div>
                        </div>
                        <div className="text-yellow-600 font-semibold">28 units</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory Movement */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Inventory Movement</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors duration-300 font-medium text-sm">
                      <span>View All</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <PackageIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Premium Serum Stock In</p>
                          <p className="text-sm text-gray-600">New batch received - Supplier A</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          <TrendingUpIcon className="w-3 h-3" />
                          <span>+150</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <InventoryIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Face Cream Sold Out</p>
                          <p className="text-sm text-gray-600">Last 12 units sold - High demand</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                          <ExclamationIcon className="w-3 h-3" />
                          <span>0 left</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                          <PackageIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Anti-Aging Kit Restocked</p>
                          <p className="text-sm text-gray-600">Emergency order fulfilled</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                          <TrendingUpIcon className="w-3 h-3" />
                          <span>+75</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && orderData && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Order Analytics</h2>
                  <p className="text-gray-600 text-lg">Comprehensive sales trends, fulfillment metrics, and customer order insights</p>
                </div>
                
                {/* Key Order Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <OrdersIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <span>+22%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-emerald-900">{formatNumber(orderData?.totalOrders || 0)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">All time</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                        <span>Active</span>
                        <ClockIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-900">{formatNumber(orderData?.pendingOrders || 0)}</p>
                    <p className="text-xs text-orange-600 mt-2 font-medium">In process</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span>95%</span>
                        <BadgeCheckIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Delivered</p>
                    <p className="text-2xl font-bold text-blue-900">{formatNumber(orderData?.deliveredOrders || 0)}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Completed</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CurrencyIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <span>+28%</span>
                        <TrendingUpIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(orderData?.totalRevenue || 0)}</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium">Total sales</p>
                  </div>
                </div>

                {/* Order Trends & Fulfillment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Order Status Distribution */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <ChartIcon className="w-4 h-4" />
                        <span>Live</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Delivered</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-28 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">87%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Processing</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-4 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-blue-700">12%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Cancelled</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-red-700">1%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment Performance */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Fulfillment Performance</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <BadgeCheckIcon className="w-4 h-4" />
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <BadgeCheckIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">On-Time Delivery</p>
                            <p className="text-xs text-gray-600">Last 30 days</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">94%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                            <ClockIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Avg Processing</p>
                            <p className="text-xs text-gray-600">Time to ship</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">2.5 hrs</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Customer Rating</p>
                            <p className="text-xs text-gray-600">Delivery service</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">4.6/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Best Selling Products</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <StarIcon className="w-4 h-4" />
                        <span>Top</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <StarIcon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Premium Serum</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">342 orders</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Face Cream</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">289 orders</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <CrownIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Anti-Aging Kit</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">198 orders</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-900">Hair Oil</span>
                        </div>
                        <span className="text-sm font-semibold text-pink-700">167 orders</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Analytics & Customer Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by Category */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <CurrencyIcon className="w-4 h-4" />
                        <span>Monthly</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Skin Care</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-24 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹78K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Hair Care</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-16 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹52K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Body Care</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-12 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹38K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Makeup</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-8 h-3 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-emerald-700">₹25K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Insights */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <UsersIcon className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Repeat Customers</p>
                            <p className="text-sm text-gray-600">Loyalty rate</p>
                          </div>
                        </div>
                        <div className="text-emerald-600 font-semibold">68%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <CurrencyIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Avg Order Value</p>
                            <p className="text-sm text-gray-600">Per transaction</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">₹1,250</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                            <TrendingUpIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Order Frequency</p>
                            <p className="text-sm text-gray-600">Per customer</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-semibold">3.2/mo</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors duration-300 font-medium text-sm">
                      <span>View All</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <OrdersIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #12345</p>
                          <p className="text-sm text-gray-600">Premium Serum + Face Cream - Sarah Johnson</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>Delivered</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <OrdersIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #12346</p>
                          <p className="text-sm text-gray-600">Anti-Aging Kit - Michael Chen</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          <ClockIcon className="w-3 h-3" />
                          <span>Processing</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                          <OrdersIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #12347</p>
                          <p className="text-sm text-gray-600">Hair Oil + Body Care - Emma Williams</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                          <ClockIcon className="w-3 h-3" />
                          <span>Processing</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    );
}
