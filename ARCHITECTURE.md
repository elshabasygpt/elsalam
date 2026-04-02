# 🏛️ Elsalam Next.js 14 Component Architecture

This document governs the best practices for scalable, enterprise-level component construction based on the Atomic Design philosophy for **Elsalam Vegetable Oils**.

## 1. Directory Structure

```text
src/
├── components/
│   ├── atoms/       # Base UI primitives (Buttons, Typography, Badge, Inputs)
│   ├── molecules/   # Simple groupings of atoms (Cards, FormFields, Dropdowns)
│   ├── organisms/   # Complex structures (Navbars, Heroes, Layouts, Footers)
│   └── templates/   # Page-level wireframes without data injection
├── styles/          
│   ├── globals.css  # Tailwind entry + layer components
│   └── tokens.ts    # JS/TS accessible design tokens mapping to Tailwind
├── utils/           
│   ├── classnames.ts # cn() utility merging clsx and tailwind-merge
│   └── rtl-helper.ts # Helpers for dealing with bidi interfaces
└── app/             # Next.js App Router root
```

## 2. Best Practices for Tailwind & CVA Setup

### Class Variance Authority (CVA)
Avoid writing long inline styles or ternary strings for complex component states (like Button `variant` or `size`).  
Use `cva` mapped directly to design tokens. Look at `Button.tsx` as the standard implementation of CVA.

### `cn()` Utility usage
Always export components allowing a `className` override string. Wrap internal tailwind styles using the `cn` utility to ensure conflict resolution if consumers pass overrides:
```tsx
<div className={cn("base-classes text-red-500", className)} />
```

## 3. Handling RTL (Right-to-Left)

Do NOT hardcode `margin-left` (`ml`) or `padding-right` (`pr`).
Always use Tailwind's logical properties:
- `start`: `ms-4` (Margin Start), `ps-4` (Padding Start)
- `end`: `me-4` (Margin End), `pe-4` (Padding End)
- Directional Borders: `border-s-2` instead of `border-l-2`.
- Transforms: Use `rtl:-translate-x-1` and `ltr:translate-x-1`.

This ensures layouts adapt 100% natively without duplicating CSS when rendering `dir="ltr"` vs `dir="rtl"`.

## 4. Accessibility (A11y)

- **Forms:** Always link `<label htmlFor="id">` and use `aria-describedby` for error states (See `FormField.tsx`).
- **Semantic HTML:** Avoid wrapping everything in `<div>`. Use `<article>` for ProductCards, `<header>` for Hero/Navbar, `<section>` for logical blocks, and appropriate `<h1-h6>` heading tiers.
- **Buttons:** Add `aria-label` to icon buttons or links without readable text.

## 5. Design Token Compliance

Do not use arbitrary colors like `bg-[#0f0]`. Your `tailwind.config.ts` has been constrained strictly to the Elsalam design tokens:
- **Colors:** `primary-green`, `primary-dark`, `accent-green`, `accent-gold`, `surface-soft`, `surface-light`, `surface-white`, `text-dark`.
- **Spacing:** Mapped directly to the 8px baseline (`4, 8, 16, 24, 32, 48, 64, 96`).
- **Typography Sizes:** `text-h1` to `text-small`.
- **Border Radii:** `rounded-sm`, `rounded-md`, `rounded-lg`, `radius-section`.

When creating a new component, strictly adhere to these Tailwind utility names to prevent design fragmentation over time.
