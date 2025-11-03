import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend,
  CartesianGrid, XAxis, YAxis
} from 'recharts';
import {
  getFinancialAnalytics,
  getPatientAnalytics,
  getAppointmentAnalytics,
  getInventoryAnalytics
} from '../services/analyticsService';
import { getOrderStats } from '../services/orderService';
import { designTokens } from '../design-system/tokens';

export default function MinimalDashboard() {
  const [data, setData] = useState({
    financial: null,
    patient: null,
    appointment: null,
    order: null,
    inventory: null
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
        financial: financial.data,
        patient: patient.data,
        appointment: appointment.data,
        order: order.data,
        inventory: inventory.data
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
      <div className={`min-h-screen ${designTokens.gradients.backgrounds.neutral} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-20 h-20 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-semibold tracking-tight">Loading Dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${designTokens.gradients.backgrounds.neutral}`}>
      <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-base text-gray-500">
                Real-time analytics and performance insights
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Last Updated</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {/* Financial Section */}
          <FinancialSection data={data.financial} formatCurrency={formatCurrency} formatNumber={formatNumber} />
          
          {/* Patient Section */}
          <PatientSection data={data.patient} formatNumber={formatNumber} />
          
          {/* Appointment Section */}
          <AppointmentSection data={data.appointment} formatNumber={formatNumber} />
          
          {/* Order & Inventory Section */}
          <OrderInventorySection 
            orderData={data.order} 
            inventoryData={data.inventory} 
            formatCurrency={formatCurrency}
            formatNumber={formatNumber} 
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200/60">
          <p className="text-sm text-gray-400 text-center">
            © 2024 Zennara Healthcare • Last refreshed: {new Date().toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// FINANCIAL SECTION
// ========================================
function FinancialSection({ data, formatCurrency, formatNumber }) {
  if (!data) return null;

  const { overview, dailyRevenue, paymentMethodDistribution } = data;
  const isPositiveGrowth = (overview?.weekOverWeekGrowth || 0) >= 0;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${designTokens.gradients.icons.blue} flex items-center justify-center shadow-lg shadow-blue-500/30`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
            <p className="text-sm text-gray-500 mt-0.5">Revenue performance and trends</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border shadow-sm ${
          isPositiveGrowth 
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700' 
            : 'bg-red-50/90 border-red-200 text-red-700'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPositiveGrowth ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
          </svg>
          <span className="text-sm font-bold">
            {isPositiveGrowth ? '+' : ''}{(overview?.weekOverWeekGrowth || 0).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Main Metrics Grid - Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard
          label="Total Revenue"
          value={formatCurrency(overview?.totalRevenue || 0)}
          sublabel="This Month"
          icon="💰"
          gradient="from-blue-500 to-indigo-600"
        />
        <GlassCard
          label="Consultation"
          value={formatCurrency(overview?.consultationRevenue || 0)}
          sublabel={`${overview?.totalTransactions || 0} transactions`}
          icon="🏥"
          gradient="from-emerald-500 to-teal-600"
        />
        <GlassCard
          label="Products"
          value={formatCurrency(overview?.productRevenue || 0)}
          sublabel="From product sales"
          icon="📦"
          gradient="from-purple-500 to-pink-600"
        />
        <GlassCard
          label="Packages"
          value={formatCurrency(overview?.packageRevenue || 0)}
          sublabel="From packages"
          icon="💎"
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - Larger */}
        <div className="lg:col-span-2">
          <AppleChartCard title="Revenue Trend" subtitle="Last 7 days performance">
            <RevenueLineChart data={dailyRevenue || []} formatCurrency={formatCurrency} />
          </AppleChartCard>
        </div>

        {/* Payment Methods Donut */}
        <AppleChartCard title="Payment Methods" subtitle="Distribution by type">
          <PaymentDonutChart data={paymentMethodDistribution || {}} formatCurrency={formatCurrency} />
        </AppleChartCard>
      </div>

      {/* Secondary Metrics - Inline Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MinimalStatCard
          label="Avg Transaction"
          value={formatCurrency(overview?.averageTransactionValue || 0)}
          color="emerald"
        />
        <MinimalStatCard
          label="Outstanding"
          value={formatCurrency(overview?.outstandingPayments || 0)}
          color="amber"
        />
        <MinimalStatCard
          label="Refunds/Lost"
          value={formatCurrency(overview?.refundsLost || 0)}
          color="red"
        />
      </div>
    </section>
  );
}

// ========================================
// PATIENT SECTION
// ========================================
function PatientSection({ data, formatNumber }) {
  if (!data) return null;

  const { overview, membershipStatus, inactivePatients } = data;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${designTokens.gradients.icons.purple} flex items-center justify-center shadow-lg shadow-purple-500/30`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Patient engagement and retention</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metrics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard
              label="Total"
              value={formatNumber(overview?.totalPatients || 0)}
              sublabel="Active patients"
              icon="👥"
              gradient="from-blue-500 to-indigo-600"
            />
            <GlassCard
              label="New"
              value={formatNumber(overview?.newPatients || 0)}
              sublabel={`${(overview?.newPatientRatio || 0).toFixed(1)}%`}
              icon="✨"
              gradient="from-emerald-500 to-teal-600"
            />
            <GlassCard
              label="Returning"
              value={formatNumber(overview?.returningPatients || 0)}
              sublabel={`${(overview?.returningPatientRatio || 0).toFixed(1)}%`}
              icon="🔄"
              gradient="from-purple-500 to-pink-600"
            />
            <GlassCard
              label="Inactive"
              value={formatNumber(inactivePatients?.count || 0)}
              sublabel="Need attention"
              icon="⚠️"
              gradient="from-amber-500 to-orange-600"
            />
          </div>

          {/* Patient Breakdown Chart */}
          <AppleChartCard title="Patient Distribution" subtitle="New vs Returning">
            <PatientBarChart overview={overview} formatNumber={formatNumber} />
          </AppleChartCard>
        </div>

        {/* Right: Retention & Membership */}
        <div className="space-y-4">
          {/* Retention Rate Radial */}
          <AppleChartCard title="Retention Rate" subtitle="3-month retention">
            <RetentionRadialChart rate={overview?.retentionRate || 0} />
          </AppleChartCard>

          {/* Membership Cards */}
          <div className="space-y-3">
            <MinimalStatCard
              label="Active Members"
              value={formatNumber(membershipStatus?.active || 0)}
              color="emerald"
            />
            <MinimalStatCard
              label="Expired Members"
              value={formatNumber(membershipStatus?.expired || 0)}
              color="red"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ========================================
// APPOINTMENT SECTION
// ========================================
function AppointmentSection({ data, formatNumber }) {
  if (!data) return null;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${designTokens.gradients.icons.pink} flex items-center justify-center shadow-lg shadow-pink-500/30`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Booking status and trends</p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Status Distribution */}
        <div className="space-y-4">
          <AppleChartCard title="Appointment Status" subtitle="Distribution by status">
            <AppointmentDonutChart data={data} formatNumber={formatNumber} />
          </AppleChartCard>

          {/* Average Stats */}
          <div className="grid grid-cols-3 gap-3">
            <MinimalStatCard
              label="Daily Avg"
              value={formatNumber(data.avgPerDay?.toFixed(1) || 0)}
              color="blue"
            />
            <MinimalStatCard
              label="Weekly Avg"
              value={formatNumber(data.avgPerWeek?.toFixed(0) || 0)}
              color="purple"
            />
            <MinimalStatCard
              label="Upcoming"
              value={formatNumber(data.upcomingThisWeek || 0)}
              color="emerald"
            />
          </div>
        </div>

        {/* Right: Status Cards */}
        <div className="space-y-3">
          <StatusCard
            label="Total Bookings"
            value={formatNumber(data.totalBookings || 0)}
            sublabel="All appointments"
            color="purple"
            icon="📅"
          />
          <StatusCard
            label="Completed"
            value={formatNumber(data.completedBookings || 0)}
            sublabel={`${data.totalBookings > 0 ? ((data.completedBookings / data.totalBookings) * 100).toFixed(1) : 0}% completion`}
            color="emerald"
            icon="✅"
          />
          <StatusCard
            label="Pending"
            value={formatNumber(data.pendingBookings || 0)}
            sublabel="Awaiting confirmation"
            color="amber"
            icon="⏳"
          />
          <StatusCard
            label="Cancelled"
            value={formatNumber(data.cancelledBookings || 0)}
            sublabel={`${data.totalBookings > 0 ? ((data.cancelledBookings / data.totalBookings) * 100).toFixed(1) : 0}% cancelled`}
            color="red"
            icon="❌"
          />
        </div>
      </div>
    </section>
  );
}

// ========================================
// ORDER & INVENTORY SECTION
// ========================================
function OrderInventorySection({ orderData, inventoryData, formatCurrency, formatNumber }) {
  if (!orderData && !inventoryData) return null;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${designTokens.gradients.icons.emerald} flex items-center justify-center shadow-lg shadow-emerald-500/30`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders & Inventory</h2>
          <p className="text-sm text-gray-500 mt-0.5">Order management and stock levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
        {orderData && (
          <div className="space-y-4">
            <AppleChartCard title="Order Status" subtitle="Distribution by status">
              <OrderPieChart data={orderData} formatNumber={formatNumber} />
            </AppleChartCard>

            <MinimalStatCard
              label="Total Revenue"
              value={formatCurrency(orderData.totalRevenue || 0)}
              sublabel={`From ${formatNumber(orderData.totalOrders || 0)} orders`}
              color="emerald"
            />
          </div>
        )}

        {/* Inventory */}
        {inventoryData && (
          <div className="space-y-4">
            <InventoryAlertCard data={inventoryData} formatNumber={formatNumber} />
          </div>
        )}
      </div>
    </section>
  );
}

// ========================================
// REUSABLE COMPONENTS
// ========================================
function MetricCard({ label, value, sublabel, iconPath, color, size = 'normal' }) {
  const colorConfig = {
    emerald: {
      bg: 'from-emerald-50 via-emerald-50/50 to-white',
      border: 'border-emerald-100',
      icon: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-600'
    },
    blue: {
      bg: 'from-blue-50 via-blue-50/50 to-white',
      border: 'border-blue-100',
      icon: 'from-blue-500 to-indigo-600',
      text: 'text-blue-600'
    },
    purple: {
      bg: 'from-purple-50 via-purple-50/50 to-white',
      border: 'border-purple-100',
      icon: 'from-purple-500 to-pink-600',
      text: 'text-purple-600'
    },
    pink: {
      bg: 'from-pink-50 via-pink-50/50 to-white',
      border: 'border-pink-100',
      icon: 'from-pink-500 to-rose-600',
      text: 'text-pink-600'
    },
    amber: {
      bg: 'from-amber-50 via-amber-50/50 to-white',
      border: 'border-amber-100',
      icon: 'from-amber-500 to-orange-600',
      text: 'text-amber-600'
    },
    red: {
      bg: 'from-red-50 via-red-50/50 to-white',
      border: 'border-red-100',
      icon: 'from-red-500 to-rose-600',
      text: 'text-red-600'
    },
    gray: {
      bg: 'from-gray-50 via-gray-50/50 to-white',
      border: 'border-gray-200',
      icon: 'from-gray-400 to-gray-600',
      text: 'text-gray-600'
    },
    indigo: {
      bg: 'from-indigo-50 via-indigo-50/50 to-white',
      border: 'border-indigo-100',
      icon: 'from-indigo-500 to-purple-600',
      text: 'text-indigo-600'
    }
  };

  const config = colorConfig[color];
  const isSmall = size === 'small';

  return (
    <div className={`group relative bg-gradient-to-br ${config.bg} rounded-2xl ${
      isSmall ? 'p-5' : 'p-7'
    } border ${config.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 group-hover:w-24 group-hover:h-24 transition-all duration-500"></div>
      
      <div className="relative space-y-3">
        {iconPath && (
          <div className={`w-${isSmall ? '10' : '12'} h-${isSmall ? '10' : '12'} rounded-xl bg-gradient-to-br ${config.icon} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
            <svg className={`w-${isSmall ? '5' : '6'} h-${isSmall ? '5' : '6'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
          </div>
        )}
        <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
          {label}
        </p>
        <p className={`${isSmall ? 'text-2xl' : 'text-4xl'} font-bold text-gray-900 tracking-tight leading-none`}>
          {value}
        </p>
        <p className="text-xs text-gray-600 font-medium leading-relaxed">
          {sublabel}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, iconPath, gradient, bgGradient }) {
  return (
    <div className={`relative bg-gradient-to-br ${bgGradient} rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
            {label}
          </p>
          {iconPath && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
              </svg>
            </div>
          )}
        </div>
        <p className="text-4xl font-bold text-gray-900 tracking-tight">
          {value}
        </p>
        {sublabel && (
          <p className="text-sm text-gray-600 font-medium">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, iconPath, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-6">
        {iconPath && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors duration-300">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function MiniAreaChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm text-gray-400 font-medium">No data available</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue || 0));
  const recent7Days = data.slice(-7);

  return (
    <div className="space-y-6">
      {/* Chart Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-transparent rounded-2xl p-4">
        <div className="relative h-40 flex items-end justify-between gap-2">
          {recent7Days.map((day, index) => {
            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
            const isLast = index === recent7Days.length - 1;
            return (
              <div key={index} className="flex-1 relative group">
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer ${
                    isLast
                      ? 'bg-gradient-to-t from-emerald-500 via-emerald-400 to-teal-400 shadow-lg'
                      : 'bg-gradient-to-t from-emerald-500/80 to-emerald-400/80 hover:from-emerald-500 hover:to-emerald-400'
                  }`}
                  style={{ height: `${height}%`, minHeight: '12px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-xl py-2.5 px-4 whitespace-nowrap z-10 shadow-xl">
                    <div className="font-bold text-sm">₹{day.revenue?.toLocaleString('en-IN')}</div>
                    <div className="text-gray-300 text-xs">{new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between px-1">
        {recent7Days.map((day, index) => (
          <div key={index} className="flex-1 text-center">
            <p className="text-xs font-medium text-gray-500">
              {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentMethodsGrid({ data, formatCurrency }) {
  const methods = Object.entries(data || {}).filter(([_, amount]) => amount > 0);
  
  if (methods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <p className="text-sm text-gray-400 font-medium">No payment data available</p>
      </div>
    );
  }

  const total = methods.reduce((sum, [_, amount]) => sum + amount, 0);

  const iconPaths = {
    Cash: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    Card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    UPI: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    'Bank Transfer': 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    COD: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    Other: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };

  const colorGradients = {
    Cash: 'from-emerald-500 to-teal-600',
    Card: 'from-blue-500 to-indigo-600',
    UPI: 'from-purple-500 to-pink-600',
    'Bank Transfer': 'from-amber-500 to-orange-600',
    COD: 'from-cyan-500 to-blue-600',
    Other: 'from-gray-500 to-slate-600'
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {methods.map(([method, amount]) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        const gradient = colorGradients[method] || colorGradients.Other;
        const iconPath = iconPaths[method] || iconPaths.Other;
        
        return (
          <div key={method} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{method}</span>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              {formatCurrency(amount)}
            </p>
            
            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600">{percentage.toFixed(1)}%</p>
                <p className="text-xs text-gray-400">of total</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========================================
// NEW APPLE-INSPIRED COMPONENTS
// ========================================

// Glass Card with Glassmorphism Effect
function GlassCard({ label, value, sublabel, icon, gradient }) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{value}</p>
        <p className="text-xs text-gray-600 font-medium">{sublabel}</p>
      </div>
    </div>
  );
}

// Apple Chart Card Container
function AppleChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// Minimal Stat Card
function MinimalStatCard({ label, value, sublabel, color }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50/80', border: 'border-emerald-200', text: 'text-emerald-700' },
    blue: { bg: 'bg-blue-50/80', border: 'border-blue-200', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50/80', border: 'border-purple-200', text: 'text-purple-700' },
    amber: { bg: 'bg-amber-50/80', border: 'border-amber-200', text: 'text-amber-700' },
    red: { bg: 'bg-red-50/80', border: 'border-red-200', text: 'text-red-700' }
  };
  const config = colorMap[color] || colorMap.blue;
  return (
    <div className={`${config.bg} backdrop-blur-sm rounded-2xl p-4 border ${config.border}`}>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${config.text} tracking-tight`}>{value}</p>
      {sublabel && <p className="text-xs text-gray-600 mt-1">{sublabel}</p>}
    </div>
  );
}

// Status Card
function StatusCard({ label, value, sublabel, color, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-600">{sublabel}</p>
    </div>
  );
}

// Empty State
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}

// Revenue Line Chart
function RevenueLineChart({ data, formatCurrency }) {
  if (!data || data.length === 0) return <EmptyState message="No revenue data available" />;
  const chartData = data.slice(-7).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: d.revenue || 0
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
          formatter={(value) => formatCurrency(value)}
        />
        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Payment Donut Chart
function PaymentDonutChart({ data, formatCurrency }) {
  const methods = Object.entries(data || {}).filter(([_, amount]) => amount > 0);
  if (methods.length === 0) return <EmptyState message="No payment data" />;
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4'];
  const chartData = methods.map(([name, value], index) => ({ name, value, color: COLORS[index % COLORS.length] }));
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(value) => formatCurrency(value)} />
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

// Patient Bar Chart
function PatientBarChart({ overview, formatNumber }) {
  if (!overview) return <EmptyState message="No patient data" />;
  const chartData = [
    { name: 'New', value: overview.newPatients || 0, fill: '#10b981' },
    { name: 'Returning', value: overview.returningPatients || 0, fill: '#8b5cf6' }
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <Tooltip formatter={(value) => formatNumber(value)} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Retention Radial Chart
function RetentionRadialChart({ rate }) {
  const chartData = [{ name: 'Retention', value: rate || 0, fill: '#3b82f6' }];
  return (
    <div className="flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={chartData} startAngle={90} endAngle={90 + (rate * 3.6)}>
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <p className="text-4xl font-bold text-blue-600">{rate.toFixed(1)}%</p>
        <p className="text-xs text-gray-500 mt-1">Retention Rate</p>
      </div>
    </div>
  );
}

// Appointment Donut Chart
function AppointmentDonutChart({ data, formatNumber }) {
  const chartData = [
    { name: 'Completed', value: data.completedBookings || 0, color: '#10b981' },
    { name: 'Pending', value: data.pendingBookings || 0, color: '#f59e0b' },
    { name: 'Cancelled', value: data.cancelledBookings || 0, color: '#ef4444' },
    { name: 'No Show', value: data.noShowBookings || 0, color: '#6b7280' }
  ].filter(item => item.value > 0);
  if (chartData.length === 0) return <EmptyState message="No appointment data" />;
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(value) => formatNumber(value)} />
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

// Order Pie Chart
function OrderPieChart({ data, formatNumber }) {
  const chartData = [
    { name: 'Pending', value: data.pendingOrders || 0, color: '#f59e0b' },
    { name: 'Processing', value: data.processingOrders || 0, color: '#3b82f6' },
    { name: 'Shipped', value: data.shippedOrders || 0, color: '#8b5cf6' },
    { name: 'Delivered', value: data.deliveredOrders || 0, color: '#10b981' }
  ].filter(item => item.value > 0);
  if (chartData.length === 0) return <EmptyState message="No order data" />;
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(value) => formatNumber(value)} />
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

// Inventory Alert Card
function InventoryAlertCard({ data, formatNumber }) {
  const hasLowStock = (data.lowStockCount || 0) > 0;
  return (
    <div className={`relative overflow-hidden rounded-3xl p-10 transition-all duration-500 hover:shadow-2xl ${
      hasLowStock ? 'bg-gradient-to-br from-red-50 via-red-50 to-rose-50 border-2 border-red-200' : 'bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 border-2 border-emerald-200'
    }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
      {hasLowStock && (
        <div className="absolute top-8 right-8">
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600"></span>
          </span>
        </div>
      )}
      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            hasLowStock ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
          }`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Low Stock Alert</p>
        </div>
        <div>
          <p className={`text-7xl font-bold tracking-tight leading-none mb-3 ${hasLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatNumber(data.lowStockCount || 0)}
          </p>
          <p className="text-base text-gray-700 font-medium">
            {hasLowStock ? 'Items need immediate attention' : 'All items adequately stocked'}
          </p>
        </div>
        {hasLowStock && (
          <div className="pt-5 border-t-2 border-red-200/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-700 font-semibold">Action Required: Review inventory levels</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
