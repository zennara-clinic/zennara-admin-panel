import { useState, useEffect } from 'react';
import {
  CurrencyIcon,
  ChartIcon,
  ExclamationIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon
} from '../../components/Icons';
import {
  getFinancialAnalytics,
  getMonthlyRevenueTrend,
  getDailyTargetProgress
} from '../../services/analyticsService';
import MonthlyRevenueChart from '../../components/charts/MonthlyRevenueChart';
import RevenueByCategoryChart from '../../components/charts/RevenueByCategoryChart';
import RevenueByLocationChart from '../../components/charts/RevenueByLocationChart';
import PaymentMethodChart from '../../components/charts/PaymentMethodChart';

export default function FinancialRevenue() {
  const [financialData, setFinancialData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyTarget, setDailyTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [financial, monthly, target] = await Promise.all([
        getFinancialAnalytics({ days: dateRange }),
        getMonthlyRevenueTrend(),
        getDailyTargetProgress()
      ]);

      setFinancialData(financial.data);
      setMonthlyRevenue(monthly.data);
      setDailyTarget(target.data);
    } catch (err) {
      console.error('Error fetching financial analytics:', err);
      setError('Failed to load financial analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
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

  if (!financialData) return null;

  const { overview } = financialData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Financial & Revenue</h1>
              <p className="text-base text-gray-600">Track your revenue performance</p>
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
          {/* Package Revenue */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center ring-1 ring-pink-100">
                <CurrencyIcon className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Package Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {formatCurrency(overview.packageRevenue)}
            </p>
            <p className="text-sm text-gray-600">
              {((overview.packageRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>

          {/* Consultation Revenue */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-1 ring-blue-100">
                <ChartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Consultation Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {formatCurrency(overview.consultationRevenue)}
            </p>
            <p className="text-sm text-gray-600">
              {((overview.consultationRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>

          {/* Product Revenue */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center ring-1 ring-purple-100">
                <CurrencyIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Product Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {formatCurrency(overview.productRevenue)}
            </p>
            <p className="text-sm text-gray-600">
              {((overview.productRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>

          {/* Refunds & Cancellations */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-100">
                <ExclamationIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Refunds & Cancellations</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {formatCurrency(overview.refundsLost)}
            </p>
            <p className="text-sm text-gray-600">Revenue lost</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <p className="text-sm font-semibold text-gray-500 mb-3">Total Revenue</p>
            <p className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              ₹{overview.totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${
                overview.weekOverWeekGrowth >= 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {overview.weekOverWeekGrowth >= 0 ? '+' : ''}{overview.weekOverWeekGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <p className="text-sm font-semibold text-gray-500 mb-3">Outstanding Payments</p>
            <p className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {formatCurrency(overview.outstandingPayments)}
            </p>
            <p className="text-sm text-gray-600">Pending collections</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <p className="text-sm font-semibold text-gray-500 mb-3">Avg Transaction Value</p>
            <p className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {formatCurrency(overview.averageTransactionValue)}
            </p>
            <p className="text-sm text-gray-600">{overview.totalTransactions} transactions</p>
          </div>
        </div>

        {/* Daily Target Progress */}
        {dailyTarget && (
          <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:shadow-lg transition-all duration-200 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Daily Collection Target</h3>
                <p className="text-base text-gray-600">Track today's progress</p>
              </div>
              <div className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                dailyTarget.achieved
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-100'
                  : 'bg-orange-50 text-orange-700 ring-1 ring-orange-100'
              }`}>
                {dailyTarget.achieved ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Target Achieved</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5" />
                    <span>In Progress</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Today's Collection</p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  ₹{dailyTarget.todayCollection.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Target</p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  ₹{dailyTarget.dailyTarget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Difference</p>
                <p className={`text-4xl font-bold tracking-tight ${
                  dailyTarget.difference >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dailyTarget.difference >= 0 ? '+' : ''}₹{Math.abs(dailyTarget.difference).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-500">Progress</span>
                <span className="text-lg font-bold text-gray-900">
                  {dailyTarget.progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-zennara-green to-emerald-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(dailyTarget.progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200 mb-12">
          <MonthlyRevenueChart data={monthlyRevenue} />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <RevenueByCategoryChart data={financialData.revenueByCategory} />
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <RevenueByLocationChart data={financialData.revenueByLocation} />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200 mb-12">
          <PaymentMethodChart data={financialData.paymentMethodDistribution} />
        </div>

        {/* Daily Breakdown Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="px-8 py-7 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Daily Revenue Breakdown</h3>
            <p className="text-base text-gray-600 mt-1">Last 30 days performance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Consultations</th>
                  <th className="text-right px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="text-right px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {financialData.dailyRevenue.slice().reverse().map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-8 py-4 text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-900 text-right">
                      ₹{day.revenue.toLocaleString()}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600 text-right">{day.consultations}</td>
                    <td className="px-8 py-4 text-sm text-gray-600 text-right">{day.orders}</td>
                    <td className="px-8 py-4 text-sm text-gray-600 text-right">{day.packages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
