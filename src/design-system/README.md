# Zennara Admin Panel - Design System

## Overview

This design system provides a unified set of components, patterns, and guidelines for the Zennara Admin Panel. It is based on an audit of the existing codebase and standardizes the modern aesthetic while ensuring consistency across all pages.

## Design Principles

1. **Preserve Modern Aesthetic** - Keep the beautiful glass morphism, gradients, and visual appeal
2. **Standardize Patterns** - Ensure consistent usage of design elements
3. **Reduce Cognitive Load** - Clear hierarchy and intuitive interactions
4. **Maintain Performance** - Fast, responsive, and delightful interactions
5. **Ensure Accessibility** - WCAG 2.1 Level AA compliance

## Design Tokens

All design tokens are defined in `tokens.js`. Import and use them throughout the application:

```javascript
import { designTokens } from './design-system/tokens';

// Example usage
const cardClass = `${designTokens.glass.light} ${designTokens.borderRadius.lg} ${designTokens.shadows.patterns.card}`;
```

## Color System

### Brand Colors
- **Primary**: `#156450` (zennara-green)
- **Secondary**: `#10b981` (emerald-500)
- **Background**: `#FFF9F6` (zennara-white)

### Semantic Colors
- **Success**: `#10b981` (emerald-500)
- **Error**: `#EF4444` (red-500)
- **Warning**: `#F59E0B` (amber-500)
- **Info**: `#3B82F6` (blue-500)

### Status Colors
Used for badges and indicators:
- Pending: Yellow
- Confirmed: Green
- Processing: Indigo
- Completed: Gray
- Cancelled: Red

## Gradient System

### Background Gradients
Use for page backgrounds:
```javascript
// Emerald (default for most pages)
className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20"

// Slate (for orders, analytics)
className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30"

// White (for clean pages)
className="bg-gradient-to-br from-white to-gray-50"
```

### Component Gradients
Use for buttons, badges:
```javascript
// Primary action
className="bg-gradient-to-r from-zennara-green to-emerald-600"

// Secondary actions
className="bg-gradient-to-r from-blue-500 to-indigo-600"
```

### Stat Card Gradients
Use for stat cards:
```javascript
className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30"
```

## Glass Morphism

### Variants
- **Light**: `bg-white/80 backdrop-blur-xl` - For overlays, modals
- **Medium**: `bg-white/70 backdrop-blur-xl` - For filter sections
- **Heavy**: `bg-white/90 backdrop-blur-xl` - For important cards
- **Card**: `bg-white/95 backdrop-blur-xl` - For content cards

### Usage Guidelines
- Use light for temporary overlays
- Use medium for filter/search sections
- Use heavy for important information cards
- Use card for main content containers

## Shadow System

### Base Shadows
- `shadow-sm` - Subtle cards
- `shadow` - Default cards
- `shadow-md` - Buttons
- `shadow-lg` - Elevated cards
- `shadow-xl` - Hover states
- `shadow-2xl` - Modals, dropdowns

### Common Patterns
```javascript
// Card
className="shadow-sm hover:shadow-lg transition-all duration-300"

// Stat Card
className="shadow-lg hover:shadow-xl transition-all duration-300"

// Button
className="shadow-md hover:shadow-lg transition-all duration-200"
```

### Colored Shadows
For stat cards:
```javascript
className="shadow-lg shadow-emerald-500/30"
```

## Border Radius

- **Small** (`rounded-lg` - 8px): Small elements, badges
- **Medium** (`rounded-xl` - 12px): Buttons, inputs
- **Large** (`rounded-2xl` - 16px): Cards
- **Extra Large** (`rounded-3xl` - 24px): Large cards, sections
- **Full** (`rounded-full`): Pills, avatars

## Spacing

### Padding
- `p-3` - Extra small
- `p-4` - Small
- `p-5` - Medium (default for cards)
- `p-6` - Large
- `p-8` - Extra large (for sections)
- `p-10` - 2XL (for page containers)

### Gaps
- `gap-2` - Extra small
- `gap-3` - Small
- `gap-4` - Medium (default for grids)
- `gap-6` - Large
- `gap-8` - Extra large

### Margins
- `mb-4` - Extra small
- `mb-6` - Small
- `mb-8` - Medium (default between sections)
- `mb-10` - Large
- `mb-12` - Extra large

## Typography

### Headings
```javascript
// H1 - Page titles
className="text-4xl font-bold text-gray-900"

// H2 - Section titles
className="text-2xl font-bold text-gray-900"

// H3 - Subsection titles
className="text-xl font-bold text-gray-900"

// H4 - Card titles
className="text-lg font-semibold text-gray-900"
```

### Body Text
```javascript
// Large
className="text-base font-medium text-gray-700"

// Base (default)
className="text-sm font-medium text-gray-700"

// Small
className="text-xs font-medium text-gray-600"
```

### Labels
```javascript
// Default
className="text-xs font-semibold text-gray-600 uppercase tracking-wider"

// Bold
className="text-xs font-bold text-gray-700 uppercase tracking-wider"
```

### Descriptions
```javascript
// Default
className="text-sm text-gray-500"

// Small
className="text-xs text-gray-500"
```

## Icon System

### Sizes
- `w-3 h-3` (12px) - Extra small, inline text
- `w-4 h-4` (16px) - Small, buttons
- `w-5 h-5` (20px) - Medium, default
- `w-6 h-6` (24px) - Large, card headers
- `w-8 h-8` (32px) - Extra large, stat cards
- `w-10 h-10` (40px) - 2XL, hero icons

### Usage
Always use Lucide React icons:
```javascript
import { DollarSign, Users, Calendar } from 'lucide-react';

<DollarSign className="w-5 h-5 text-emerald-600" />
```

### Color Guidelines
- Primary actions: `text-emerald-600`
- Secondary actions: `text-gray-600`
- Disabled: `text-gray-400`
- Success: `text-green-600`
- Error: `text-red-600`
- Warning: `text-amber-600`
- Info: `text-blue-600`

## Hover Effects

### Scale
```javascript
className="hover:scale-105 transition-all duration-300"
```

### Shadow
```javascript
className="hover:shadow-xl transition-all duration-300"
```

### Combined (recommended for cards)
```javascript
className="hover:scale-105 hover:shadow-xl transition-all duration-300"
```

## Transitions

- **Fast** (`duration-200`): Buttons, small interactions
- **Base** (`duration-300`): Cards, most interactions
- **Slow** (`duration-500`): Large animations, page transitions

Always include `transition-all` for smooth animations.

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Maintain consistency** across similar components
3. **Test on multiple screen sizes** (1024px, 1440px, 1920px)
4. **Ensure accessibility** (color contrast, keyboard navigation)
5. **Optimize performance** (avoid unnecessary re-renders)
6. **Document new patterns** when adding components

## Component Guidelines

### Stat Cards
- Use gradient backgrounds
- Include decorative elements (circles, gradients)
- Implement hover effects (scale + shadow)
- Use colored shadows for emphasis
- Include icon with gradient background
- Show trend indicators when applicable

### Filter Sections
- Use glass morphism (medium variant)
- Group related filters
- Provide clear labels
- Include reset functionality
- Show active filters

### Data Tables
- Use alternating row colors
- Implement hover states
- Provide sorting indicators
- Include pagination
- Show empty states

### Buttons
- Use appropriate gradient for context
- Include icons when helpful
- Implement loading states
- Provide disabled states
- Use consistent sizing

## Migration Guide

When migrating existing components:

1. **Audit** the current implementation
2. **Identify** inconsistencies with design system
3. **Replace** hardcoded values with design tokens
4. **Test** functionality thoroughly
5. **Document** any new patterns

## Support

For questions or issues with the design system:
1. Check this documentation
2. Review `tokens.js` for available tokens
3. Look at existing components for examples
4. Consult the team for guidance

## Version History

- **v1.0.0** (2025-01-XX) - Initial design system documentation based on codebase audit
