import { useState } from 'react';

export default function RevenueByCategoryChart({ data = {} }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        <p>No category data available</p>
      </div>
    );
  }

  const categories = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = categories.reduce((sum, cat) => sum + cat.value, 0);

  const colors = [
    { gradient: 'from-blue-500 to-blue-600', solid: 'bg-blue-500', text: 'text-blue-600' },
    { gradient: 'from-emerald-500 to-emerald-600', solid: 'bg-emerald-500', text: 'text-emerald-600' },
    { gradient: 'from-purple-500 to-purple-600', solid: 'bg-purple-500', text: 'text-purple-600' },
    { gradient: 'from-pink-500 to-pink-600', solid: 'bg-pink-500', text: 'text-pink-600' },
    { gradient: 'from-orange-500 to-orange-600', solid: 'bg-orange-500', text: 'text-orange-600' },
    { gradient: 'from-cyan-500 to-cyan-600', solid: 'bg-cyan-500', text: 'text-cyan-600' },
    { gradient: 'from-indigo-500 to-indigo-600', solid: 'bg-indigo-500', text: 'text-indigo-600' },
    { gradient: 'from-red-500 to-red-600', solid: 'bg-red-500', text: 'text-red-600' }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  // Calculate donut segments
  let cumulativePercentage = 0;
  const segments = categories.map((category, index) => {
    const percentage = (category.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    cumulativePercentage += percentage;

    return {
      ...category,
      percentage,
      startAngle,
      endAngle,
      color: colors[index % colors.length]
    };
  });

  // Create donut segments using conic gradient
  const conicGradient = segments.map((seg, idx) => {
    const color1 = seg.color.gradient.split(' ')[0].replace('from-', '');
    const color2 = seg.color.gradient.split(' ')[1].replace('to-', '');
    const startDeg = (seg.startAngle);
    const endDeg = (seg.endAngle);
    
    return `${color1} ${startDeg}deg ${endDeg}deg`;
  }).join(', ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Revenue by Service Category</h3>
        <p className="text-sm text-gray-500 mt-1">Distribution across treatment types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Outer circle with conic gradient */}
            <div 
              className="w-full h-full rounded-full relative"
              style={{
                background: `conic-gradient(${conicGradient})`
              }}
            >
              {/* Inner white circle to create donut */}
              <div className="absolute inset-[25%] bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-gray-900">
                    {formatCurrency(total)}
                  </div>
                  <div className="text-sm font-medium text-gray-500 mt-1">
                    Total Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* Hover indicator */}
            {hoveredSegment !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl backdrop-blur-xl bg-opacity-95">
                  {segments[hoveredSegment].name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className={`p-4 rounded-2xl transition-all duration-200 ${
                hoveredSegment === index
                  ? 'bg-gradient-to-r ' + segment.color.gradient + ' shadow-xl scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded-full ${
                      hoveredSegment === index ? 'bg-white' : segment.color.solid
                    } flex-shrink-0 transition-all duration-200`}></div>
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${
                        hoveredSegment === index ? 'text-white' : 'text-gray-900'
                      }`}>
                        {segment.name}
                      </div>
                      <div className={`text-xs font-semibold mt-0.5 ${
                        hoveredSegment === index ? 'text-white text-opacity-90' : segment.color.text
                      }`}>
                        {segment.percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${
                    hoveredSegment === index ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="font-extrabold text-lg">
                      ₹{segment.value.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      hoveredSegment === index ? 'bg-white' : 'bg-gradient-to-r ' + segment.color.gradient
                    } transition-all duration-300`}
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
