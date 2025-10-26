import { useState } from 'react';
import { LocationIcon } from '../Icons';

export default function RevenueByLocationChart({ data = {} }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        <p>No location data available</p>
      </div>
    );
  }

  const locations = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const maxRevenue = Math.max(...locations.map(l => l.value));
  const totalRevenue = locations.reduce((sum, l) => sum + l.value, 0);

  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-orange-500 to-orange-600',
    'from-cyan-500 to-cyan-600'
  ];

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Revenue by Location</h3>
        <p className="text-sm text-gray-500 mt-1">Branch-wise performance comparison</p>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {locations.map((location, index) => {
          const percentage = (location.value / maxRevenue) * 100;
          const contribution = (location.value / totalRevenue) * 100;

          return (
            <div
              key={index}
              className="group"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LocationIcon className={`w-4 h-4 ${
                    hoveredBar === index ? 'text-zennara-green' : 'text-gray-400'
                  } transition-colors`} />
                  <span className={`font-bold text-sm ${
                    hoveredBar === index ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {location.name}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    hoveredBar === index
                      ? 'bg-zennara-green text-white'
                      : 'bg-gray-100 text-gray-500'
                  } transition-all`}>
                    {contribution.toFixed(1)}%
                  </span>
                </div>
                <div className={`font-extrabold text-lg ${
                  hoveredBar === index ? 'text-zennara-green' : 'text-gray-900'
                } transition-colors`}>
                  ₹{location.value.toLocaleString()}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-16 bg-gray-100 rounded-2xl overflow-hidden">
                {/* Animated Bar */}
                <div
                  className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-500 ease-out flex items-center justify-end pr-4 ${
                    hoveredBar === index ? 'shadow-xl' : ''
                  }`}
                  style={{
                    width: `${percentage}%`,
                    transform: hoveredBar === index ? 'scaleY(1.1)' : 'scaleY(1)'
                  }}
                >
                  {percentage > 30 && (
                    <span className="text-white font-bold text-sm">
                      {formatCurrency(location.value)}
                    </span>
                  )}
                </div>

                {/* Hover tooltip */}
                {hoveredBar === index && (
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white px-3 py-2 rounded-lg shadow-xl">
                    <div className="text-xs font-semibold text-gray-600">
                      {percentage.toFixed(1)}% of top location
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Locations</div>
          <div className="text-2xl font-extrabold text-gray-900">{locations.length}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Top Location</div>
          <div className="text-2xl font-extrabold text-zennara-green">{formatCurrency(maxRevenue)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Combined</div>
          <div className="text-2xl font-extrabold text-gray-900">{formatCurrency(totalRevenue)}</div>
        </div>
      </div>
    </div>
  );
}
