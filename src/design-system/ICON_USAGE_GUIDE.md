# Icon Usage Guide

## Overview

This guide provides comprehensive documentation for using icons in the Zennara Admin Panel. All icons use Lucide React, a modern, tree-shakeable icon library with consistent design.

## Quick Start

```javascript
// Import icons from lucide-react
import { Calendar, User, Check } from 'lucide-react';

// Use in your component
<Calendar size={20} className="text-gray-600" />
```

## Icon Component Wrapper

For convenience, use the unified Icon component:

```javascript
import { Icon } from '@/design-system/components/Icon';

// Basic usage
<Icon name="Calendar" />

// With size
<Icon name="User" size="lg" />

// With custom styling
<Icon name="Check" size="sm" className="text-green-600" />
```

## Icon Sizing Guidelines

### Size Standards

| Size | Pixels | Tailwind | Use Case |
|------|--------|----------|----------|
| xs   | 12px   | w-3 h-3  | Submenu indicators, tiny badges |
| sm   | 16px   | w-4 h-4  | Buttons, navigation, inline text |
| md   | 20px   | w-5 h-5  | Default size, cards, forms |
| lg   | 24px   | w-6 h-6  | Card headers, prominent buttons |
| xl   | 32px   | w-8 h-8  | Page headers, feature icons |
| 2xl  | 48px   | w-12 h-12| Hero sections, empty states |

### Examples

```javascript
// Small icon in button
<button className="flex items-center gap-2">
  <Plus size={16} />
  Add Item
</button>

// Default icon in navigation
<nav>
  <Calendar size={20} className="text-gray-600" />
</nav>

// Large icon in page header
<header className="flex items-center gap-3">
  <Package size={32} className="text-emerald-600" />
  <h1>Inventory</h1>
</header>
```


## Icon Color Patterns

### Semantic Colors

```javascript
// Success
<CheckCircle size={20} className="text-green-600" />

// Error
<XCircle size={20} className="text-red-600" />

// Warning
<AlertTriangle size={20} className="text-amber-600" />

// Info
<Info size={20} className="text-blue-600" />

// Primary
<Star size={20} className="text-emerald-600" />

// Neutral
<User size={20} className="text-gray-500" />

// Muted
<Clock size={20} className="text-gray-400" />
```

### Context-Based Colors

```javascript
// Active navigation item
<Calendar size={16} className="text-white" />

// Inactive navigation item
<Calendar size={16} className="text-gray-600 group-hover:text-emerald-600" />

// Stat card icon
<TrendingUp size={24} className="text-emerald-600" />

// Danger action
<Trash2 size={16} className="text-red-600 hover:text-red-700" />
```

## Common Use Cases

### 1. Buttons

```javascript
// Primary button with icon
<button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
  <Plus size={16} />
  Add New
</button>

// Icon-only button
<button className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Edit">
  <Edit2 size={16} className="text-gray-600" />
</button>

// Button with trailing icon
<button className="flex items-center gap-2">
  Download Report
  <Download size={16} />
</button>
```

### 2. Navigation

```javascript
// Sidebar navigation item
<Link className="flex items-center gap-3 px-3 py-2">
  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
    <Calendar size={16} className="text-gray-600" />
  </div>
  <span>Bookings</span>
</Link>

// Breadcrumb
<nav className="flex items-center gap-2">
  <Home size={16} />
  <ChevronRight size={12} />
  <span>Products</span>
</nav>
```

### 3. Cards

```javascript
// Stat card
<div className="bg-white rounded-2xl p-6">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
      <IndianRupee size={24} className="text-emerald-600" />
    </div>
    <TrendingUp size={16} className="text-green-600" />
  </div>
  <h3 className="text-2xl font-bold">₹2,45,000</h3>
  <p className="text-sm text-gray-600">Total Revenue</p>
</div>

// Feature card
<div className="bg-white rounded-xl p-6 border border-gray-200">
  <Package size={32} className="text-emerald-600 mb-4" />
  <h3 className="text-lg font-semibold mb-2">Inventory Management</h3>
  <p className="text-sm text-gray-600">Track and manage your product inventory</p>
</div>
```


### 4. Forms

```javascript
// Input with icon
<div className="relative">
  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input 
    type="text" 
    placeholder="Search..." 
    className="pl-10 pr-4 py-2 border rounded-xl"
  />
</div>

// Validation error
{error && (
  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
    <AlertCircle size={14} />
    {error}
  </p>
)}

// Success message
{success && (
  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
    <CheckCircle size={14} />
    {success}
  </p>
)}
```

### 5. Status Badges

```javascript
// Status badge with icon
const StatusBadge = ({ status }) => {
  const config = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };
  
  const { icon: Icon, color, bg } = config[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${bg} ${color}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};
```

### 6. Empty States

```javascript
// Empty state
<div className="flex flex-col items-center justify-center py-12">
  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <Package size={32} className="text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
  <p className="text-sm text-gray-600 mb-4">Get started by adding your first product</p>
  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
    <Plus size={16} />
    Add Product
  </button>
</div>
```

### 7. Loading States

```javascript
// Loading spinner
<Loader size={20} className="animate-spin text-emerald-600" />

// Loading with text
<div className="flex items-center gap-2">
  <Loader size={16} className="animate-spin" />
  <span>Loading...</span>
</div>
```

### 8. Dropdowns & Menus

```javascript
// Dropdown trigger
<button className="flex items-center gap-2">
  <span>Options</span>
  <ChevronDown size={16} />
</button>

// Menu item
<button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full">
  <Edit2 size={16} className="text-gray-600" />
  <span>Edit</span>
</button>
```

## Icon Categories

### Navigation Icons
- `LayoutDashboard` - Dashboard
- `Calendar` - Bookings, Schedule
- `Users` - Patients, Customers
- `Package` - Products, Inventory
- `ClipboardList` - Orders
- `BarChart3` - Analytics
- `Settings` - Settings
- `MapPin` - Locations

### Action Icons
- `Plus` - Add, Create
- `Edit2` - Edit
- `Trash2` - Delete
- `Search` - Search
- `Filter` - Filter
- `Download` - Download
- `Upload` - Upload
- `RefreshCw` - Refresh
- `Copy` - Copy
- `Share2` - Share

### Status Icons
- `CheckCircle` - Success, Completed
- `XCircle` - Error, Cancelled
- `AlertCircle` - Info
- `AlertTriangle` - Warning
- `Clock` - Pending, Waiting
- `Loader` - Loading

### Communication Icons
- `Mail` - Email
- `Phone` - Phone
- `MessageCircle` - Chat, Messages
- `Bell` - Notifications

### User Icons
- `User` - User profile
- `UserCircle` - Account
- `UserPlus` - Add user
- `UserCheck` - Verified user
- `Users` - Multiple users

### Financial Icons
- `IndianRupee` - Currency
- `DollarSign` - Money
- `CreditCard` - Payment
- `Receipt` - Invoice


## Accessibility Guidelines

### Always Provide Context

```javascript
// ❌ Bad - No context for screen readers
<button>
  <X size={16} />
</button>

// ✅ Good - Aria label provides context
<button aria-label="Close dialog">
  <X size={16} />
</button>

// ✅ Good - Visible text provides context
<button className="flex items-center gap-2">
  <X size={16} />
  Close
</button>
```

### Decorative vs Functional Icons

```javascript
// Decorative icon (no aria-label needed)
<div className="flex items-center gap-2">
  <Star size={16} className="text-yellow-500" aria-hidden="true" />
  <span>Featured Product</span>
</div>

// Functional icon (needs aria-label)
<button aria-label="Mark as favorite">
  <Star size={16} />
</button>
```

### Color Contrast

Ensure icons meet WCAG AA contrast requirements:
- Text icons: 4.5:1 minimum
- UI component icons: 3:1 minimum

```javascript
// ✅ Good contrast
<CheckCircle size={20} className="text-green-600" /> // on white background

// ❌ Poor contrast
<CheckCircle size={20} className="text-gray-300" /> // on white background
```

## Best Practices

### DO ✅

1. **Use consistent sizing**
   ```javascript
   // All navigation icons use size={16}
   <Calendar size={16} />
   <Users size={16} />
   ```

2. **Align icons with text**
   ```javascript
   <div className="flex items-center gap-2">
     <Check size={16} />
     <span>Completed</span>
   </div>
   ```

3. **Use semantic colors**
   ```javascript
   <AlertTriangle size={16} className="text-amber-600" />
   <CheckCircle size={16} className="text-green-600" />
   ```

4. **Provide hover states**
   ```javascript
   <button className="hover:bg-gray-100">
     <Edit2 size={16} className="text-gray-600 hover:text-emerald-600" />
   </button>
   ```

### DON'T ❌

1. **Don't use inconsistent sizes**
   ```javascript
   // ❌ Bad
   <Calendar size={18} />
   <Users size={22} />
   ```

2. **Don't use emojis instead of icons**
   ```javascript
   // ❌ Bad
   <span>✅ Success</span>
   
   // ✅ Good
   <span className="flex items-center gap-1">
     <CheckCircle size={16} />
     Success
   </span>
   ```

3. **Don't forget accessibility**
   ```javascript
   // ❌ Bad
   <button><X size={16} /></button>
   
   // ✅ Good
   <button aria-label="Close"><X size={16} /></button>
   ```

4. **Don't use too many icon sizes**
   ```javascript
   // ❌ Bad - too many sizes
   <Calendar size={17} />
   <Calendar size={19} />
   <Calendar size={23} />
   
   // ✅ Good - standard sizes
   <Calendar size={16} />
   <Calendar size={20} />
   <Calendar size={24} />
   ```

## Performance Tips

### Tree Shaking

Lucide React supports tree shaking. Only import icons you use:

```javascript
// ✅ Good - only imports what you need
import { Calendar, User } from 'lucide-react';

// ❌ Bad - imports everything
import * as Icons from 'lucide-react';
```

### Icon Reuse

For frequently used icons, create reusable components:

```javascript
// components/StatusIcon.jsx
export const StatusIcon = ({ status, size = 16 }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };
  
  const Icon = icons[status];
  return <Icon size={size} />;
};
```

## Migration from Custom Icons

If migrating from the old custom Icons component:

```javascript
// Before
import { DashboardIcon } from '../components/Icons';
<DashboardIcon className="w-5 h-5" />

// After
import { LayoutDashboard } from 'lucide-react';
<LayoutDashboard size={20} />
```

See `ICON_MIGRATION_MAP.md` for complete migration guide.

## Resources

- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Icon Search](https://lucide.dev/icons/)
- [Design System Tokens](./tokens.js)
- [Migration Map](../../.kiro/specs/admin-panel-design-system-redesign/ICON_MIGRATION_MAP.md)

---

**Last Updated:** $(date)
**Version:** 1.0
