import { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  BarChart3,
  AlertTriangle,
  Clock,
  Tag,
  PlusCircle,
  CheckCircle
} from 'lucide-react';
import { getServiceAnalytics } from '../../services/analyticsService';

export default function ServiceAnalytics() {
  const [data, setData] = useState(null);
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

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await getServiceAnalytics({
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      });

      setData(response.data);
    } catch (err) {
      console.error('Error fetching service analytics:', err);
      setError('Failed to load service analytics');
    } finally {
      setLoading(false);
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
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  if (!data) return null;

  const { 
    topServicesByRevenue, 
    topServicesByVolume, 
    serviceProfitMargin, 
    leastPerformingServices, 
    durationComparison, 
    categoryPerformance, 
    newServicesThisMonth, 
    packageUtilization, 
    summary 
  } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">🏥 Service & Treatment Performance</h1>
              <p className="text-base text-gray-600">Comprehensive service analytics and insights</p>
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-zennara-green/20 focus:border-zennara-green transition-all shadow-sm"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Summary Cards - 4 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ring-1 ring-green-100">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              ₹{summary.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">{summary.totalBookings} bookings</p>
          </div>

          {/* Active Services */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-1 ring-blue-100">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Active Services</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {summary.activeServices}
            </p>
            <p className="text-sm text-gray-600">of {summary.totalServices} total</p>
          </div>

          {/* Avg Revenue per Service */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center ring-1 ring-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Avg Revenue/Service</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              ₹{Math.round(summary.avgRevenuePerService).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">per active service</p>
          </div>

          {/* New Services This Month */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center ring-1 ring-orange-100">
                <PlusCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">New Services Added</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {newServicesThisMonth.count}
            </p>
            <p className="text-sm text-gray-600">this month</p>
          </div>
        </div>

        {/* Top Services - Revenue & Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Top 10 by Revenue */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Top 10 Services by Revenue</h3>
                <p className="text-sm text-gray-600">Highest earning treatments</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topServicesByRevenue.map((service, index) => {
                const maxRevenue = topServicesByRevenue[0]?.revenue || 1;
                const percentage = (service.revenue / maxRevenue) * 100;

                return (
                  <div key={service.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-600">{service.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{service.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{service.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 10 by Volume */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Top 10 Services by Volume</h3>
                <p className="text-sm text-gray-600">Most booked treatments</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topServicesByVolume.map((service, index) => {
                const maxBookings = topServicesByVolume[0]?.bookings || 1;
                const percentage = (service.bookings / maxBookings) * 100;

                return (
                  <div key={service.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-600">{service.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{service.bookings}</p>
                        <p className="text-xs text-gray-600">₹{service.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service Category Performance */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 mb-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Service Category Performance</h3>
            <p className="text-sm text-gray-600">Revenue breakdown by category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryPerformance.map((category, index) => {
              const colors = [
                { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100', icon: '💆' },
                { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100', icon: '💇' },
                { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100', icon: '🧖' },
                { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100', icon: '✨' }
              ];
              const color = colors[index % colors.length];

              return (
                <div key={category.category} className={`${color.bg} rounded-xl p-6 ring-1 ${color.ring}`}>
                  <div className="text-3xl mb-3">{color.icon}</div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">{category.category}</p>
                  <p className={`text-3xl font-bold ${color.text} mb-2`}>₹{Math.round(category.revenue).toLocaleString()}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{category.bookings} bookings</span>
                    <span>₹{Math.round(category.avgPrice)}/avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profit Margins & Duration Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Service-wise Profit Margin */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Service-wise Profit Margin</h3>
              <p className="text-sm text-gray-600">Top services with profit breakdown</p>
            </div>

            <div className="space-y-4">
              {serviceProfitMargin.slice(0, 5).map((service, index) => (
                <div key={service.id} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900 mb-3">{service.name}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-semibold text-gray-900">₹{service.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cost (40%)</span>
                      <span className="font-semibold text-red-600">₹{Math.round(service.cost).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">Profit (60%)</span>
                      <span className="font-bold text-green-600">₹{Math.round(service.profit).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Duration vs Scheduled */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Duration: Scheduled vs Actual</h3>
                <p className="text-sm text-gray-600">Time efficiency analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              {durationComparison.slice(0, 6).map((service, index) => {
                const variance = service.actual - service.scheduled;
                const varianceColor = variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600';
                const varianceIcon = variance > 0 ? '↑' : variance < 0 ? '↓' : '→';

                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-3">{service.name}</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Scheduled</p>
                        <p className="text-lg font-bold text-gray-900">{service.scheduled}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Actual</p>
                        <p className="text-lg font-bold text-indigo-600">{service.actual}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Variance</p>
                        <p className={`text-lg font-bold ${varianceColor}`}>
                          {varianceIcon}{Math.abs(variance)}m
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Least Performing & Package Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Least Performing Services */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Least Performing Services</h3>
                <p className="text-sm text-gray-600">Underutilized treatments</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {leastPerformingServices.map((service, index) => (
                <div key={service.id} className="p-4 bg-red-50 rounded-xl ring-1 ring-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-600">{service.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{service.bookings} bookings</p>
                      <p className="text-xs text-gray-600">₹{service.price}</p>
                    </div>
                  </div>
                  {service.bookings === 0 && (
                    <p className="text-xs text-red-600 font-medium">⚠️ No bookings yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Package Utilization Rate */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                <Tag className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Package Utilization Rate</h3>
                <p className="text-sm text-gray-600">Sessions used vs total</p>
              </div>
            </div>

            <div className="space-y-4">
              {packageUtilization.map((pkg, index) => {
                const utilizationColor = pkg.utilizationRate >= 80 ? 'text-green-600' : pkg.utilizationRate >= 50 ? 'text-orange-600' : 'text-red-600';
                const barColor = pkg.utilizationRate >= 80 ? 'bg-green-500' : pkg.utilizationRate >= 50 ? 'bg-orange-500' : 'bg-red-500';

                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">{pkg.packageName}</p>
                      <p className={`text-lg font-bold ${utilizationColor}`}>{pkg.utilizationRate}%</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${pkg.utilizationRate}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{pkg.usedSessions} used</span>
                        <span>{pkg.remainingSessions} remaining</span>
                        <span>{pkg.totalSessions} total</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* New Services This Month */}
        {newServicesThisMonth.count > 0 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">New Services Added This Month</h3>
                <p className="text-sm text-gray-600">{newServicesThisMonth.count} new treatments launched</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newServicesThisMonth.services.map((service) => (
                <div key={service._id} className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl ring-1 ring-orange-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xl">
                      ✨
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-700 text-xs font-semibold rounded-full">NEW</span>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{service.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                  <p className="text-lg font-bold text-orange-600">₹{service.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
