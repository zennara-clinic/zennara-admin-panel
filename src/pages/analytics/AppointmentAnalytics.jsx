import { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getAppointmentAnalytics } from '../../services/analyticsService';

export default function AppointmentAnalytics() {
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

      const response = await getAppointmentAnalytics({
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      });

      setData(response.data);
    } catch (err) {
      console.error('Error fetching appointment analytics:', err);
      setError('Failed to load appointment analytics');
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
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  const { overview, averages, peakHours, peakDays, cancellationTrend, noShowByService, avgTimeBetweenBookings, upcomingThisWeek, pendingConfirmations } = data;

  // Find peak hour
  const peakHour = peakHours.reduce((max, current) => current.count > max.count ? current : max, peakHours[0]);

  // Find busiest day
  const busiestDay = peakDays.reduce((max, current) => current.count > max.count ? current : max, peakDays[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">📅 Appointment & Booking Insights</h1>
              <p className="text-base text-gray-600">Comprehensive appointment analytics and trends</p>
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

        {/* Key Metrics - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Conversion Rate */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ring-1 ring-green-100">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Conversion Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {overview.conversionRate}%
            </p>
            <p className="text-sm text-gray-600">{overview.completedBookings} completed</p>
          </div>

          {/* Cancellation Rate */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-100">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Cancellation Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {overview.cancellationRate}%
            </p>
            <p className="text-sm text-gray-600">{overview.cancelledBookings} cancelled</p>
          </div>

          {/* No-Show Rate */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center ring-1 ring-orange-100">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">No-Show Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {overview.noShowRate}%
            </p>
            <p className="text-sm text-gray-600">{overview.noShowBookings} no-shows</p>
          </div>

          {/* Pending Confirmations */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-1 ring-blue-100">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Pending Confirmations</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {pendingConfirmations}
            </p>
            <p className="text-sm text-gray-600">{upcomingThisWeek} this week</p>
          </div>
        </div>

        {/* Average Appointments + Peak Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Average Appointments */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Average Appointments</h3>
              <p className="text-sm text-gray-600">Booking frequency breakdown</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-blue-50 rounded-xl ring-1 ring-blue-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Per Day</p>
                  <p className="text-3xl font-bold text-blue-600">{averages.perDay}</p>
                </div>
                <CalendarDaysIcon className="w-10 h-10 text-blue-500" />
              </div>

              <div className="flex items-center justify-between p-5 bg-purple-50 rounded-xl ring-1 ring-purple-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Per Week</p>
                  <p className="text-3xl font-bold text-purple-600">{averages.perWeek}</p>
                </div>
                <CalendarDaysIcon className="w-10 h-10 text-purple-500" />
              </div>

              <div className="flex items-center justify-between p-5 bg-green-50 rounded-xl ring-1 ring-green-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Per Month</p>
                  <p className="text-3xl font-bold text-green-600">{averages.perMonth}</p>
                </div>
                <CalendarDaysIcon className="w-10 h-10 text-green-500" />
              </div>
            </div>
          </div>

          {/* Peak Times */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Peak Booking Times</h3>
              <p className="text-sm text-gray-600">Busiest hours and days</p>
            </div>

            <div className="space-y-6">
              {/* Peak Hour */}
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl ring-1 ring-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <ClockIcon className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Peak Booking Hour</p>
                    <p className="text-2xl font-bold text-orange-600">{peakHour.hour}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{peakHour.count} bookings at this time</p>
              </div>

              {/* Busiest Day */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl ring-1 ring-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDaysIcon className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Busiest Day</p>
                    <p className="text-2xl font-bold text-indigo-600">{busiestDay.day}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{busiestDay.count} bookings on this day</p>
              </div>

              {/* Avg Time Between Bookings */}
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl ring-1 ring-emerald-100">
                <div className="flex items-center gap-3 mb-3">
                  <UserGroupIcon className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Avg Time Between Visits</p>
                    <p className="text-2xl font-bold text-emerald-600">{avgTimeBetweenBookings} days</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Patient rebooking frequency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Booking Hours Heatmap */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 mb-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Peak Booking Hours Heatmap</h3>
            <p className="text-sm text-gray-600">Hourly booking distribution (24-hour format)</p>
          </div>

          <div className="grid grid-cols-12 gap-2">
            {peakHours.map((hourData, index) => {
              const maxBookings = Math.max(...peakHours.map(h => h.count));
              const intensity = maxBookings > 0 ? (hourData.count / maxBookings) : 0;
              const bgColor = intensity > 0.7 ? 'bg-green-600' : intensity > 0.4 ? 'bg-green-400' : intensity > 0.2 ? 'bg-green-200' : 'bg-gray-100';

              return (
                <div
                  key={index}
                  className={`aspect-square ${bgColor} rounded-lg flex flex-col items-center justify-center hover:scale-110 transition-transform cursor-pointer group relative`}
                  title={`${hourData.hour}: ${hourData.count} bookings`}
                >
                  <span className="text-[10px] font-semibold text-gray-700">{hourData.hour.split(':')[0]}</span>
                  <span className="text-xs font-bold text-gray-900 mt-1">{hourData.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Booking Days + Cancellation Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Peak Days */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Peak Booking Days</h3>
              <p className="text-sm text-gray-600">Bookings by day of week</p>
            </div>

            <div className="space-y-3">
              {peakDays.map((dayData, index) => {
                const maxDay = Math.max(...peakDays.map(d => d.count));
                const percentage = maxDay > 0 ? (dayData.count / maxDay) * 100 : 0;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{dayData.day}</span>
                      <span className="text-sm font-bold text-gray-900">{dayData.count}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancellation Trend */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Cancellation Rate Trend</h3>
              <p className="text-sm text-gray-600">Last 7 days cancellation rates</p>
            </div>

            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs font-semibold text-gray-500">
                {[100, 75, 50, 25, 0].map((val, idx) => (
                  <span key={idx}>{val}%</span>
                ))}
              </div>

              {/* Chart area */}
              <div className="ml-12 h-full relative">
                <div className="h-full flex items-end justify-between gap-2">
                  {cancellationTrend.map((item, index) => {
                    const height = item.rate;
                    const color = height > 50 ? 'bg-red-500' : height > 25 ? 'bg-orange-500' : 'bg-green-500';

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="w-full h-full flex items-end justify-center">
                          <div
                            className={`w-full max-w-[32px] ${color} transition-all duration-300 group-hover:scale-105 relative`}
                            style={{ height: `${height}%`, minHeight: height > 0 ? '3px' : '0px' }}
                            title={`${item.date}: ${item.rate}% (${item.cancelled}/${item.total})`}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {item.rate}%
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] font-medium text-gray-600 mt-2">{item.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* No-Show Rate by Service Type */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">No-Show Rate by Service Type</h3>
            <p className="text-sm text-gray-600">Patient no-show patterns across services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noShowByService.map((service, index) => {
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
                { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
                { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
                { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-100' },
                { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
                { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' }
              ];
              const color = colors[index % colors.length];

              return (
                <div key={index} className={`${color.bg} rounded-xl p-6 ring-1 ${color.ring}`}>
                  <p className="text-sm font-semibold text-gray-700 mb-3">{service.service}</p>
                  <p className={`text-3xl font-bold ${color.text} mb-2`}>{service.noShowRate}%</p>
                  <p className="text-sm text-gray-600">{service.noShowCount} no-shows / {service.totalBookings} bookings</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
