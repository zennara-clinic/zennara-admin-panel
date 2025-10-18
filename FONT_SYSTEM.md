# Zennara Admin Panel - Font System Standards

## Font Family
- **Primary Font**: Inter (`font-inter`)
- **Fallback**: sans-serif
- All text elements use the Inter font family

## Typography Hierarchy

### Page Titles (H1)
- **Class**: `text-4xl font-bold text-gray-900`
- **Usage**: Main page heading
- **Example**: "Dashboard", "All Patients", "Appointments Management"

### Page Subtitles
- **Class**: `text-base text-gray-500`
- **Usage**: Description below main page title
- **Example**: "Welcome back, Dr. Admin. Here's your clinic overview."

### Section Headers (H2)
- **Class**: `text-2xl font-bold text-gray-900`
- **Usage**: Section headings within pages
- **Example**: "Today's Metrics", "Staff Availability Status"

### Card Metric Titles
- **Class**: `text-sm text-gray-400 font-medium` OR `text-sm text-gray-500 font-medium`
- **Usage**: Small labels above metric values in stat cards
- **Example**: "Total Appointments", "Revenue"

### Card Metric Values (Numbers)
- **Class**: `text-4xl font-bold text-gray-900`
- **Usage**: Main numeric values in stat cards
- **Example**: "45", "₹2,45,000"

### Card Change Stats
- **Class**: `text-sm font-bold text-zennara-green` (or appropriate color)
- **Usage**: Percentage changes and growth indicators
- **Example**: "+12%", "+18%"

### Form Labels
- **Class**: `text-xs font-bold text-gray-700`
- **Usage**: Input field labels, filter labels
- **Example**: "MEMBER TYPE", "DATE RANGE"

### Input Fields / Dropdowns
- **Class**: `font-semibold text-gray-700`
- **Usage**: Text inside input fields and select dropdowns

### Names (Primary Text)
- **Class**: `font-bold text-gray-900` with `text-sm` to `text-xl` based on prominence
- **Usage**: Patient names, doctor names, primary identifiers
- **Example**: Staff names, appointment patient names

### Secondary Names/Identifiers
- **Class**: `font-semibold text-gray-900` with `text-sm` to `text-base`
- **Usage**: Secondary identifiers, email addresses, phone numbers

### Status Badges
- **Class**: `text-xs font-bold` with appropriate color classes
- **Usage**: Status indicators, member badges
- **Example**: "Premium Member", "Confirmed", "Pending"

### Body Text
- **Class**: `text-sm text-gray-600`
- **Usage**: General body text, descriptions
- **Example**: Activity feed items, details

### Secondary Info
- **Class**: `text-xs text-gray-500` with `font-medium`
- **Usage**: Small supporting information
- **Example**: "Phone", "Email", "Last Visit"

### Button Text (Primary)
- **Class**: `font-bold` OR `font-semibold` with appropriate size
- **Usage**: Primary action buttons
- **Example**: "Add New Patient", "Export Data"

### Button Text (Secondary)
- **Class**: `font-semibold` with `text-sm`
- **Usage**: Secondary buttons, filters
- **Example**: "Reset All", "View Full Calendar"

### Numbers in Lists/Tables
- **Class**: `text-2xl font-bold text-gray-900` (or appropriate color)
- **Usage**: Numeric values in patient lists, stats
- **Example**: Total visits, amounts spent

### Large Display Numbers
- **Class**: `text-3xl` to `text-4xl font-bold` with color
- **Usage**: Hero numbers, prominent statistics
- **Example**: Patient count in detail cards

## Color System for Text

### Primary Text Colors
- **Headings**: `text-gray-900` (darkest)
- **Body**: `text-gray-600`
- **Secondary**: `text-gray-500`
- **Labels**: `text-gray-400` OR `text-gray-500`
- **Form Labels**: `text-gray-700`

### Accent Colors
- **Zennara Green**: `text-zennara-green` (#156450)
- **Success/Positive**: `text-green-600`
- **Warning**: `text-yellow-600`
- **Error/Alert**: `text-red-600`
- **Info**: `text-blue-600`
- **Purple Accent**: `text-purple-600`
- **Emerald**: `text-emerald-600`

## Font Weight Guide

- **font-bold**: Page titles, section headers, primary names, buttons, metric values
- **font-semibold**: Input fields, secondary identifiers, some buttons
- **font-medium**: Card labels, secondary info, smaller labels

## Size Reference

- **text-xs**: 0.75rem (12px) - Status badges, tiny labels
- **text-sm**: 0.875rem (14px) - Body text, card labels, buttons
- **text-base**: 1rem (16px) - Page subtitles, regular body text
- **text-lg**: 1.125rem (18px) - Larger body text
- **text-xl**: 1.25rem (20px) - Prominent names, larger headers
- **text-2xl**: 1.5rem (24px) - Section headers, medium stats
- **text-3xl**: 1.875rem (30px) - Large display numbers
- **text-4xl**: 2.25rem (36px) - Page titles, main metric values
- **text-5xl**: 3rem (48px) - Hero titles (rare)

## Common Patterns

### Stat Card Pattern
```jsx
<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
  <p className="text-sm text-gray-400 font-medium mb-2">Label</p>
  <p className="text-4xl font-bold text-gray-900">Value</p>
  <p className="text-sm font-bold text-green-600">+12%</p>
</div>
```

### Patient/Doctor Name Pattern
```jsx
<h3 className="text-xl font-bold text-gray-900">{name}</h3>
<p className="text-sm text-gray-500">{secondaryInfo}</p>
```

### Form Field Pattern
```jsx
<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">LABEL</label>
<input className="font-semibold text-gray-700..." />
```

### Section Header Pattern
```jsx
<h2 className="text-2xl font-bold text-gray-900 mb-6">Section Title</h2>
```

## Important Rules

1. **Always use Inter font family** - The entire application uses Inter
2. **Consistent heading hierarchy** - H1 (text-4xl), H2 (text-2xl)
3. **Gray-900 for headings** - Main text should be gray-900
4. **Gray-500/600 for body** - Supporting text uses lighter grays
5. **Bold for prominence** - Use font-bold for important elements
6. **Semibold for inputs** - Form inputs use font-semibold
7. **Uppercase labels** - Form labels are uppercase with text-xs font-bold

## Do's and Don'ts

### DO:
✓ Use text-4xl font-bold text-gray-900 for page titles
✓ Use text-2xl font-bold text-gray-900 for section headers
✓ Use text-sm text-gray-400 font-medium for card labels
✓ Use font-bold for names and important identifiers
✓ Use consistent spacing (mb-2, mb-6, mb-10)

### DON'T:
✗ Mix font sizes arbitrarily
✗ Use text-5xl or text-6xl (except for special hero sections)
✗ Use font weights other than bold, semibold, medium
✗ Use colors outside the defined palette
✗ Forget to add mb (margin-bottom) spacing after headings
