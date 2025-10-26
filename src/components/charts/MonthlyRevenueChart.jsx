import { useState } from 'react';
import { TrendingUpIcon } from '../Icons';

export default function MonthlyRevenueChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [viewMode, setViewMode] = useState('total'); // 'total', 'split'

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        <p>No revenue data available</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.totalRevenue));
  const maxConsultation = Math.max(...data.map(d => d.consultationRevenue));
  const maxProduct = Math.max(...data.map(d => d.productRevenue));
  const maxPackage = Math.max(...data.map(d => d.packageRevenue));
  const overallMax = Math.max(maxRevenue, maxConsultation, maxProduct, maxPackage);

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
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Monthly Revenue Trend</h3>
          <p className="text-sm text-gray-500 mt-1">Last 12 months performance</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('total')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'total'
                ? 'bg-white text-zennara-green shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Total
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-zennara-green shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Legend for Split View */}
      {viewMode === 'split' && (
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <span className="text-sm font-medium text-gray-700">Consultations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <span className="text-sm font-medium text-gray-700">Products</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <span className="text-sm font-medium text-gray-700">Packages</span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="relative h-96 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between py-8 text-xs font-semibold text-gray-500">
          <span>{formatCurrency(overallMax)}</span>
          <span>{formatCurrency(overallMax * 0.75)}</span>
          <span>{formatCurrency(overallMax * 0.5)}</span>
          <span>{formatCurrency(overallMax * 0.25)}</span>
          <span>₹0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-16 h-full relative">
          <div className="h-[calc(100%-40px)] flex items-end justify-between gap-3">
            {data.map((item, index) => {
              const height = viewMode === 'total'
                ? (item.totalRevenue / overallMax) * 100
                : 0;

              const consultationHeight = (item.consultationRevenue / overallMax) * 100;
              const productHeight = (item.productRevenue / overallMax) * 100;
              const packageHeight = (item.packageRevenue / overallMax) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center relative group h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl z-20 whitespace-nowrap">
                      <div className="text-sm font-bold mb-2">{item.month}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-300">Total:</span>
                          <span className="font-bold text-emerald-400">₹{item.totalRevenue.toLocaleString()}</span>
                        </div>
                        {viewMode === 'split' && (
                          <>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-blue-300">Consultations:</span>
                              <span className="font-semibold">₹{item.consultationRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-emerald-300">Products:</span>
                              <span className="font-semibold">₹{item.productRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-purple-300">Packages:</span>
                              <span className="font-semibold">₹{item.packageRevenue.toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                  )}

                  {/* Bar Container */}
                  <div className="w-full h-full flex items-end justify-center">
                    {viewMode === 'total' ? (
                      <div
                        className="w-full max-w-[32px] bg-gradient-to-t from-zennara-green to-emerald-400 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                        style={{ 
                          height: height > 0 ? `${height}%` : '0%',
                          minHeight: height > 0 ? '3px' : '0px'
                        }}
                      ></div>
                    ) : (
                      <div className="w-full max-w-[32px] h-full flex flex-col justify-end">
                        {/* Consultations (bottom) */}
                        <div
                          className="w-full bg-blue-500 transition-all duration-300"
                          style={{ 
                            height: consultationHeight > 0 ? `${consultationHeight}%` : '0%',
                            minHeight: consultationHeight > 0 ? '3px' : '0px'
                          }}
                        ></div>
                        {/* Products (middle) */}
                        <div
                          className="w-full bg-emerald-500 transition-all duration-300"
                          style={{ 
                            height: productHeight > 0 ? `${productHeight}%` : '0%',
                            minHeight: productHeight > 0 ? '3px' : '0px'
                          }}
                        ></div>
                        {/* Packages (top) */}
                        <div
                          className="w-full bg-purple-500 transition-all duration-300"
                          style={{ 
                            height: packageHeight > 0 ? `${packageHeight}%` : '0%',
                            minHeight: packageHeight > 0 ? '3px' : '0px'
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Month Labels */}
          <div className="h-10 flex items-center justify-between gap-3 mt-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-xs font-medium text-gray-600 truncate">
                  {item.month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
