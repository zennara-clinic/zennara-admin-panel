# StatCard Component Usage Guide

## Overview

The `StatCard` component is a unified, standardized component for displaying key performance indicators (KPIs) and statistics across the Zennara Admin Panel. It replaces all existing stat card implementations with a consistent, maintainable solution.

## Features

- ✅ **4 Visual Variants:** Solid, Subtle, Glass, and Simple
- ✅ **9 Color Schemes:** Emerald, Blue, Purple, Amber, Red, Gray, Cyan, Rose, Green
- ✅ **Consistent Styling:** Standardized padding, shadows, hover effects
- ✅ **Decorative Elements:** Gradient overlays, blur circles, animated dots
- ✅ **Trend Indicators:** Optional trend badges with up/down arrows
- ✅ **Interactive:** Optional click handlers
- ✅ **Accessible:** Proper semantic HTML and ARIA support

## Installation

```jsx
import { StatCard } from '@/design-system/components';
// or
import StatCard from '@/design-system/components/StatCard';
```

## Basic Usage

```jsx
import { StatCard } from '@/design-system/components';
import { IndianRupee } from 'lucide-react';

<StatCard
  label="Total Revenue"
  value="₹2,45,000"
  icon={IndianRupee}
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'solid' \| 'subtle' \| 'glass' \| 'simple'` | `'solid'` | No | Visual style variant |
| `colorScheme` | `'emerald' \| 'blue' \| 'purple' \| 'amber' \| 'red' \| 'gray' \| 'cyan' \| 'rose' \| 'green'` | `'emerald'` | No | Color theme |
| `label` | `string` | - | **Yes** | Label text above value |
| `value` | `string \| number` | - | **Yes** | Main value to display |
| `sublabel` | `string` | - | No | Optional text below value |
| `icon` | `React.ComponentType` | - | No | Icon component (Lucide React) |
| `trend` | `{ value: number, label?: string }` | - | No | Trend indicator |
| `showAnimatedDot` | `boolean` | `false` | No | Show pulsing dot indicator |
| `onClick` | `function` | - | No | Click handler |
| `className` | `string` | `''` | No | Additional CSS classes |

## Variants

### 1. Solid Variant (Dashboard Style)

Rich, bold gradients with white text. Best for high-impact KPIs.

```jsx
<StatCard
  variant="solid"
  colorScheme="emerald"
  label="Total Revenue"
  value="₹2,45,000"
  sublabel="This month"
  icon={IndianRupee}
  trend={{ value: 12.5 }}
  showAnimatedDot={true}
/>
```

**Use Cases:**
- Dashboard overview cards
- Primary metrics
- High-priority KPIs

### 2. Subtle Variant (Products Style)

Light, pastel gradients with colored text. Best for detailed views.

```jsx
<StatCard
  variant="subtle"
  colorScheme="emerald"
  label="Active Products"
  value="1,180"
  sublabel="Available now"
  icon={CheckCircle}
  showAnimatedDot={true}
/>
```

**Use Cases:**
- Product statistics
- Inventory metrics
- Category breakdowns

### 3. Glass Variant (Orders Style)

Backdrop blur with light gradients. Best for layered interfaces.

```jsx
<StatCard
  variant="glass"
  colorScheme="blue"
  label="Confirmed Orders"
  value="123"
  sublabel="Confirmed"
  icon={CheckCircle}
/>
```

**Use Cases:**
- Order status cards
- Workflow stages
- Process tracking

### 4. Simple Variant (Bookings/Patients Style)

Clean white cards with colored accents. Best for minimal interfaces.

```jsx
<StatCard
  variant="simple"
  colorScheme="blue"
  label="Total Bookings"
  value="234"
  sublabel="All bookings"
  icon={Calendar}
/>
```

**Use Cases:**
- Booking statistics
- Patient metrics
- Simple dashboards

## Color Schemes

### Available Colors

- **Emerald:** Success, growth, revenue
- **Blue:** Information, patients, bookings
- **Purple:** Premium, special features
- **Amber:** Warnings, low stock, attention needed
- **Red:** Errors, critical issues, cancellations
- **Gray:** Neutral, totals, general stats
- **Cyan:** Active, in-progress, processing
- **Rose:** Services, treatments, care
- **Green:** Completed, delivered, success

### Color Psychology

```jsx
// Success/Positive
<StatCard colorScheme="emerald" label="Completed" value="189" />

// Information
<StatCard colorScheme="blue" label="Patients" value="1,234" />

// Warning
<StatCard colorScheme="amber" label="Low Stock" value="12" />

// Error/Critical
<StatCard colorScheme="red" label="Cancelled" value="8" />

// Neutral
<StatCard colorScheme="gray" label="Total" value="456" />
```

## Trend Indicators

### Automatic Formatting

```jsx
// Positive trend (shows up arrow)
<StatCard
  label="Revenue"
  value="₹2,45,000"
  trend={{ value: 12.5 }}  // Shows "+12.5%"
/>

// Negative trend (shows down arrow)
<StatCard
  label="Cancellations"
  value="8"
  trend={{ value: -5.2 }}  // Shows "-5.2%"
/>
```

### Custom Label

```jsx
<StatCard
  label="Completion Rate"
  value="95"
  trend={{ value: 95, label: "95%" }}
/>

<StatCard
  label="Inventory"
  value="12"
  trend={{ value: 0, label: "Alert" }}
/>
```

## Animated Indicators

### Pulsing Dot

Use for real-time or active status:

```jsx
<StatCard
  label="Live Orders"
  value="24"
  sublabel="Active now"
  showAnimatedDot={true}
/>
```

## Interactive Cards

### Click Handlers

```jsx
<StatCard
  label="Total Patients"
  value="1,234"
  sublabel="Click to view list"
  icon={Users}
  onClick={() => navigate('/patients')}
/>
```

## Layout Examples

### Dashboard Grid (6 columns)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
  <StatCard variant="solid" colorScheme="emerald" label="Revenue" value="₹2.4L" icon={IndianRupee} />
  <StatCard variant="solid" colorScheme="blue" label="Patients" value="1,234" icon={Users} />
  <StatCard variant="solid" colorScheme="purple" label="Appointments" value="89" icon={Calendar} />
  <StatCard variant="solid" colorScheme="rose" label="Services" value="156" icon={Heart} />
  <StatCard variant="solid" colorScheme="amber" label="Inventory" value="12" icon={AlertTriangle} />
  <StatCard variant="solid" colorScheme="cyan" label="Orders" value="24" icon={ShoppingBag} />
</div>
```

### Products Grid (3 columns)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <StatCard variant="subtle" colorScheme="gray" label="Total Products" value="1,245" icon={Package} />
  <StatCard variant="subtle" colorScheme="emerald" label="Active" value="1,180" icon={CheckCircle} />
  <StatCard variant="subtle" colorScheme="amber" label="Low Stock" value="45" icon={AlertTriangle} />
</div>
```

### Orders Grid (5 columns)

```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  <StatCard variant="glass" colorScheme="gray" label="Total" value="456" />
  <StatCard variant="glass" colorScheme="blue" label="Confirmed" value="123" />
  <StatCard variant="glass" colorScheme="purple" label="Processing" value="45" />
  <StatCard variant="glass" colorScheme="cyan" label="Shipped" value="234" />
  <StatCard variant="glass" colorScheme="emerald" label="Delivered" value="189" />
</div>
```

### Bookings Grid (6 columns)

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
  <StatCard variant="simple" colorScheme="blue" label="Total" value="234" icon={Calendar} />
  <StatCard variant="simple" colorScheme="green" label="Confirmed" value="189" icon={CheckCircle} />
  <StatCard variant="simple" colorScheme="amber" label="Pending" value="32" icon={Clock} />
  <StatCard variant="simple" colorScheme="red" label="Cancelled" value="13" icon={XCircle} />
  <StatCard variant="simple" colorScheme="gray" label="Completed" value="156" icon={CheckCircle} />
  <StatCard variant="simple" colorScheme="blue" label="Rescheduled" value="8" icon={Clock} />
</div>
```

## Migration Guide

### From Dashboard Cards

**Before:**
```jsx
<div className="group relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
  {/* Complex nested structure */}
</div>
```

**After:**
```jsx
<StatCard
  variant="solid"
  colorScheme="emerald"
  label="Total Revenue"
  value="₹2,45,000"
  sublabel="This month"
  icon={IndianRupee}
  trend={{ value: 12.5 }}
  showAnimatedDot={true}
/>
```

### From Products Cards

**Before:**
```jsx
<div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-emerald-100 hover:shadow-2xl hover:scale-105 hover:border-emerald-200 transition-all duration-300 overflow-hidden">
  {/* Complex nested structure */}
</div>
```

**After:**
```jsx
<StatCard
  variant="subtle"
  colorScheme="emerald"
  label="Active Products"
  value="1,180"
  sublabel="Available now"
  icon={CheckCircle}
  showAnimatedDot={true}
/>
```

### From Orders Cards

**Before:**
```jsx
<div className="group bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-blue-100/50 p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
  {/* Complex nested structure */}
</div>
```

**After:**
```jsx
<StatCard
  variant="glass"
  colorScheme="blue"
  label="Confirmed"
  value="123"
  sublabel="Confirmed"
  icon={CheckCircle}
/>
```

### From Bookings/Patients Cards

**Before:**
```jsx
<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
  {/* Simple structure */}
</div>
```

**After:**
```jsx
<StatCard
  variant="simple"
  colorScheme="blue"
  label="Total Bookings"
  value="234"
  sublabel="All bookings"
  icon={Calendar}
/>
```

## Best Practices

### 1. Choose the Right Variant

- **Solid:** High-impact, primary metrics
- **Subtle:** Detailed views, multiple categories
- **Glass:** Layered interfaces, modern look
- **Simple:** Minimal interfaces, clean design

### 2. Use Appropriate Colors

- Match color to semantic meaning
- Use emerald/green for positive metrics
- Use red for errors/critical issues
- Use amber for warnings
- Use blue for informational metrics

### 3. Provide Context

Always include:
- Clear, concise labels
- Meaningful values
- Helpful sublabels when needed

### 4. Use Trends Wisely

- Show trends for time-based metrics
- Use custom labels for non-percentage values
- Consider if trend adds value

### 5. Animated Indicators

Use sparingly for:
- Real-time data
- Active/live status
- Critical alerts

### 6. Grid Layouts

- Use consistent gaps (gap-4 or gap-6)
- Ensure responsive breakpoints
- Maintain visual balance

## Accessibility

The StatCard component follows accessibility best practices:

- Semantic HTML structure
- Proper color contrast ratios
- Keyboard navigation support (when clickable)
- Screen reader friendly

### Clickable Cards

```jsx
<StatCard
  label="Total Patients"
  value="1,234"
  onClick={() => navigate('/patients')}
  // Automatically gets cursor-pointer and proper hover states
/>
```

## Performance

The StatCard component is optimized for performance:

- Minimal re-renders
- CSS-based animations
- No heavy dependencies
- Tree-shakeable imports

## Troubleshooting

### Icons Not Showing

Ensure you're importing from Lucide React:

```jsx
import { IndianRupee, Users, Calendar } from 'lucide-react';
```

### Colors Not Applying

Check that colorScheme is one of the supported values:
- emerald, blue, purple, amber, red, gray, cyan, rose, green

### Hover Effects Not Working

Ensure parent container doesn't have `overflow: hidden` without proper z-index management.

## Examples Repository

See `StatCard.stories.jsx` for comprehensive examples of all variants and configurations.

## Support

For issues or questions:
1. Check this documentation
2. Review `StatCard.stories.jsx` examples
3. Consult the design system team

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Component:** StatCard  
**Status:** ✅ Production Ready
