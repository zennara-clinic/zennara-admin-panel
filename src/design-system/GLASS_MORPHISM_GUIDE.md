# Glass Morphism Usage Guide

## Overview

This guide provides comprehensive documentation for using glass morphism effects in the Zennara Admin Panel. Glass morphism creates a modern, layered aesthetic using semi-transparent backgrounds with backdrop blur effects.

## Design Philosophy

Glass morphism in our design system serves to:
- Create visual hierarchy through layering
- Maintain modern aesthetic while ensuring readability
- Provide subtle depth without heavy shadows
- Allow background gradients to show through subtly

## Standardized Variants

### 1. Light Variant (70% opacity)

```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.glass.light}>
  {/* Content */}
</div>
```

**CSS Classes:** `bg-white/70 backdrop-blur-xl border border-white/20`

**Use Cases:**
- Filter sections and search bars
- Secondary containers
- Background panels
- Toolbar backgrounds
- Sidebar sections

**Visual Characteristics:**
- Most transparent variant
- Allows background to show through prominently
- Best for elements that shouldn't dominate the visual hierarchy
- Subtle border for definition

**Examples:**
```jsx
// Filter Section
<div className={designTokens.glass.light}>
  <input type="search" placeholder="Search..." />
  <select>
    <option>All Categories</option>
  </select>
</div>

// Toolbar
<div className={designTokens.glass.light}>
  <button>Export</button>
  <button>Filter</button>
</div>
```

### 2. Medium Variant (80% opacity) - DEFAULT

```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.glass.medium}>
  {/* Content */}
</div>
```

**CSS Classes:** `bg-white/80 backdrop-blur-xl border border-white/20`

**Use Cases:**
- Stat cards (most common)
- Standard content cards
- Search bars
- Empty states
- List items
- Product cards
- Order cards

**Visual Characteristics:**
- Balanced transparency and readability
- Default choice for most components
- Works well with colored backgrounds
- Provides good contrast for text

**Examples:**
```jsx
// Stat Card
<div className={designTokens.glass.medium}>
  <h3>Total Revenue</h3>
  <p className="text-3xl font-bold">₹2,45,000</p>
  <span className="text-sm text-gray-600">+12% from last month</span>
</div>

// Content Card
<div className={designTokens.glass.medium}>
  <h4>Patient Name</h4>
  <p>Appointment details...</p>
</div>
```

### 3. Heavy Variant (90% opacity)

```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.glass.heavy}>
  {/* Content */}
</div>
```

**CSS Classes:** `bg-white/90 backdrop-blur-xl border border-white/30`

**Use Cases:**
- Primary content areas
- Calendar components
- Important sections requiring high readability
- Data tables
- Forms with multiple inputs
- Dashboard main sections

**Visual Characteristics:**
- High opacity for maximum readability
- Stronger border (30% opacity)
- Best for text-heavy content
- Maintains glass effect while prioritizing legibility

**Examples:**
```jsx
// Calendar Component
<div className={designTokens.glass.heavy}>
  <div className="calendar-header">
    <h3>December 2024</h3>
  </div>
  <div className="calendar-grid">
    {/* Calendar days */}
  </div>
</div>

// Data Table Container
<div className={designTokens.glass.heavy}>
  <table>
    {/* Table content */}
  </table>
</div>
```

### 4. Card Variant (95% opacity)

```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.glass.card}>
  {/* Content */}
</div>
```

**CSS Classes:** `bg-white/95 backdrop-blur-xl border border-white/30`

**Use Cases:**
- Modal content (not overlay)
- Drawer content
- Critical UI elements
- Forms requiring maximum focus
- Detailed information panels

**Visual Characteristics:**
- Highest opacity (95%)
- Nearly opaque while maintaining glass effect
- Strong border definition
- Maximum readability

**Examples:**
```jsx
// Modal Content
<div className={designTokens.glass.overlay}>
  <div className={designTokens.glass.card}>
    <h2>Edit Booking</h2>
    <form>
      {/* Form fields */}
    </form>
  </div>
</div>

// Drawer
<aside className={designTokens.glass.card}>
  <h3>Filters</h3>
  {/* Filter options */}
</aside>
```

### 5. Overlay Variant (Modal Backdrop)

```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.glass.overlay}>
  {/* Modal content */}
</div>
```

**CSS Classes:** `bg-black/50 backdrop-blur-sm`

**Use Cases:**
- Modal backdrop overlays
- Drawer overlays
- Fullscreen overlay backgrounds
- Loading overlays

**Visual Characteristics:**
- Black background (50% opacity)
- Subtle blur (sm)
- Dims background content
- Focuses attention on foreground

**Examples:**
```jsx
// Modal with Overlay
{showModal && (
  <div className={designTokens.glass.overlay}>
    <div className={designTokens.glass.card}>
      <h2>Confirm Action</h2>
      <p>Are you sure you want to proceed?</p>
      <button>Confirm</button>
      <button>Cancel</button>
    </div>
  </div>
)}
```

## Decision Tree

Use this decision tree to choose the right variant:

```
Is it a modal backdrop?
├─ YES → Use overlay variant
└─ NO → Continue

Does it contain primarily text/data?
├─ YES → Use heavy or card variant
└─ NO → Continue

Is it a primary content area?
├─ YES → Use heavy variant
└─ NO → Continue

Is it a stat card or standard card?
├─ YES → Use medium variant (DEFAULT)
└─ NO → Continue

Is it a filter/toolbar/secondary element?
├─ YES → Use light variant
└─ NO → Use medium variant (DEFAULT)
```

## Combining with Other Styles

### With Gradients

Glass morphism works beautifully with gradient backgrounds:

```jsx
// Page with gradient background
<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20">
  {/* Glass morphism cards show gradient through transparency */}
  <div className={designTokens.glass.medium}>
    <h2>Content Card</h2>
  </div>
</div>
```

### With Shadows

Combine glass effects with shadows for depth:

```jsx
<div className={`${designTokens.glass.medium} ${designTokens.shadows.patterns.card}`}>
  {/* shadow-sm hover:shadow-lg */}
  <h3>Hoverable Card</h3>
</div>
```

### With Rounded Corners

Always use appropriate border radius:

```jsx
<div className={`${designTokens.glass.medium} ${designTokens.borderRadius.lg}`}>
  {/* rounded-2xl for cards */}
  <h3>Card Content</h3>
</div>
```

### With Hover Effects

Add interactive hover states:

```jsx
<div className={`${designTokens.glass.medium} ${designTokens.hover.combined} ${designTokens.transitions.base}`}>
  {/* hover:scale-105 hover:shadow-xl transition-all duration-300 */}
  <h3>Interactive Card</h3>
</div>
```

## Complete Component Examples

### Stat Card with Glass Morphism

```jsx
import { designTokens } from '../design-system/tokens';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon }) => (
  <div className={`
    ${designTokens.glass.medium}
    ${designTokens.borderRadius.lg}
    ${designTokens.spacing.padding.lg}
    ${designTokens.shadows.patterns.statCard}
    ${designTokens.hover.combined}
    ${designTokens.transitions.base}
    group relative overflow-hidden
  `}>
    {/* Icon */}
    <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
      <Icon className="text-white" size={32} />
    </div>
    
    {/* Content */}
    <div className="relative z-10">
      <p className={designTokens.typography.labels.default}>{label}</p>
      <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
      {trend && (
        <div className="flex items-center mt-2 text-sm">
          <TrendingUp size={16} className="text-emerald-600 mr-1" />
          <span className="text-emerald-600 font-semibold">{trend}%</span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  </div>
);
```

### Filter Section with Glass Morphism

```jsx
import { designTokens } from '../design-system/tokens';
import { Search, Filter } from 'lucide-react';

const FilterSection = ({ onSearch, onFilter }) => (
  <div className={`
    ${designTokens.glass.light}
    ${designTokens.borderRadius.lg}
    ${designTokens.spacing.padding.md}
    ${designTokens.shadows.sm}
  `}>
    <div className="flex gap-4 items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onChange={onSearch}
        />
      </div>
      
      {/* Filter Button */}
      <button className="px-4 py-2 bg-white/50 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all">
        <Filter size={20} />
      </button>
    </div>
  </div>
);
```

### Modal with Glass Morphism

```jsx
import { designTokens } from '../design-system/tokens';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`fixed inset-0 ${designTokens.glass.overlay} flex items-center justify-center z-50 p-4`}>
      <div className={`
        ${designTokens.glass.card}
        ${designTokens.borderRadius.xl}
        ${designTokens.shadows['2xl']}
        max-w-2xl w-full max-h-[90vh] overflow-hidden
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## Accessibility Considerations

### Contrast Ratios

Ensure text maintains sufficient contrast on glass backgrounds:

- **Light variant (70%):** Use dark text (gray-900, gray-800)
- **Medium variant (80%):** Use dark text (gray-900, gray-800)
- **Heavy variant (90%):** Safe for all text colors
- **Card variant (95%):** Safe for all text colors

### Testing

Always test glass morphism effects with:
1. Different background gradients
2. Various text sizes
3. Color contrast checkers
4. Screen readers (ensure content is readable)

## Performance Considerations

### Backdrop Blur Performance

Backdrop blur can be GPU-intensive. Best practices:

1. **Limit nesting:** Avoid multiple layers of backdrop blur
2. **Use sparingly:** Don't apply to every element
3. **Test on lower-end devices:** Ensure smooth performance
4. **Consider fallbacks:** Provide solid backgrounds for older browsers

### Browser Support

Backdrop blur is supported in:
- Chrome 76+
- Safari 9+
- Firefox 103+
- Edge 79+

For older browsers, the effect gracefully degrades to semi-transparent backgrounds.

## Migration Guide

### From Old Patterns

Replace inconsistent patterns with standardized variants:

```jsx
// OLD - Inconsistent
<div className="bg-white/80 backdrop-blur-2xl border border-purple-100">

// NEW - Standardized
<div className={designTokens.glass.medium}>
```

```jsx
// OLD - Inconsistent
<div className="bg-white/70 backdrop-blur-xl">

// NEW - Standardized
<div className={designTokens.glass.light}>
```

```jsx
// OLD - Inconsistent
<div className="bg-black/40 backdrop-blur-sm">

// NEW - Standardized
<div className={designTokens.glass.overlay}>
```

## Common Mistakes to Avoid

### ❌ Don't Mix Variants Randomly

```jsx
// BAD - Inconsistent usage
<div className="bg-white/75 backdrop-blur-lg border border-white/25">
```

### ✅ Use Standardized Variants

```jsx
// GOOD - Consistent usage
<div className={designTokens.glass.medium}>
```

### ❌ Don't Nest Too Many Glass Layers

```jsx
// BAD - Performance issues
<div className={designTokens.glass.light}>
  <div className={designTokens.glass.medium}>
    <div className={designTokens.glass.heavy}>
      {/* Too many blur layers */}
    </div>
  </div>
</div>
```

### ✅ Limit Glass Layers

```jsx
// GOOD - Single glass layer
<div className={designTokens.glass.medium}>
  <div className="bg-white rounded-lg p-4">
    {/* Solid background for nested content */}
  </div>
</div>
```

### ❌ Don't Use Glass on Solid Backgrounds

```jsx
// BAD - Glass effect wasted on solid background
<div className="bg-white">
  <div className={designTokens.glass.medium}>
    {/* No gradient to show through */}
  </div>
</div>
```

### ✅ Use Glass with Gradients

```jsx
// GOOD - Glass effect shows gradient
<div className="bg-gradient-to-br from-emerald-50 to-teal-50">
  <div className={designTokens.glass.medium}>
    {/* Gradient visible through glass */}
  </div>
</div>
```

## Testing Checklist

Before deploying glass morphism components:

- [ ] Text contrast meets WCAG AA standards (4.5:1)
- [ ] Hover states are visible and smooth
- [ ] Component works on gradient backgrounds
- [ ] Component works on solid backgrounds (fallback)
- [ ] Performance is acceptable on mobile devices
- [ ] Border visibility is appropriate
- [ ] Shadow depth is consistent with design system
- [ ] Border radius matches component type
- [ ] Spacing (padding) is consistent
- [ ] Component is keyboard accessible

## Resources

- [Design Tokens Documentation](./tokens.js)
- [Glass Morphism Audit Report](../../.kiro/specs/admin-panel-design-system-redesign/GLASS_MORPHISM_AUDIT.md)
- [Component Library](./components/)
- [Tailwind CSS Backdrop Blur](https://tailwindcss.com/docs/backdrop-blur)

## Support

For questions or issues with glass morphism implementation:
1. Check this guide first
2. Review the audit report for context
3. Consult the design tokens file
4. Test with different backgrounds

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Zennara Design System Team
