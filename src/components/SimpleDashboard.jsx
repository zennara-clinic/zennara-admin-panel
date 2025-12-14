import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  getFinancialAnalytics,
  getPatientAnalytics,
  getAppointmentAnalytics,
  getInventoryAnalytics
} from '../services/analyticsService';
import { getOrderStats } from '../services/orderService';
import {
  DollarIcon, UsersIcon, CalendarIcon, ShoppingIcon,
  StethoscopeIcon, BoxIcon, PackageIcon, TrendIcon,
  CalendarCheckIcon, CheckCircleIcon, ClockIcon, XCircleIcon,
  CalendarDaysIcon, UserGroupIcon, UserPlusIcon, RefreshIcon,
  BadgeIcon, AlertIcon, HeartIcon, ShoppingBagIcon,
  CogIcon, TruckIcon, DollarCircleIcon, WarningIcon,
  AlertCircleIcon, CreditCardIcon, UserXIcon, ReceiptIcon,
  ChartBarIcon, CubeIcon, ArrowLeftIcon, TrendUpIcon, TrendDownIcon
} from './IconComponents';

// Enhanced StatCard Component with Glassmorphism
function StatCard({ label, value, sublabel, trend, trendUp, icon, iconBg, accentColor }) {
  const colorMap = {
    emerald: { 
      gradient: 'from-emerald-400 to-teal-500',
      bg: 'from-emerald-50 to-teal-50',
      shadow: 'shadow-emerald-200',
      text: 'text-emerald-700',
      icon: 'from-emerald-500 to-teal-600'
    },
    amber: { 
      gradient: 'from-amber-400 to-orange-500',
      bg: 'from-amber-50 to-orange-50',
      shadow: 'shadow-amber-200',
      text: 'text-amber-700',
      icon: 'from-amber-500 to-orange-600'
    },
    blue: { 
      gradient: 'from-blue-400 to-indigo-500',
      bg: 'from-blue-50 to-indigo-50',
      shadow: 'shadow-blue-200',
      text: 'text-blue-700',
      icon: 'from-blue-500 to-indigo-600'
    },
    purple: { 
      gradient: 'from-purple-400 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
      shadow: 'shadow-purple-200',
      text: 'text-purple-700',
      icon: 'from-purple-500 to-pink-600'
    }
  };
  
  const colors = colorMap[accentColor] || colorMap.blue;
  
  return (
    <div className="group relative">
      {/* Gradient background effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Decorative gradient orb */}
        <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl opacity-30`}></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {/* Icon glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-md opacity-50`}></div>
              <div className="relative text-white">
                {icon}
              </div>
            </div>
            {trend && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs backdrop-blur-xl ${
                trendUp 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' 
                  : 'bg-red-500/10 text-red-600 border border-red-200'
              }`}>
                {trendUp ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 7L7 17M7 17H17M7 17V7" />
                  </svg>
                )}
                {trend}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{label}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
            {sublabel && (
              <p className="text-sm text-gray-500 font-medium mt-2">{sublabel}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced MetricCard Component
function MetricCard({ label, value, icon, iconBg }) {
  const getGradientFromBg = (bg) => {
    const gradientMap = {
      'bg-blue-500': 'from-blue-500 to-indigo-600',
      'bg-emerald-500': 'from-emerald-500 to-teal-600',
      'bg-purple-500': 'from-purple-500 to-pink-600',
      'bg-amber-500': 'from-amber-500 to-orange-600',
      'bg-red-500': 'from-red-500 to-rose-600',
      'bg-indigo-500': 'from-indigo-500 to-purple-600',
      'bg-pink-500': 'from-pink-500 to-rose-600',
      'bg-green-500': 'from-green-500 to-emerald-600',
      'bg-cyan-500': 'from-cyan-500 to-blue-600'
    };
    return gradientMap[iconBg] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${getGradientFromBg(iconBg)} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5">{label}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// Enhanced SectionHeader Component
function SectionHeader({ title, color }) {
  const colorMap = {
    blue: { 
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50/50 to-indigo-50/50',
      text: 'text-blue-700',
      border: 'border-blue-200/50'
    },
    purple: { 
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50/50 to-pink-50/50',
      text: 'text-purple-700',
      border: 'border-purple-200/50'
    },
    emerald: { 
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50/50 to-teal-50/50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/50'
    },
    amber: { 
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50/50 to-orange-50/50',
      text: 'text-amber-700',
      border: 'border-amber-200/50'
    }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className="relative mb-8">
      {/* Decorative line */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${colors.gradient} rounded-full`}></div>
      
      <div className="pl-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
        <div className={`mt-2 h-0.5 w-20 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
      </div>
    </div>
  );
}

export default function SimpleDashboard() {
  const [data, setData] = useState({
    totalRevenue: 0,
    consultationRevenue: 0,
    productRevenue: 0,
    packageRevenue: 0,
    avgTransaction: 0,
    totalTransactions: 0,
    outstandingPayments: 0,
    refundsLost: 0,
    weeklyGrowth: 0,
    dailyRevenue: [],
    paymentMethods: {},
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    upcomingThisWeek: 0,
    avgPerDay: 0,
    totalPatients: 0,
    newPatients: 0,
    returningPatients: 0,
    activeMembers: 0,
    inactivePatients: 0,
    retentionRate: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    orderRevenue: 0,
    lowStockCount: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [financial, patient, appointment, order, inventory] = await Promise.all([
        getFinancialAnalytics().catch(() => ({ data: null })),
        getPatientAnalytics().catch(() => ({ data: null })),
        getAppointmentAnalytics().catch(() => ({ data: null })),
        getOrderStats().catch(() => ({ data: null })),
        getInventoryAnalytics().catch(() => ({ data: null }))
      ]);

      setData({
        // Financial
        totalRevenue: financial.data?.overview?.totalRevenue || 0,
        consultationRevenue: financial.data?.overview?.consultationRevenue || 0,
        productRevenue: financial.data?.overview?.productRevenue || 0,
        packageRevenue: financial.data?.overview?.packageRevenue || 0,
        avgTransaction: financial.data?.overview?.averageTransactionValue || 0,
        totalTransactions: financial.data?.overview?.totalTransactions || 0,
        outstandingPayments: financial.data?.overview?.outstandingPayments || 0,
        refundsLost: financial.data?.overview?.refundsLost || 0,
        weeklyGrowth: financial.data?.overview?.weekOverWeekGrowth || 0,
        dailyRevenue: financial.data?.dailyRevenue || [],
        paymentMethods: financial.data?.paymentMethodDistribution || {},
        
        // Appointments
        totalAppointments: appointment.data?.totalBookings || 0,
        completedAppointments: appointment.data?.completedBookings || 0,
        pendingAppointments: appointment.data?.pendingBookings || 0,
        cancelledAppointments: appointment.data?.cancelledBookings || 0,
        upcomingThisWeek: appointment.data?.upcomingThisWeek || 0,
        avgPerDay: appointment.data?.avgPerDay || 0,
        
        // Patients
        totalPatients: patient.data?.overview?.totalPatients || 0,
        newPatients: patient.data?.overview?.newPatients || 0,
        returningPatients: patient.data?.overview?.returningPatients || 0,
        activeMembers: patient.data?.membershipStatus?.active || 0,
        inactivePatients: patient.data?.inactivePatients?.count || 0,
        retentionRate: patient.data?.overview?.retentionRate || 0,
        
        // Orders
        totalOrders: order.data?.totalOrders || 0,
        pendingOrders: order.data?.pendingOrders || 0,
        processingOrders: order.data?.processingOrders || 0,
        shippedOrders: order.data?.shippedOrders || 0,
        deliveredOrders: order.data?.deliveredOrders || 0,
        orderRevenue: order.data?.totalRevenue || 0,
        
        // Inventory
        lowStockCount: inventory.data?.lowStockCount || 0,
        totalProducts: inventory.data?.totalProducts || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num) => {
    if (!num && num !== 0) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const isPositiveGrowth = data.weeklyGrowth >= 0;
  const completionRate = data.totalAppointments > 0 ? ((data.completedAppointments / data.totalAppointments) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-[1400px] mx-auto px-8 py-8">
        
        {/* Enhanced Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Monitor your business metrics in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              className="group relative inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/50 rounded-2xl text-sm font-semibold text-gray-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            <div className="px-5 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">Last Updated</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Cards with enhanced spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="TOTAL REVENUE"
            value={formatCurrency(data.totalRevenue)}
            trend={`${isPositiveGrowth ? '+' : ''}${data.weeklyGrowth.toFixed(1)}%`}
            trendUp={isPositiveGrowth}
            icon={<DollarIcon />}
            iconBg="bg-emerald-500"
            accentColor="emerald"
          />
          <StatCard
            label="TOTAL PATIENTS"
            value={formatNumber(data.totalPatients)}
            sublabel={`${data.newPatients} new this month`}
            icon={<UsersIcon />}
            iconBg="bg-amber-500"
            accentColor="amber"
          />
          <StatCard
            label="APPOINTMENTS"
            value={formatNumber(data.totalAppointments)}
            sublabel={`${completionRate}% completed`}
            icon={<CalendarIcon />}
            iconBg="bg-blue-500"
            accentColor="blue"
          />
          <StatCard
            label="ORDERS"
            value={formatNumber(data.totalOrders)}
            sublabel={`${data.pendingOrders} pending`}
            icon={<ShoppingIcon />}
            iconBg="bg-purple-500"
            accentColor="purple"
          />
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-xl h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Revenue Trend</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Last 7 days performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-semibold text-gray-500">LIVE</span>
                </div>
              </div>
              <RevenueTrendChart data={data.dailyRevenue} formatCurrency={formatCurrency} />
            </div>
          </div>
          
          {/* Payment Methods Donut */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-xl">
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900">Payment Methods</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">Distribution by type</p>
            </div>
            <PaymentDistributionChart data={data.paymentMethods} formatCurrency={formatCurrency} />
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="mb-12">
          <SectionHeader title="Financial Breakdown" color="blue" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="CONSULTATIONS"
              value={formatCurrency(data.consultationRevenue)}
              icon={<StethoscopeIcon />}
              iconBg="bg-blue-500"
            />
            <MetricCard
              label="PRODUCTS"
              value={formatCurrency(data.productRevenue)}
              icon={<BoxIcon />}
              iconBg="bg-emerald-500"
            />
            <MetricCard
              label="PACKAGES"
              value={formatCurrency(data.packageRevenue)}
              icon={<PackageIcon />}
              iconBg="bg-purple-500"
            />
            <MetricCard
              label="AVG TRANSACTION"
              value={formatCurrency(data.avgTransaction)}
              icon={<TrendIcon />}
              iconBg="bg-indigo-500"
            />
          </div>
        </div>

        {/* Appointment Analytics */}
        <div className="mb-12">
          <SectionHeader title="Appointment Analytics" color="purple" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-4">
              <MetricCard
                label="TOTAL BOOKINGS"
                value={formatNumber(data.totalAppointments)}
                icon={<CalendarCheckIcon />}
                iconBg="bg-purple-500"
              />
              <MetricCard
                label="COMPLETED"
                value={formatNumber(data.completedAppointments)}
                icon={<CheckCircleIcon />}
                iconBg="bg-emerald-500"
              />
              <MetricCard
                label="PENDING"
                value={formatNumber(data.pendingAppointments)}
                icon={<ClockIcon />}
                iconBg="bg-amber-500"
              />
              <MetricCard
                label="CANCELLED"
                value={formatNumber(data.cancelledAppointments)}
                icon={<XCircleIcon />}
                iconBg="bg-red-500"
              />
              <MetricCard
                label="THIS WEEK"
                value={formatNumber(data.upcomingThisWeek)}
                icon={<CalendarDaysIcon />}
                iconBg="bg-blue-500"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-xl">
              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900">Status Distribution</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Appointment breakdown</p>
              </div>
              <AppointmentPieChart 
                completed={data.completedAppointments}
                pending={data.pendingAppointments}
                cancelled={data.cancelledAppointments}
              />
            </div>
          </div>
        </div>

        {/* Patient Analytics */}
        <div className="mb-12">
          <SectionHeader title="Patient Analytics" color="emerald" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <MetricCard
              label="TOTAL PATIENTS"
              value={formatNumber(data.totalPatients)}
              icon={<UserGroupIcon />}
              iconBg="bg-blue-500"
            />
            <MetricCard
              label="NEW PATIENTS"
              value={formatNumber(data.newPatients)}
              icon={<UserPlusIcon />}
              iconBg="bg-emerald-500"
            />
            <MetricCard
              label="RETURNING"
              value={formatNumber(data.returningPatients)}
              icon={<RefreshIcon />}
              iconBg="bg-purple-500"
            />
            <MetricCard
              label="ACTIVE MEMBERS"
              value={formatNumber(data.activeMembers)}
              icon={<BadgeIcon />}
              iconBg="bg-indigo-500"
            />
            <MetricCard
              label="INACTIVE"
              value={formatNumber(data.inactivePatients)}
              icon={<AlertIcon />}
              iconBg="bg-amber-500"
            />
            <MetricCard
              label="RETENTION"
              value={`${data.retentionRate.toFixed(1)}%`}
              icon={<HeartIcon />}
              iconBg="bg-pink-500"
            />
          </div>
        </div>

        {/* Order Management */}
        <div className="mb-12">
          <SectionHeader title="Order Management" color="amber" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <MetricCard
              label="TOTAL ORDERS"
              value={formatNumber(data.totalOrders)}
              icon={<ShoppingBagIcon />}
              iconBg="bg-blue-500"
            />
            <MetricCard
              label="PENDING"
              value={formatNumber(data.pendingOrders)}
              icon={<ClockIcon />}
              iconBg="bg-amber-500"
            />
            <MetricCard
              label="PROCESSING"
              value={formatNumber(data.processingOrders)}
              icon={<CogIcon />}
              iconBg="bg-blue-500"
            />
            <MetricCard
              label="SHIPPED"
              value={formatNumber(data.shippedOrders)}
              icon={<TruckIcon />}
              iconBg="bg-purple-500"
            />
            <MetricCard
              label="DELIVERED"
              value={formatNumber(data.deliveredOrders)}
              icon={<CheckCircleIcon />}
              iconBg="bg-emerald-500"
            />
            <MetricCard
              label="REVENUE"
              value={formatCurrency(data.orderRevenue)}
              icon={<DollarCircleIcon />}
              iconBg="bg-green-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// Enhanced Stat Card with Progress Bar
function EnhancedStatCard({ label, value, sublabel, trend, trendUp, icon, color, progress }) {
  const colorMap = {
    blue: { gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', progress: 'bg-blue-500' },
    purple: { gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50', progress: 'bg-purple-500' },
    emerald: { gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50', progress: 'bg-emerald-500' },
    amber: { gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50', progress: 'bg-amber-500' }
  };
  
  const colors = colorMap[color];
  
  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-sm ${
              trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  trendUp ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                } />
              </svg>
              {trend}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{value}</p>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 ${colors.progress} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
      </div>
    </div>
  );
}

// Chart Card Container
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// Compact Card (Small Size) - Enhanced
function CompactCard({ label, value, icon, color }) {
  const colorMap = {
    blue: { gradient: 'from-blue-500 to-indigo-600', light: 'from-blue-50 to-indigo-50' },
    emerald: { gradient: 'from-emerald-500 to-teal-600', light: 'from-emerald-50 to-teal-50' },
    purple: { gradient: 'from-purple-500 to-pink-600', light: 'from-purple-50 to-pink-50' },
    amber: { gradient: 'from-amber-500 to-orange-600', light: 'from-amber-50 to-orange-50' },
    red: { gradient: 'from-red-500 to-rose-600', light: 'from-red-50 to-rose-50' },
    indigo: { gradient: 'from-indigo-500 to-purple-600', light: 'from-indigo-50 to-purple-50' },
    pink: { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-50 to-rose-50' },
    gray: { gradient: 'from-gray-500 to-gray-600', light: 'from-gray-50 to-gray-100' },
    green: { gradient: 'from-green-500 to-emerald-600', light: 'from-green-50 to-emerald-50' }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// Alert Compact Card - Enhanced
function AlertCompactCard({ label, value, needsAttention, icon }) {
  return (
    <div className={`group relative rounded-2xl p-5 border-2 transition-all duration-300 overflow-hidden ${
      needsAttention 
        ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-lg hover:shadow-xl' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm hover:shadow-md'
    }`}>
      {needsAttention && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-rose-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${
            needsAttention 
              ? 'bg-gradient-to-br from-red-500 to-rose-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            {icon}
          </div>
          {needsAttention && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-lg"></span>
            </span>
          )}
        </div>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${needsAttention ? 'text-red-700' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-2xl font-bold tracking-tight ${needsAttention ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        {needsAttention && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Action Required
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Revenue Trend Chart
function RevenueTrendChart({ data, formatCurrency }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No revenue data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.slice(-7).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: d.revenue || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="50%" stopColor="#6366f1" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke="#94a3b8" 
          style={{ fontSize: '12px', fontWeight: '500' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
        />
        <YAxis 
          stroke="#94a3b8" 
          style={{ fontSize: '12px', fontWeight: '500' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)', 
            borderRadius: '16px', 
            color: '#fff',
            padding: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
          labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
          formatter={(value) => [formatCurrency(value), 'Revenue']}
          cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="url(#colorRevenueGradient)" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorRevenueGradient)"
          animationDuration={2000}
          filter="url(#glow)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Enhanced Payment Distribution Chart
function PaymentDistributionChart({ data, formatCurrency }) {
  const methods = Object.entries(data || {}).filter(([_, amount]) => amount > 0);
  
  if (methods.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No payment data available</p>
        </div>
      </div>
    );
  }

  const COLORS = [
    { main: '#3b82f6', gradient: 'from-blue-400 to-blue-600' },
    { main: '#8b5cf6', gradient: 'from-purple-400 to-purple-600' },
    { main: '#10b981', gradient: 'from-emerald-400 to-emerald-600' },
    { main: '#f59e0b', gradient: 'from-amber-400 to-amber-600' },
    { main: '#ef4444', gradient: 'from-red-400 to-red-600' }
  ];
  
  const chartData = methods.map(([name, value], index) => ({ 
    name, 
    value,
    percentage: ((value / methods.reduce((sum, [_, v]) => sum + v, 0)) * 100).toFixed(1),
    color: COLORS[index % COLORS.length].main,
    gradient: COLORS[index % COLORS.length].gradient
  }));

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <defs>
            {chartData.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
              </linearGradient>
            ))}
          </defs>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            innerRadius={65} 
            outerRadius={95} 
            paddingAngle={2} 
            dataKey="value"
            animationDuration={1500}
            label={CustomLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${index})`}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.2)', 
              borderRadius: '16px', 
              color: '#fff',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            formatter={(value) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 mt-6 w-full">
        {chartData.map((entry, index) => (
          <div key={index} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-4 h-4 rounded-lg bg-gradient-to-br ${entry.gradient} shadow-sm group-hover:shadow-md transition-shadow`}></div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-700">{entry.name}</p>
              <p className="text-[10px] text-gray-500">{entry.percentage}% • {formatCurrency(entry.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Appointment Pie Chart
function AppointmentPieChart({ completed, pending, cancelled }) {
  const chartData = [
    { 
      name: 'Completed', 
      value: completed, 
      color: '#10b981',
      gradient: 'from-emerald-400 to-emerald-600',
      icon: '✓'
    },
    { 
      name: 'Pending', 
      value: pending, 
      color: '#f59e0b',
      gradient: 'from-amber-400 to-amber-600',
      icon: '⏱'
    },
    { 
      name: 'Cancelled', 
      value: cancelled, 
      color: '#ef4444',
      gradient: 'from-red-400 to-red-600',
      icon: '✕'
    }
  ].filter(item => item.value > 0);

  const total = completed + pending + cancelled;

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No appointment data</p>
        </div>
      </div>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <defs>
            {chartData.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`appointment-gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.8}/>
              </linearGradient>
            ))}
            <filter id="appointment-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
          </defs>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            innerRadius={65} 
            outerRadius={95} 
            paddingAngle={2} 
            dataKey="value"
            animationDuration={1500}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#appointment-gradient-${index})`}
                stroke={entry.color}
                strokeWidth={1}
                filter="url(#appointment-shadow)"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.2)', 
              borderRadius: '16px', 
              color: '#fff',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Enhanced Legend */}
      <div className="grid grid-cols-3 gap-4 mt-6 w-full">
        {chartData.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="group relative bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-100 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${entry.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                  {entry.icon}
                </div>
                <span className="text-lg font-black text-gray-900">{entry.value}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{entry.name}</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">{percentage}%</span>
                  <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${entry.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
