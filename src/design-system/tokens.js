/**
 * Zennara Admin Panel - Design System Tokens
 * 
 * This file contains all design tokens used throughout the application.
 * These tokens are based on an audit of the existing codebase and represent
 * the standardized design system.
 */

export const designTokens = {
  // ============================================================================
  // COLORS
  // ============================================================================
  colors: {
    // Brand Colors
    brand: {
      primary: '#156450',      // zennara-green
      secondary: '#10b981',    // emerald-500
      background: '#FFF9F6',   // zennara-white
    },

    // Semantic Colors
    semantic: {
      success: '#10b981',      // emerald-500
      error: '#EF4444',        // red-500
      warning: '#F59E0B',      // amber-500
      info: '#3B82F6',         // blue-500
    },

    // Status Colors (for badges and indicators)
    status: {
      pending: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      },
      confirmed: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      },
      processing: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      },
      completed: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      },
      cancelled: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      },
    },
  },

  // ============================================================================
  // GRADIENTS
  // ============================================================================
  // Standardized gradient system based on comprehensive codebase audit
  // All gradients use Tailwind CSS classes for consistency
  gradients: {
    // -------------------------------------------------------------------------
    // BACKGROUND GRADIENTS
    // -------------------------------------------------------------------------
    // Used for full-page backgrounds to create depth and visual interest
    // Direction: Always diagonal (br = bottom-right) for consistency
    backgrounds: {
      // Neutral - DEFAULT for most pages (Dashboard, Analytics, etc.)
      neutral: 'bg-gradient-to-br from-gray-50 via-white to-gray-50',
      
      // Slate - For professional/business pages (Reports, Settings)
      slate: 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30',
      
      // Emerald - For success/growth pages (Revenue, Performance)
      emerald: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20',
      
      // Warm - For engagement pages (Bookings, Patients)
      warm: 'bg-gradient-to-br from-orange-50 via-white to-amber-50/30',
      
      // Cool - For inventory/product pages
      cool: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50/30',
      
      // Pure - For minimal/clean pages (Login, Forms)
      pure: 'bg-gradient-to-br from-white to-gray-50',
    },

    // -------------------------------------------------------------------------
    // COMPONENT GRADIENTS
    // -------------------------------------------------------------------------
    // Used for buttons, badges, and interactive elements
    // Direction: Horizontal (r = right) for left-to-right visual flow
    components: {
      // Primary - Main brand actions (Create, Save, Submit)
      primary: 'bg-gradient-to-r from-zennara-green to-emerald-600',
      
      // Secondary action gradients
      blue: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      purple: 'bg-gradient-to-r from-purple-500 to-pink-600',
      emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      amber: 'bg-gradient-to-r from-amber-500 to-orange-600',
      red: 'bg-gradient-to-r from-red-500 to-rose-600',
      cyan: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      teal: 'bg-gradient-to-r from-teal-500 to-emerald-600',
    },

    // -------------------------------------------------------------------------
    // ICON CONTAINER GRADIENTS
    // -------------------------------------------------------------------------
    // Used for icon backgrounds in stat cards and feature cards
    // Direction: Diagonal (br) for depth, Weight: 400→600 for subtle depth
    icons: {
      emerald: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
      purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
      amber: 'bg-gradient-to-br from-amber-400 to-amber-600',
      red: 'bg-gradient-to-br from-red-400 to-red-600',
      green: 'bg-gradient-to-br from-green-400 to-green-600',
      cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      teal: 'bg-gradient-to-br from-teal-400 to-teal-600',
      orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
      pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
      violet: 'bg-gradient-to-br from-violet-400 to-violet-600',
    },

    // -------------------------------------------------------------------------
    // STAT CARD GRADIENTS
    // -------------------------------------------------------------------------
    // Subtle background gradients for stat cards
    // Direction: Diagonal (br), Weight: 50 (pastel) for subtle effect
    statCards: {
      emerald: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30',
      blue: 'bg-gradient-to-br from-blue-50 via-white to-blue-50/30',
      purple: 'bg-gradient-to-br from-purple-50 via-white to-purple-50/30',
      amber: 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30',
      red: 'bg-gradient-to-br from-red-50 via-white to-red-50/30',
      cyan: 'bg-gradient-to-br from-cyan-50 via-white to-cyan-50/30',
      indigo: 'bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30',
      teal: 'bg-gradient-to-br from-teal-50 via-white to-teal-50/30',
      green: 'bg-gradient-to-br from-green-50 via-white to-green-50/30',
      orange: 'bg-gradient-to-br from-orange-50 via-white to-orange-50/30',
      gray: 'bg-gradient-to-br from-gray-50 via-white to-gray-50/30',
      slate: 'bg-gradient-to-br from-slate-50 via-white to-slate-50/30',
    },

    // -------------------------------------------------------------------------
    // TEXT GRADIENTS
    // -------------------------------------------------------------------------
    // Used with bg-clip-text text-transparent for gradient text effects
    // Direction: Horizontal (r) for readability
    text: {
      primary: 'bg-gradient-to-r from-zennara-green to-emerald-600',
      emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      blue: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      purple: 'bg-gradient-to-r from-purple-500 to-pink-600',
      amber: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },

    // -------------------------------------------------------------------------
    // STATUS GRADIENTS
    // -------------------------------------------------------------------------
    // Used for status indicators and progress elements
    // Weight: 500→600 for clear visibility
    status: {
      confirmed: 'bg-gradient-to-r from-emerald-500 to-green-600',
      awaiting: 'bg-gradient-to-r from-amber-500 to-orange-600',
      inProgress: 'bg-gradient-to-r from-violet-500 to-purple-600',
      completed: 'bg-gradient-to-r from-slate-500 to-gray-600',
      cancelled: 'bg-gradient-to-r from-red-500 to-rose-600',
    },

    // -------------------------------------------------------------------------
    // DECORATIVE GRADIENTS
    // -------------------------------------------------------------------------
    // Used for decorative sections and feature highlights
    // Direction: Horizontal (r), Weight: 50 (pastel) for subtle backgrounds
    decorative: {
      purpleBlue: 'bg-gradient-to-r from-purple-50 to-blue-50',
      greenTeal: 'bg-gradient-to-r from-green-50 to-teal-50',
      orangeYellow: 'bg-gradient-to-r from-orange-50 to-yellow-50',
      pinkPurple: 'bg-gradient-to-r from-pink-50 to-purple-50',
      cyanBlue: 'bg-gradient-to-r from-cyan-50 to-blue-50',
    },
  },

  // ============================================================================
  // GLASS MORPHISM
  // ============================================================================
  // Standardized glass morphism effects with backdrop blur
  // Based on comprehensive audit of existing usage patterns
  glass: {
    // Light variant (70% opacity) - For secondary containers and filter sections
    light: 'bg-white/70 backdrop-blur-xl border border-white/20',
    
    // Medium variant (80% opacity) - DEFAULT - For stat cards and standard content cards
    medium: 'bg-white/80 backdrop-blur-xl border border-white/20',
    
    // Heavy variant (90% opacity) - For primary content areas requiring high readability
    heavy: 'bg-white/90 backdrop-blur-xl border border-white/30',
    
    // Card variant (95% opacity) - For modal content and critical UI elements
    card: 'bg-white/95 backdrop-blur-xl border border-white/30',
    
    // Modal overlay variant - For backdrop overlays behind modals and drawers
    overlay: 'bg-black/50 backdrop-blur-sm',
  },

  // ============================================================================
  // SHADOWS
  // ============================================================================
  shadows: {
    // Base shadows
    sm: 'shadow-sm',
    base: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',

    // Common shadow patterns
    patterns: {
      card: 'shadow-sm hover:shadow-lg',
      statCard: 'shadow-lg hover:shadow-xl',
      button: 'shadow-md hover:shadow-lg',
      dropdown: 'shadow-2xl',
    },

    // Colored shadows (for stat cards)
    colored: {
      emerald: 'shadow-lg shadow-emerald-500/30',
      blue: 'shadow-lg shadow-blue-500/30',
      purple: 'shadow-lg shadow-purple-500/30',
      amber: 'shadow-lg shadow-amber-500/30',
      red: 'shadow-lg shadow-red-500/30',
    },
  },

  // ============================================================================
  // BORDER RADIUS
  // ============================================================================
  borderRadius: {
    sm: 'rounded-lg',       // 8px - Small elements
    md: 'rounded-xl',       // 12px - Buttons, inputs
    lg: 'rounded-2xl',      // 16px - Cards
    xl: 'rounded-3xl',      // 24px - Large cards, sections
    full: 'rounded-full',   // Pills, avatars
  },

  // ============================================================================
  // SPACING
  // ============================================================================
  spacing: {
    // Padding
    padding: {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-10',
    },

    // Gaps
    gap: {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },

    // Margins
    margin: {
      xs: 'mb-4',
      sm: 'mb-6',
      md: 'mb-8',
      lg: 'mb-10',
      xl: 'mb-12',
    },
  },

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================
  typography: {
    // Headings
    headings: {
      h1: 'text-4xl font-bold text-gray-900',
      h2: 'text-2xl font-bold text-gray-900',
      h3: 'text-xl font-bold text-gray-900',
      h4: 'text-lg font-semibold text-gray-900',
    },

    // Body text
    body: {
      large: 'text-base font-medium text-gray-700',
      base: 'text-sm font-medium text-gray-700',
      small: 'text-xs font-medium text-gray-600',
    },

    // Labels
    labels: {
      default: 'text-xs font-semibold text-gray-600 uppercase tracking-wider',
      bold: 'text-xs font-bold text-gray-700 uppercase tracking-wider',
    },

    // Descriptions
    descriptions: {
      default: 'text-sm text-gray-500',
      small: 'text-xs text-gray-500',
    },
  },

  // ============================================================================
  // BORDERS
  // ============================================================================
  borders: {
    default: 'border border-gray-200',
    thick: 'border-2 border-gray-200',
    colored: {
      emerald: 'border-2 border-emerald-200',
      blue: 'border-2 border-blue-200',
      purple: 'border-2 border-purple-200',
      amber: 'border-2 border-amber-200',
      red: 'border-2 border-red-200',
    },
  },

  // ============================================================================
  // TRANSITIONS
  // ============================================================================
  transitions: {
    fast: 'transition-all duration-200',
    base: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  // ============================================================================
  // HOVER EFFECTS
  // ============================================================================
  hover: {
    scale: 'hover:scale-105',
    shadow: 'hover:shadow-xl',
    combined: 'hover:scale-105 hover:shadow-xl',
  },

  // ============================================================================
  // ICON SIZES
  // ============================================================================
  iconSizes: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  },
};

export default designTokens;
