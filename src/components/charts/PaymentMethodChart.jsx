import { useState } from 'react';
import { CurrencyIcon, CreditCardIcon, PhoneIcon, BuildingIcon, ShoppingBagIcon } from '../Icons';

export default function PaymentMethodChart({ data = {} }) {
  const [hoveredMethod, setHoveredMethod] = useState(null);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        <p>No payment method data available</p>
      </div>
    );
  }

  const methods = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter(m => m.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = methods.reduce((sum, method) => sum + method.value, 0);

  const colors = {
    'Cash': { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600', icon: CurrencyIcon },
    'Card': { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', icon: CreditCardIcon },
    'UPI': { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', icon: PhoneIcon },
    'Bank Transfer': { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600', icon: BuildingIcon },
    'COD': { bg: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600', icon: ShoppingBagIcon },
    'Other': { bg: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600', icon: CurrencyIcon }
  };

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
        <h3 className="text-xl font-bold text-gray-900">Payment Method Distribution</h3>
        <p className="text-sm text-gray-500 mt-1">How customers prefer to pay</p>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method, index) => {
          const percentage = (method.value / total) * 100;
          const colorScheme = colors[method.name] || colors['Other'];

          return (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredMethod(index)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <div className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
                hoveredMethod === index
                  ? 'shadow-2xl scale-105'
                  : 'shadow-sm hover:shadow-lg'
              }`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-10`}></div>
                
                {/* Content */}
                <div className="relative p-6 bg-white bg-opacity-90 backdrop-blur-sm">
                  {/* Icon and Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-lg`}>
                        <colorScheme.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{method.name}</div>
                        <div className="text-xs font-semibold text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-3">
                    <div className={`text-3xl font-extrabold bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent`}>
                      ₹{method.value.toLocaleString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colorScheme.gradient} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  {/* Hover Effect Overlay */}
                  {hoveredMethod === index && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20 pointer-events-none"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zennara-green to-emerald-600 flex items-center justify-center shadow-lg">
              <CurrencyIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Collections</div>
              <div className="text-3xl font-extrabold text-gray-900">
                ₹{total.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-gray-500 mb-1">Payment Methods</div>
            <div className="text-2xl font-extrabold text-zennara-green">
              {methods.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
