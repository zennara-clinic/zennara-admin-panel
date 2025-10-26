import { CurrencyIcon, TrendingUpIcon, ClockIcon, ExclamationIcon, ChartIcon } from './Icons';

export default function FinancialMetricsCards({ data }) {
  if (!data || !data.overview) {
    return null;
  }

  const { overview } = data;

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

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${overview.totalRevenue.toLocaleString()}`,
      change: `${overview.weekOverWeekGrowth >= 0 ? '+' : ''}${overview.weekOverWeekGrowth.toFixed(1)}%`,
      isPositive: overview.weekOverWeekGrowth >= 0,
      icon: CurrencyIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Consultation Revenue',
      value: formatCurrency(overview.consultationRevenue),
      subtitle: `${((overview.consultationRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total`,
      icon: ChartIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Product Revenue',
      value: formatCurrency(overview.productRevenue),
      subtitle: `${((overview.productRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total`,
      icon: CurrencyIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Package Revenue',
      value: formatCurrency(overview.packageRevenue),
      subtitle: `${((overview.packageRevenue / overview.totalRevenue) * 100).toFixed(1)}% of total`,
      icon: CurrencyIcon,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      title: 'Outstanding Payments',
      value: formatCurrency(overview.outstandingPayments),
      subtitle: 'Pending collections',
      icon: ClockIcon,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-amber-50'
    },
    {
      title: 'Refunds & Cancellations',
      value: formatCurrency(overview.refundsLost),
      subtitle: 'Revenue lost',
      icon: ExclamationIcon,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-pink-50'
    },
    {
      title: 'Avg Transaction Value',
      value: formatCurrency(overview.averageTransactionValue),
      subtitle: `${overview.totalTransactions} total transactions`,
      icon: ChartIcon,
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-50 to-blue-50'
    },
    {
      title: 'Week-over-Week Growth',
      value: `${overview.weekOverWeekGrowth >= 0 ? '+' : ''}${overview.weekOverWeekGrowth.toFixed(1)}%`,
      subtitle: overview.weekOverWeekGrowth >= 0 ? 'Trending up' : 'Trending down',
      icon: TrendingUpIcon,
      gradient: overview.weekOverWeekGrowth >= 0 ? 'from-green-500 to-emerald-600' : 'from-gray-500 to-gray-600',
      bgGradient: overview.weekOverWeekGrowth >= 0 ? 'from-green-50 to-emerald-50' : 'from-gray-50 to-slate-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`}></div>
            
            {/* Content */}
            <div className="relative bg-white bg-opacity-80 backdrop-blur-xl p-6 border border-gray-100">
              {/* Icon Badge */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <div className="text-sm font-bold text-gray-500 mb-2">
                {metric.title}
              </div>

              {/* Value */}
              <div className={`text-3xl font-extrabold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-1`}>
                {metric.value}
              </div>

              {/* Subtitle or Change */}
              {metric.change && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  metric.isPositive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span>{metric.change}</span>
                  <span className="text-[10px]">WoW</span>
                </div>
              )}
              {metric.subtitle && (
                <div className="text-xs font-semibold text-gray-500">
                  {metric.subtitle}
                </div>
              )}

              {/* Decorative Gradient Blob */}
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${metric.gradient} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
