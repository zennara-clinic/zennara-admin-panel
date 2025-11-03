# Gradient Usage Guide

## Overview
This guide provides comprehensive instructions for using gradients consistently across the Zennara Admin Panel. All gradients are defined in `tokens.js` and follow standardized patterns.

## Table of Contents
1. [Background Gradients](#background-gradients)
2. [Component Gradients](#component-gradients)
3. [Icon Container Gradients](#icon-container-gradients)
4. [Stat Card Gradients](#stat-card-gradients)
5. [Text Gradients](#text-gradients)
6. [Status Gradients](#status-gradients)
7. [Decorative Gradients](#decorative-gradients)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)

---

## Background Gradients

### Purpose
Create depth and visual interest for full-page backgrounds without overwhelming content.

### Available Variants

#### 1. Neutral (DEFAULT)
```javascript
import { designTokens } from '../design-system/tokens';

<div className={designTokens.gradients.backgrounds.neutral}>
  {/* Page content */}
</div>
```
- **Use for**: Dashboard, Analytics, General pages
- **Visual**: Subtle gray-to-white gradient
- **When**: Default choice for most pages

#### 2. Slate
```javascript
<div className={designTokens.gradients.backgrounds.slate}>
  {/* Page content */}
</div>
```
- **Use for**: Reports, Settings, Professional pages
- **Visual**: Cool blue-gray gradient
- **When**: Need a professional, business-like feel

#### 3. Emerald
```javascript
<div className={designTokens.gradients.backgrounds.emerald}>
  {/* Page content */}
</div>
```
- **Use for**: Revenue, Performance, Growth pages
- **Visual**: Fresh green-teal gradient
- **When**: Highlighting success or growth metrics

#### 4. Warm
```javascript
<div className={designTokens.gradients.backgrounds.warm}>
  {/* Page content */}
</div>
```
- **Use for**: Bookings, Patients, Engagement pages
- **Visual**: Warm orange-amber gradient
- **When**: Creating welcoming, human-focused pages

#### 5. Cool
```javascript
<div className={designTokens.gradients.backgrounds.cool}>
  {/* Page content */}
</div>
```
- **Use for**: Inventory, Products, Catalog pages
- **Visual**: Cool blue-indigo gradient
- **When**: Organizing data or product information

#### 6. Pure
```javascript
<div className={designTokens.gradients.backgrounds.pure}>
  {/* Page content */}
</div>
```
- **Use for**: Login, Forms, Minimal pages
- **Visual**: Clean white-to-gray gradient
- **When**: Need maximum focus and minimal distraction

### Decision Tree
```
Is it a login/form page? → Use Pure
Is it about revenue/growth? → Use Emerald
Is it about people/bookings? → Use Warm
Is it about products/inventory? → Use Cool
Is it professional/settings? → Use Slate
Default/unsure? → Use Neutral
```

---

## Component Gradients

### Purpose
Add visual interest and hierarchy to interactive elements like buttons and badges.

### Primary Actions
```javascript
// Main brand actions (Create, Save, Submit)
<button className={`${designTokens.gradients.components.primary} text-white px-6 py-3 rounded-xl`}>
  Create Booking
</button>
```

### Secondary Actions
```javascript
// Use color-coded gradients for different action types
<button className={`${designTokens.gradients.components.blue} text-white px-6 py-3 rounded-xl`}>
  View Details
</button>

<button className={`${designTokens.gradients.components.amber} text-white px-6 py-3 rounded-xl`}>
  Edit
</button>

<button className={`${designTokens.gradients.components.red} text-white px-6 py-3 rounded-xl`}>
  Delete
</button>
```

### Color Meanings
- **Primary (Green)**: Main actions, creation, confirmation
- **Blue**: Information, viewing, navigation
- **Purple**: Premium features, special actions
- **Emerald**: Success, completion
- **Amber**: Warnings, editing, caution
- **Red**: Destructive actions, deletion, errors
- **Cyan**: Secondary information
- **Indigo**: Advanced features
- **Teal**: Alternative actions

---

## Icon Container Gradients

### Purpose
Create visually appealing icon backgrounds in stat cards and feature cards.

### Usage Pattern
```javascript
// Icon container with gradient background
<div className={`w-16 h-16 ${designTokens.gradients.icons.emerald} rounded-2xl flex items-center justify-center shadow-lg`}>
  <DollarSign className="text-white" size={32} />
</div>
```

### Complete Stat Card Example
```javascript
import { DollarSign } from 'lucide-react';
import { designTokens } from '../design-system/tokens';

<div className={`${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
  {/* Icon with gradient */}
  <div className={`w-16 h-16 ${designTokens.gradients.icons.emerald} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
    <DollarSign className="text-white" size={32} />
  </div>
  
  {/* Content */}
  <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
  <p className="text-4xl font-bold text-gray-900">₹2,45,000</p>
</div>
```

### Color Selection Guide
Match icon gradient to the metric's semantic meaning:
- **Emerald/Green**: Money, revenue, growth
- **Blue**: Users, patients, general metrics
- **Purple**: Premium features, packages
- **Amber**: Warnings, pending items
- **Red**: Errors, critical items, cancellations
- **Cyan**: Information, data
- **Indigo**: Analytics, insights
- **Teal**: Services, consultations
- **Orange**: Orders, inventory
- **Pink**: Special features
- **Violet**: Progress, in-progress items

---

## Stat Card Gradients

### Purpose
Provide subtle background color to stat cards without overwhelming the data.

### Usage Pattern
```javascript
<div className={`${designTokens.gradients.statCards.emerald} rounded-3xl p-8 border border-emerald-100`}>
  {/* Stat card content */}
</div>
```

### When to Use
- Use stat card gradients for **background color only**
- Combine with icon gradients for visual hierarchy
- Keep text dark (gray-900) for readability

### Complete Example
```javascript
<div className={`${designTokens.gradients.statCards.blue} rounded-3xl p-8 border border-blue-100 shadow-lg`}>
  {/* Icon */}
  <div className={`w-16 h-16 ${designTokens.gradients.icons.blue} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
    <Users className="text-white" size={32} />
  </div>
  
  {/* Content */}
  <p className="text-gray-500 text-sm mb-2">Total Patients</p>
  <p className="text-4xl font-bold text-gray-900">1,234</p>
  <p className="text-sm text-blue-600 mt-2">↑ 12% from last month</p>
</div>
```

---

## Text Gradients

### Purpose
Create eye-catching gradient text for emphasis on key numbers or headings.

### Usage Pattern
```javascript
<div className={`text-3xl font-bold ${designTokens.gradients.text.primary} bg-clip-text text-transparent`}>
  {bookings.length}
</div>
```

### Complete Example
```javascript
<div className="text-center">
  <p className="text-sm text-gray-500 mb-2">Today's Bookings</p>
  <div className={`text-4xl font-bold ${designTokens.gradients.text.primary} bg-clip-text text-transparent`}>
    24
  </div>
</div>
```

### When to Use
- Large numbers that need emphasis
- Key metrics in dashboards
- Hero headings
- Call-to-action text

### When NOT to Use
- Body text (readability issues)
- Small text (gradient not visible)
- Long paragraphs (eye strain)

---

## Status Gradients

### Purpose
Provide clear visual indicators for status elements like badges and progress bars.

### Usage Pattern
```javascript
// Status badge with gradient
<div className={`${designTokens.gradients.status.confirmed} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
  Confirmed
</div>
```

### Status Meanings
- **Confirmed**: Green - Success, approved, active
- **Awaiting**: Amber - Pending, waiting, needs attention
- **In Progress**: Violet - Active, processing, ongoing
- **Completed**: Gray - Finished, done, archived
- **Cancelled**: Red - Rejected, failed, cancelled

### Progress Bar Example
```javascript
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className={`${designTokens.gradients.status.inProgress} h-2 rounded-full transition-all duration-300`}
    style={{ width: '60%' }}
  />
</div>
```

---

## Decorative Gradients

### Purpose
Add subtle color to decorative sections and feature highlights.

### Usage Pattern
```javascript
<div className={`${designTokens.gradients.decorative.purpleBlue} rounded-2xl p-6`}>
  <h3 className="text-xl font-bold mb-4">Basic Information</h3>
  {/* Form fields */}
</div>
```

### When to Use
- Form section backgrounds
- Feature highlight boxes
- Information panels
- Callout sections

### Example: Multi-Section Form
```javascript
{/* Section 1 */}
<div className={`${designTokens.gradients.decorative.purpleBlue} rounded-2xl p-6 mb-6`}>
  <h3 className="text-xl font-bold mb-4">Basic Information</h3>
  {/* Fields */}
</div>

{/* Section 2 */}
<div className={`${designTokens.gradients.decorative.greenTeal} rounded-2xl p-6 mb-6`}>
  <h3 className="text-xl font-bold mb-4">Address Information</h3>
  {/* Fields */}
</div>

{/* Section 3 */}
<div className={`${designTokens.gradients.decorative.orangeYellow} rounded-2xl p-6`}>
  <h3 className="text-xl font-bold mb-4">Tax & Banking Details</h3>
  {/* Fields */}
</div>
```

---

## Best Practices

### DO ✓
1. **Use tokens**: Always import from `tokens.js`
   ```javascript
   import { designTokens } from '../design-system/tokens';
   ```

2. **Combine with other tokens**: Use with glass morphism, shadows, etc.
   ```javascript
   className={`${designTokens.gradients.backgrounds.neutral} ${designTokens.glass.medium}`}
   ```

3. **Match semantic meaning**: Choose colors that match the content
   - Green for money/success
   - Red for errors/danger
   - Blue for information

4. **Test readability**: Ensure text is readable on gradient backgrounds

5. **Use hover effects**: Combine with transitions for interactive elements
   ```javascript
   className={`${designTokens.gradients.components.primary} hover:shadow-xl transition-all`}
   ```

### DON'T ✗
1. **Don't create custom gradients**: Use existing tokens
   ```javascript
   // ❌ Bad
   className="bg-gradient-to-r from-pink-300 to-yellow-400"
   
   // ✓ Good
   className={designTokens.gradients.components.purple}
   ```

2. **Don't overuse gradients**: Not every element needs a gradient
   - Use solid colors for most UI elements
   - Reserve gradients for emphasis

3. **Don't mix too many gradients**: Limit to 2-3 gradient types per page
   - Page background: 1 gradient
   - Stat cards: 1-2 gradient colors
   - Buttons: 1 primary gradient

4. **Don't use gradients on small text**: Readability suffers
   ```javascript
   // ❌ Bad - gradient on small text
   <p className={`text-xs ${designTokens.gradients.text.primary} bg-clip-text text-transparent`}>
     Small text
   </p>
   
   // ✓ Good - solid color on small text
   <p className="text-xs text-gray-600">
     Small text
   </p>
   ```

5. **Don't ignore contrast**: Ensure WCAG AA compliance
   - White text on dark gradients
   - Dark text on light gradients

---

## Common Patterns

### Pattern 1: Page Layout
```javascript
<div className={designTokens.gradients.backgrounds.neutral}>
  <div className="max-w-[1920px] mx-auto px-8 py-8">
    {/* Page content */}
  </div>
</div>
```

### Pattern 2: Stat Card Grid
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {stats.map((stat, index) => (
    <div key={index} className={`${designTokens.glass.medium} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
      <div className={`w-16 h-16 ${designTokens.gradients.icons[stat.color]} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
        <stat.Icon className="text-white" size={32} />
      </div>
      <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
      <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
    </div>
  ))}
</div>
```

### Pattern 3: Primary Action Button
```javascript
<button 
  className={`${designTokens.gradients.components.primary} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
  onClick={handleAction}
>
  Create New
</button>
```

### Pattern 4: Status Badge
```javascript
const getStatusGradient = (status) => {
  const statusMap = {
    'Confirmed': designTokens.gradients.status.confirmed,
    'Awaiting': designTokens.gradients.status.awaiting,
    'In Progress': designTokens.gradients.status.inProgress,
    'Completed': designTokens.gradients.status.completed,
    'Cancelled': designTokens.gradients.status.cancelled,
  };
  return statusMap[status] || designTokens.gradients.status.awaiting;
};

<span className={`${getStatusGradient(booking.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
  {booking.status}
</span>
```

### Pattern 5: Gradient Text Emphasis
```javascript
<div className="text-center">
  <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
  <div className={`text-5xl font-bold ${designTokens.gradients.text.primary} bg-clip-text text-transparent`}>
    ₹2,45,000
  </div>
  <p className="text-sm text-emerald-600 mt-2">↑ 12% from last month</p>
</div>
```

---

## Migration Checklist

When updating existing components to use standardized gradients:

- [ ] Import `designTokens` from `tokens.js`
- [ ] Replace custom gradient classes with token references
- [ ] Verify visual appearance matches original
- [ ] Test hover states and transitions
- [ ] Check text readability on gradient backgrounds
- [ ] Ensure responsive behavior is maintained
- [ ] Update any related documentation
- [ ] Test in different browsers

---

## Questions?

If you're unsure which gradient to use:
1. Check this guide's decision trees
2. Look at similar existing components
3. Refer to the design system documentation
4. Ask the design team

Remember: **Consistency > Creativity**. Use existing patterns before creating new ones.
