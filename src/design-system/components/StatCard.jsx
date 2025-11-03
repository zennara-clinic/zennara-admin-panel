import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard Component
 * 
 * A unified, standardized stat card component that supports multiple variants
 * and color schemes while maintaining consistent styling across the application.
 * 
 * @component
 * @example
 * <StatCard
 *   variant="solid"
 *   colorScheme="emerald"
 *   label="Total Revenue"
 *   value="₹2,45,000"
 *   sublabel="This month"
 *   icon={CurrencyIcon}
 *   trend={{ value: 12.5, label: "+12%" }}
 *   showAnimatedDot={true}
 * />
 */
const StatCard = ({
  variant = 'solid',
  colorScheme = 'emerald',
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  showAnimatedDot = false,
  onClick,
  className = ''
}) => {
  // Color scheme configurations
  const colorSchemes = {
    emerald: {
      solid: {
        bg: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30',
        text: 'text-emerald-900',
        labelText: 'text-emerald-700',
        sublabelText: 'text-emerald-600',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        iconText: 'text-white',
        border: 'border-emerald-100',
        hoverBorder: 'hover:border-emerald-200',
        decorativeBlur: 'bg-gradient-to-br from-emerald-400/10 to-emerald-600/20',
        dotColor: 'bg-emerald-500',
        dotShadow: 'shadow-emerald-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 backdrop-blur-xl',
        text: 'text-emerald-900',
        labelText: 'text-emerald-700',
        sublabelText: 'text-emerald-600',
        border: 'border-emerald-100/50',
        decorativeLine: 'bg-gradient-to-r from-emerald-400 to-teal-300',
        decorativeBlur: 'bg-gradient-to-br from-emerald-400/20 to-transparent',
        dotColor: 'bg-emerald-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-600',
        border: 'border-gray-100',
        valueColor: 'text-emerald-600'
      }
    },
    blue: {
      solid: {
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-blue-50 via-white to-blue-50/30',
        text: 'text-blue-900',
        labelText: 'text-blue-700',
        sublabelText: 'text-blue-600',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        iconText: 'text-white',
        border: 'border-blue-100',
        hoverBorder: 'hover:border-blue-200',
        decorativeBlur: 'bg-gradient-to-br from-blue-400/10 to-blue-600/20',
        dotColor: 'bg-blue-500',
        dotShadow: 'shadow-blue-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl',
        text: 'text-blue-900',
        labelText: 'text-blue-700',
        sublabelText: 'text-blue-600',
        border: 'border-blue-100/50',
        decorativeLine: 'bg-gradient-to-r from-blue-400 to-indigo-300',
        decorativeBlur: 'bg-gradient-to-br from-blue-400/20 to-transparent',
        dotColor: 'bg-blue-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-600',
        border: 'border-gray-100',
        valueColor: 'text-blue-600'
      }
    },
    purple: {
      solid: {
        bg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-purple-50 via-white to-purple-50/30',
        text: 'text-purple-900',
        labelText: 'text-purple-700',
        sublabelText: 'text-purple-600',
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        iconText: 'text-white',
        border: 'border-purple-100',
        hoverBorder: 'hover:border-purple-200',
        decorativeBlur: 'bg-gradient-to-br from-purple-400/10 to-purple-600/20',
        dotColor: 'bg-purple-500',
        dotShadow: 'shadow-purple-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50/50 backdrop-blur-xl',
        text: 'text-purple-900',
        labelText: 'text-purple-700',
        sublabelText: 'text-purple-600',
        border: 'border-purple-100/50',
        decorativeLine: 'bg-gradient-to-r from-purple-400 to-violet-300',
        decorativeBlur: 'bg-gradient-to-br from-purple-400/20 to-transparent',
        dotColor: 'bg-purple-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-purple-50',
        iconText: 'text-purple-600',
        border: 'border-gray-100',
        valueColor: 'text-purple-600'
      }
    },
    amber: {
      solid: {
        bg: 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30',
        text: 'text-amber-900',
        labelText: 'text-amber-700',
        sublabelText: 'text-amber-600',
        iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
        iconText: 'text-white',
        border: 'border-amber-100',
        hoverBorder: 'hover:border-amber-200',
        decorativeBlur: 'bg-gradient-to-br from-amber-400/10 to-amber-600/20',
        dotColor: 'bg-amber-500',
        dotShadow: 'shadow-amber-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50 backdrop-blur-xl',
        text: 'text-amber-900',
        labelText: 'text-amber-700',
        sublabelText: 'text-amber-600',
        border: 'border-amber-100/50',
        decorativeLine: 'bg-gradient-to-r from-amber-400 to-orange-300',
        decorativeBlur: 'bg-gradient-to-br from-amber-400/20 to-transparent',
        dotColor: 'bg-amber-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-amber-50',
        iconText: 'text-amber-600',
        border: 'border-gray-100',
        valueColor: 'text-amber-600'
      }
    },
    red: {
      solid: {
        bg: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-red-50 via-white to-red-50/30',
        text: 'text-red-900',
        labelText: 'text-red-700',
        sublabelText: 'text-red-600',
        iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
        iconText: 'text-white',
        border: 'border-red-100',
        hoverBorder: 'hover:border-red-200',
        decorativeBlur: 'bg-gradient-to-br from-red-400/10 to-red-600/20',
        dotColor: 'bg-red-500',
        dotShadow: 'shadow-red-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50/50 backdrop-blur-xl',
        text: 'text-red-900',
        labelText: 'text-red-700',
        sublabelText: 'text-red-600',
        border: 'border-red-100/50',
        decorativeLine: 'bg-gradient-to-r from-red-400 to-rose-300',
        decorativeBlur: 'bg-gradient-to-br from-red-400/20 to-transparent',
        dotColor: 'bg-red-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-red-50',
        iconText: 'text-red-600',
        border: 'border-gray-100',
        valueColor: 'text-red-600'
      }
    },
    gray: {
      solid: {
        bg: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-white via-gray-50/50 to-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        iconText: 'text-white',
        border: 'border-gray-100',
        hoverBorder: 'hover:border-gray-200',
        decorativeBlur: 'bg-gradient-to-br from-gray-400/5 to-gray-600/10',
        dotColor: 'bg-gray-500'
      },
      glass: {
        bg: 'bg-white/80 backdrop-blur-xl',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        border: 'border-gray-100/50',
        decorativeLine: 'bg-gradient-to-r from-gray-400 to-gray-200',
        decorativeBlur: 'bg-gradient-to-br from-gray-400/10 to-transparent',
        dotColor: 'bg-gray-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-gray-50',
        iconText: 'text-gray-600',
        border: 'border-gray-100',
        valueColor: 'text-gray-900'
      }
    },
    cyan: {
      solid: {
        bg: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-cyan-50 via-white to-cyan-50/30',
        text: 'text-cyan-900',
        labelText: 'text-cyan-700',
        sublabelText: 'text-cyan-600',
        iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
        iconText: 'text-white',
        border: 'border-cyan-100',
        hoverBorder: 'hover:border-cyan-200',
        decorativeBlur: 'bg-gradient-to-br from-cyan-400/10 to-cyan-600/20',
        dotColor: 'bg-cyan-500',
        dotShadow: 'shadow-cyan-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-cyan-50 to-teal-50/50 backdrop-blur-xl',
        text: 'text-cyan-900',
        labelText: 'text-cyan-700',
        sublabelText: 'text-cyan-600',
        border: 'border-cyan-100/50',
        decorativeLine: 'bg-gradient-to-r from-cyan-400 to-teal-300',
        decorativeBlur: 'bg-gradient-to-br from-cyan-400/20 to-transparent',
        dotColor: 'bg-cyan-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-cyan-50',
        iconText: 'text-cyan-600',
        border: 'border-gray-100',
        valueColor: 'text-cyan-600'
      }
    },
    rose: {
      solid: {
        bg: 'bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-rose-50 via-white to-rose-50/30',
        text: 'text-rose-900',
        labelText: 'text-rose-700',
        sublabelText: 'text-rose-600',
        iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
        iconText: 'text-white',
        border: 'border-rose-100',
        hoverBorder: 'hover:border-rose-200',
        decorativeBlur: 'bg-gradient-to-br from-rose-400/10 to-rose-600/20',
        dotColor: 'bg-rose-500',
        dotShadow: 'shadow-rose-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-rose-50 to-pink-50/50 backdrop-blur-xl',
        text: 'text-rose-900',
        labelText: 'text-rose-700',
        sublabelText: 'text-rose-600',
        border: 'border-rose-100/50',
        decorativeLine: 'bg-gradient-to-r from-rose-400 to-pink-300',
        decorativeBlur: 'bg-gradient-to-br from-rose-400/20 to-transparent',
        dotColor: 'bg-rose-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-rose-50',
        iconText: 'text-rose-600',
        border: 'border-gray-100',
        valueColor: 'text-rose-600'
      }
    },
    green: {
      solid: {
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700',
        text: 'text-white',
        labelText: 'text-white/80',
        sublabelText: 'text-white/70',
        iconBg: 'bg-white/20',
        trendBg: 'bg-white/20',
        trendBorder: 'border-white/30',
        decorativeBlur: 'bg-white/10',
        dotColor: 'bg-white/60'
      },
      subtle: {
        bg: 'bg-gradient-to-br from-green-50 via-white to-green-50/30',
        text: 'text-green-900',
        labelText: 'text-green-700',
        sublabelText: 'text-green-600',
        iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
        iconText: 'text-white',
        border: 'border-green-100',
        hoverBorder: 'hover:border-green-200',
        decorativeBlur: 'bg-gradient-to-br from-green-400/10 to-green-600/20',
        dotColor: 'bg-green-500',
        dotShadow: 'shadow-green-500/50'
      },
      glass: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50/50 backdrop-blur-xl',
        text: 'text-green-900',
        labelText: 'text-green-700',
        sublabelText: 'text-green-600',
        border: 'border-green-100/50',
        decorativeLine: 'bg-gradient-to-r from-green-400 to-emerald-300',
        decorativeBlur: 'bg-gradient-to-br from-green-400/20 to-transparent',
        dotColor: 'bg-green-500'
      },
      simple: {
        bg: 'bg-white',
        text: 'text-gray-900',
        labelText: 'text-gray-600',
        sublabelText: 'text-gray-500',
        iconBg: 'bg-green-50',
        iconText: 'text-green-600',
        border: 'border-gray-100',
        valueColor: 'text-green-600'
      }
    }
  };

  const colors = colorSchemes[colorScheme]?.[variant] || colorSchemes.emerald[variant];

  // Base classes
  const baseClasses = 'group relative rounded-3xl p-6 transition-all duration-300 overflow-hidden';
  
  // Variant-specific classes
  const variantClasses = {
    solid: `${colors.bg} shadow-lg hover:shadow-xl hover:scale-105`,
    subtle: `${colors.bg} shadow-lg border ${colors.border} ${colors.hoverBorder || ''} hover:shadow-xl hover:scale-105`,
    glass: `${colors.bg} shadow-sm border ${colors.border} hover:shadow-xl hover:scale-105`,
    simple: `${colors.bg} shadow-sm border ${colors.border} hover:shadow-lg`
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Decorative Elements */}
      {variant !== 'simple' && (
        <>
          {/* Gradient Overlay (solid variant) */}
          {variant === 'solid' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          )}
          
          {/* Blur Circle */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${colors.decorativeBlur} rounded-full blur-2xl ${variant === 'solid' ? 'group-hover:blur-3xl' : ''} transition-all duration-500 -mr-10 -mt-10`}></div>
        </>
      )}

      {/* Content Container */}
      <div className="relative">
        {/* Top Row: Icon and Trend */}
        <div className="flex items-center justify-between mb-4">
          {/* Icon Container */}
          <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} ${variant === 'subtle' || variant === 'simple' ? 'shadow-lg' : 'backdrop-blur-sm'} flex items-center justify-center ${variant === 'simple' ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:rotate-12'} transition-all duration-${variant === 'solid' ? '500' : '300'}`}>
            {Icon && <Icon className={`w-7 h-7 ${colors.iconText || colors.text}`} />}
          </div>

          {/* Trend Badge */}
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${colors.trendBg || 'bg-white/10'} ${variant === 'solid' ? 'backdrop-blur-sm' : ''} ${colors.text} text-xs font-semibold ${colors.trendBorder ? `border ${colors.trendBorder}` : ''}`}>
              {trend.value > 0 ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span>{trend.label || `${trend.value > 0 ? '+' : ''}${trend.value}%`}</span>
            </div>
          )}
        </div>

        {/* Label */}
        <p className={`text-xs font-semibold ${colors.labelText} uppercase tracking-wider mb-2`}>
          {label}
        </p>

        {/* Value */}
        <p className={`text-3xl font-bold ${colors.valueColor || colors.text} mb-2`}>
          {value}
        </p>

        {/* Sublabel with optional animated dot */}
        {sublabel && (
          <div className="flex items-center gap-2">
            {showAnimatedDot && (
              <div className={`w-2 h-2 ${colors.dotColor} rounded-full animate-pulse ${colors.dotShadow ? `shadow-lg ${colors.dotShadow}` : ''}`}></div>
            )}
            <p className={`text-xs ${colors.sublabelText} font-medium`}>
              {sublabel}
            </p>
          </div>
        )}

        {/* Decorative Line (glass variant) */}
        {variant === 'glass' && colors.decorativeLine && (
          <div className={`mt-3 h-1 w-12 ${colors.decorativeLine} rounded-full`}></div>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  /** Visual variant of the card */
  variant: PropTypes.oneOf(['solid', 'subtle', 'glass', 'simple']),
  /** Color scheme for the card */
  colorScheme: PropTypes.oneOf(['emerald', 'blue', 'purple', 'amber', 'red', 'gray', 'cyan', 'rose', 'green']),
  /** Label text displayed above the value */
  label: PropTypes.string.isRequired,
  /** Main value to display (can be string or number) */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Optional sublabel text displayed below the value */
  sublabel: PropTypes.string,
  /** Icon component to display */
  icon: PropTypes.elementType,
  /** Trend information */
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string
  }),
  /** Whether to show an animated dot indicator */
  showAnimatedDot: PropTypes.bool,
  /** Click handler for the card */
  onClick: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string
};

export default StatCard;
