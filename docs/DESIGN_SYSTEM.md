# Design System Documentation

**Last Updated**: 2024-01-15  
**Version**: 1.0

---

## Overview

This document describes the design system for the Sprint Dashboard application. The design system provides a consistent visual language and reusable components that match the PRD requirements.

---

## Color Palette

### Primary Colors

The primary color palette is based on green (#22c55e) as specified in the PRD.

| Color       | Hex       | Usage                             |
| ----------- | --------- | --------------------------------- |
| Primary     | `#22c55e` | Main accent color, buttons, links |
| Primary 600 | `#16a34a` | Hover states                      |
| Primary 700 | `#15803d` | Active states                     |

**Tailwind Usage:**

```tsx
<div className="bg-primary text-white">Primary background</div>
<button className="bg-primary-600 hover:bg-primary-700">Button</button>
```

### Status Colors

Status colors are used throughout the dashboard to indicate work item states.

| Status     | Color  | Hex       | Symbol | Usage               |
| ---------- | ------ | --------- | ------ | ------------------- | ----------------- |
| Team Focus | Green  | `#22c55e` | `*`    | Team focus items    |
| Done       | Green  | `#22c55e` | `✓`    | Completed items     |
| Ongoing    | Orange | `#f97316` | `      | `                   | In-progress items |
| Not Done   | Red    | `#ef4444` | `✗`    | Not completed items |

**Tailwind Usage:**

```tsx
<span className="text-status-done">Done</span>
<span className="text-status-ongoing">Ongoing</span>
<span className="text-status-notDone">Not Done</span>
```

### Neutral Colors

Gray scale for UI elements, text, and backgrounds.

| Color    | Hex       | Usage                 |
| -------- | --------- | --------------------- |
| Gray 50  | `#f9fafb` | Secondary backgrounds |
| Gray 100 | `#f3f4f6` | Light backgrounds     |
| Gray 200 | `#e5e7eb` | Borders, dividers     |
| Gray 500 | `#6b7280` | Secondary text        |
| Gray 700 | `#374151` | Body text             |
| Gray 900 | `#111827` | Headings              |

---

## Typography

### Font Family

The application uses the system font stack for optimal performance:

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
```

### Type Scale

| Variant    | Size            | Line Height | Usage             |
| ---------- | --------------- | ----------- | ----------------- |
| H1         | 2.25rem (36px)  | 2.5rem      | Page titles       |
| H2         | 1.875rem (30px) | 2.25rem     | Section titles    |
| H3         | 1.5rem (24px)   | 2rem        | Subsection titles |
| H4         | 1.25rem (20px)  | 1.75rem     | Card titles       |
| H5         | 1.125rem (18px) | 1.75rem     | Small headings    |
| H6         | 1rem (16px)     | 1.5rem      | Smallest headings |
| Body       | 1rem (16px)     | 1.5rem      | Body text         |
| Body Small | 0.875rem (14px) | 1.25rem     | Secondary text    |
| Caption    | 0.75rem (12px)  | 1rem        | Labels, captions  |

### Typography Component

Use the `Typography` component for consistent typography:

```tsx
import { Typography } from '@/components/common/Typography';

<Typography variant="h1">Page Title</Typography>
<Typography variant="body">Body text content</Typography>
<Typography variant="caption">Caption text</Typography>
```

### Tailwind Classes

You can also use Tailwind classes directly:

```tsx
<h1 className="text-4xl font-bold text-gray-900">Heading</h1>
<p className="text-base text-gray-700">Body text</p>
<span className="text-sm text-gray-500">Caption</span>
```

---

## Spacing

The design system uses Tailwind's default spacing scale (0.25rem increments):

| Size | Value         | Usage               |
| ---- | ------------- | ------------------- |
| 0    | 0             | No spacing          |
| 1    | 0.25rem (4px) | Tight spacing       |
| 2    | 0.5rem (8px)  | Small spacing       |
| 4    | 1rem (16px)   | Default spacing     |
| 6    | 1.5rem (24px) | Medium spacing      |
| 8    | 2rem (32px)   | Large spacing       |
| 12   | 3rem (48px)   | Extra large spacing |

**Usage:**

```tsx
<div className="p-4">Padding 4</div>
<div className="mt-8">Margin top 8</div>
<div className="space-y-4">Vertical spacing 4</div>
```

---

## Border Radius

| Size    | Value          | Usage                     |
| ------- | -------------- | ------------------------- |
| sm      | 0.125rem (2px) | Small elements            |
| DEFAULT | 0.25rem (4px)  | Default (buttons, inputs) |
| md      | 0.375rem (6px) | Medium elements           |
| lg      | 0.5rem (8px)   | Large elements            |
| xl      | 0.75rem (12px) | Cards, containers         |
| 2xl     | 1rem (16px)    | Large containers          |
| full    | 9999px         | Pills, badges             |

**Usage:**

```tsx
<button className="rounded-md">Button</button>
<div className="rounded-lg">Card</div>
```

---

## Components

### Button

A reusable button component with variants, sizes, and loading states.

**Props:**

- `variant`: `'primary' | 'secondary' | 'outline'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `loading`: `boolean` (default: `false`)
- `disabled`: `boolean`
- Standard HTML button attributes

**Example:**

```tsx
import { Button } from '@/components/common/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="outline" loading={isLoading}>
  Submit
</Button>
```

### Input

A form input component with label, error states, and validation feedback.

**Props:**

- `label`: `string` - Input label
- `error`: `string` - Error message
- `helperText`: `string` - Helper text
- `required`: `boolean` - Show required indicator
- Standard HTML input attributes

**Example:**

```tsx
import { Input } from '@/components/common/Input';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  required
/>;
```

### Table

A flexible table component with configurable columns and responsive design.

**Props:**

- `data`: `T[]` - Array of data objects
- `columns`: `ColumnDef<T>[]` - Column definitions
- `striped`: `boolean` - Alternating row colors (default: `true`)
- `hover`: `boolean` - Hover effect on rows (default: `true`)

**Example:**

```tsx
import { Table, ColumnDef } from '@/components/common/Table';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Actions',
    accessor: (row) => <Button>Edit</Button>,
    align: 'right',
  },
];

<Table data={users} columns={columns} />;
```

### StatusIndicator

Displays status indicators matching PRD requirements.

**Props:**

- `status`: `'team-focus' | 'done' | 'ongoing' | 'not-done'`
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)

**Example:**

```tsx
import { StatusIndicator, StatusIndicatorLegend } from '@/components/common/StatusIndicator';

<StatusIndicator status="done" />
<StatusIndicator status="ongoing" size="lg" />

{/* Display legend at bottom of dashboard */}
<StatusIndicatorLegend />
```

**Status Symbols:**

- `*` (Green) - Team Focus
- `✓` (Green) - Done
- `|` (Orange) - Ongoing
- `✗` (Red) - Not Done

### Typography

Provides consistent typography styles.

**Props:**

- `variant`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption' | 'label'`
- `as`: HTML element to render (optional)
- `children`: ReactNode

**Example:**

```tsx
import { Typography } from '@/components/common/Typography';

<Typography variant="h1">Page Title</Typography>
<Typography variant="body">Body text</Typography>
```

---

## Accessibility

All components follow accessibility best practices:

- **ARIA Labels**: Components include proper ARIA attributes
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus States**: Clear focus indicators for keyboard users
- **Color Contrast**: All text meets WCAG AA contrast requirements
- **Screen Readers**: Semantic HTML and ARIA labels for screen readers

**Example:**

```tsx
<Button aria-label="Submit form">Submit</Button>
<Input aria-label="Email address" aria-invalid={hasError} />
<StatusIndicator status="done" aria-label="Done" />
```

---

## Usage Guidelines

### When to Use Components

- **Button**: Use for all clickable actions (submit, cancel, navigation)
- **Input**: Use for all form inputs (text, email, number, etc.)
- **Table**: Use for displaying tabular data
- **StatusIndicator**: Use for displaying work item status
- **Typography**: Use for consistent text styling (or use Tailwind classes)

### When to Use Tailwind Classes

- For one-off styling that doesn't need a component
- For layout and spacing
- For responsive design utilities
- For custom styling that doesn't fit component patterns

### Component Composition

Components can be composed together:

```tsx
<div className="p-6 bg-white rounded-lg shadow-md">
  <Typography variant="h2" className="mb-4">
    Dashboard
  </Typography>
  <Table data={items} columns={columns} />
  <div className="mt-4 flex gap-2">
    <Button variant="primary">Save</Button>
    <Button variant="outline">Cancel</Button>
  </div>
</div>
```

---

## Design Tokens Reference

All design tokens are defined in `tailwind.config.ts`:

- **Colors**: `theme.extend.colors`
- **Typography**: `theme.extend.fontSize`, `theme.extend.fontFamily`
- **Spacing**: `theme.extend.spacing` (uses Tailwind defaults)
- **Border Radius**: `theme.extend.borderRadius`
- **Shadows**: `theme.extend.boxShadow`

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PRD.md](../PRD.md) - Product Requirements Document
- [SOLUTION_ARCHITECTURE.md](../SOLUTION_ARCHITECTURE.md) - Technical Architecture

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Maintained By**: Frontend Team
