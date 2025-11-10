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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const isPositiveGrowth = data.weeklyGrowth >= 0;
  const completionRate = data.totalAppointments > 0 ? ((data.completedAppointments / data.totalAppointments) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-500">Quick insights into your business performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md"
              >
                Refresh
              </button>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row with Visual Enhancements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <EnhancedStatCard
            label="Total Revenue"
            value={formatCurrency(data.totalRevenue)}
            trend={`${isPositiveGrowth ? '+' : ''}${data.weeklyGrowth.toFixed(1)}%`}
            trendUp={isPositiveGrowth}
            icon={<DollarIcon />}
            color="blue"
            progress={Math.min((data.totalRevenue / 1000000) * 100, 100)}
          />
          <EnhancedStatCard
            label="Total Patients"
            value={formatNumber(data.totalPatients)}
            sublabel={`${data.newPatients} new this month`}
            icon={<UsersIcon />}
            color="purple"
            progress={(data.newPatients / data.totalPatients) * 100 || 0}
          />
          <EnhancedStatCard
            label="Appointments"
            value={formatNumber(data.totalAppointments)}
            sublabel={`${completionRate}% completed`}
            icon={<CalendarIcon />}
            color="emerald"
            progress={completionRate}
          />
          <EnhancedStatCard
            label="Orders"
            value={formatNumber(data.totalOrders)}
            sublabel={`${data.pendingOrders} pending`}
            icon={<ShoppingIcon />}
            color="amber"
            progress={((data.totalOrders - data.pendingOrders) / data.totalOrders) * 100 || 0}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-2">
            <ChartCard title="Revenue Trend" subtitle="Last 7 days performance">
              <RevenueTrendChart data={data.dailyRevenue} formatCurrency={formatCurrency} />
            </ChartCard>
          </div>
          
          {/* Payment Methods Donut */}
          <ChartCard title="Payment Distribution" subtitle="By payment method">
            <PaymentDistributionChart data={data.paymentMethods} formatCurrency={formatCurrency} />
          </ChartCard>
        </div>

        {/* Financial Performance */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
            Financial Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CompactCard
              label="Consultations"
              value={formatCurrency(data.consultationRevenue)}
              icon={<StethoscopeIcon />}
              color="blue"
            />
            <CompactCard
              label="Products"
              value={formatCurrency(data.productRevenue)}
              icon={<BoxIcon />}
              color="emerald"
            />
            <CompactCard
              label="Packages"
              value={formatCurrency(data.packageRevenue)}
              icon={<PackageIcon />}
              color="purple"
            />
            <CompactCard
              label="Avg Transaction"
              value={formatCurrency(data.avgTransaction)}
              icon={<TrendIcon />}
              color="indigo"
            />
          </div>
        </div>

        {/* Appointment Analytics with Chart */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></span>
            Appointment Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
              <CompactCard
                label="Total Bookings"
                value={formatNumber(data.totalAppointments)}
                icon={<CalendarCheckIcon />}
                color="purple"
              />
              <CompactCard
                label="Completed"
                value={formatNumber(data.completedAppointments)}
                icon={<CheckCircleIcon />}
                color="emerald"
              />
              <CompactCard
                label="Pending"
                value={formatNumber(data.pendingAppointments)}
                icon={<ClockIcon />}
                color="amber"
              />
              <CompactCard
                label="Cancelled"
                value={formatNumber(data.cancelledAppointments)}
                icon={<XCircleIcon />}
                color="red"
              />
              <CompactCard
                label="This Week"
                value={formatNumber(data.upcomingThisWeek)}
                icon={<CalendarDaysIcon />}
                color="blue"
              />
            </div>
            <ChartCard title="Status Distribution" subtitle="Appointment breakdown">
              <AppointmentPieChart 
                completed={data.completedAppointments}
                pending={data.pendingAppointments}
                cancelled={data.cancelledAppointments}
              />
            </ChartCard>
          </div>
        </div>

        {/* Patient Metrics */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></span>
            Patient Analytics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <CompactCard
              label="Total Patients"
              value={formatNumber(data.totalPatients)}
              icon={<UserGroupIcon />}
              color="blue"
            />
            <CompactCard
              label="New Patients"
              value={formatNumber(data.newPatients)}
              icon={<UserPlusIcon />}
              color="emerald"
            />
            <CompactCard
              label="Returning"
              value={formatNumber(data.returningPatients)}
              icon={<RefreshIcon />}
              color="purple"
            />
            <CompactCard
              label="Active Members"
              value={formatNumber(data.activeMembers)}
              icon={<BadgeIcon />}
              color="indigo"
            />
            <CompactCard
              label="Inactive"
              value={formatNumber(data.inactivePatients)}
              icon={<AlertIcon />}
              color="amber"
            />
            <CompactCard
              label="Retention"
              value={`${data.retentionRate.toFixed(1)}%`}
              icon={<HeartIcon />}
              color="pink"
            />
          </div>
        </div>

        {/* Order Management */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
            Order Management
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <CompactCard
              label="Total Orders"
              value={formatNumber(data.totalOrders)}
              icon={<ShoppingBagIcon />}
              color="blue"
            />
            <CompactCard
              label="Pending"
              value={formatNumber(data.pendingOrders)}
              icon={<ClockIcon />}
              color="amber"
            />
            <CompactCard
              label="Processing"
              value={formatNumber(data.processingOrders)}
              icon={<CogIcon />}
              color="blue"
            />
            <CompactCard
              label="Shipped"
              value={formatNumber(data.shippedOrders)}
              icon={<TruckIcon />}
              color="purple"
            />
            <CompactCard
              label="Delivered"
              value={formatNumber(data.deliveredOrders)}
              icon={<CheckCircleIcon />}
              color="emerald"
            />
            <CompactCard
              label="Revenue"
              value={formatCurrency(data.orderRevenue)}
              icon={<DollarCircleIcon />}
              color="green"
            />
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-red-500 to-rose-600 rounded-full"></span>
            Critical Alerts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <AlertCompactCard
              label="Low Stock Items"
              value={formatNumber(data.lowStockCount)}
              needsAttention={data.lowStockCount > 0}
              icon={<WarningIcon />}
            />
            <AlertCompactCard
              label="Pending Confirmations"
              value={formatNumber(data.pendingAppointments)}
              needsAttention={data.pendingAppointments > 0}
              icon={<AlertCircleIcon />}
            />
            <AlertCompactCard
              label="Outstanding Payments"
              value={formatCurrency(data.outstandingPayments)}
              needsAttention={data.outstandingPayments > 0}
              icon={<CreditCardIcon />}
            />
            <AlertCompactCard
              label="Inactive Patients"
              value={formatNumber(data.inactivePatients)}
              needsAttention={data.inactivePatients > 0}
              icon={<UserXIcon />}
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div>
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full"></span>
            Additional Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <CompactCard
              label="Transactions"
              value={formatNumber(data.totalTransactions)}
              icon={<ReceiptIcon />}
              color="gray"
            />
            <CompactCard
              label="Daily Avg"
              value={formatNumber(data.avgPerDay?.toFixed(1) || 0)}
              icon={<ChartBarIcon />}
              color="blue"
            />
            <CompactCard
              label="Total Products"
              value={formatNumber(data.totalProducts)}
              icon={<CubeIcon />}
              color="purple"
            />
            <CompactCard
              label="Refunds/Lost"
              value={formatCurrency(data.refundsLost)}
              icon={<ArrowLeftIcon />}
              color="red"
            />
            <CompactCard
              label="Week Growth"
              value={`${isPositiveGrowth ? '+' : ''}${data.weeklyGrowth.toFixed(1)}%`}
              icon={isPositiveGrowth ? <TrendUpIcon /> : <TrendDownIcon />}
              color={isPositiveGrowth ? 'emerald' : 'red'}
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

// Revenue Trend Chart
function RevenueTrendChart({ data, formatCurrency }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No revenue data available</p>
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
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af" 
          style={{ fontSize: '11px' }}
          tickLine={false}
        />
        <YAxis 
          stroke="#9ca3af" 
          style={{ fontSize: '11px' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: 'none', 
            borderRadius: '12px', 
            color: '#fff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
          formatter={(value) => [formatCurrency(value), 'Revenue']}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3b82f6" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorRevenue)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Payment Distribution Chart
function PaymentDistributionChart({ data, formatCurrency }) {
  const methods = Object.entries(data || {}).filter(([_, amount]) => amount > 0);
  
  if (methods.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-sm">No payment data available</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const chartData = methods.map(([name, value], index) => ({ 
    name, 
    value, 
    color: COLORS[index % COLORS.length] 
  }));

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={85} 
            paddingAngle={3} 
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff' 
            }}
            formatter={(value) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Appointment Pie Chart
function AppointmentPieChart({ completed, pending, cancelled }) {
  const chartData = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelled, color: '#ef4444' }
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No appointment data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={85} 
            paddingAngle={3} 
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-4 w-full">
        {chartData.map((entry, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: entry.color }}></div>
            <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
            <span className="text-sm font-bold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
