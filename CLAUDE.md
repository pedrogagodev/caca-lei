# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project using the App Router architecture, bootstrapped with `create-next-app`. It uses React 19, TypeScript, Tailwind CSS v4, and Biome for linting/formatting. The React Compiler is enabled for automatic optimization.

## Key Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build production bundle
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run Biome linter checks
npm run format       # Format code with Biome
```

Note: There are no test scripts configured in this project yet.

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration and global styles
  - `page.tsx` - Homepage component
  - `globals.css` - Global CSS with Tailwind imports and custom CSS variables
- `public/` - Static assets (images, SVGs)

### Path Aliases
TypeScript is configured with `@/*` aliasing to `./src/*` for clean imports.

### Styling
- **Tailwind CSS v4**: Uses the new `@import "tailwindcss"` syntax and `@theme inline` blocks for custom theming
- **CSS Variables**: Theme colors (`--background`, `--foreground`) and font variables (`--font-geist-sans`, `--font-geist-mono`) are defined in `globals.css`
- **Dark Mode**: Configured via `prefers-color-scheme` media query
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`

### Components
- **MUST**: Always prefer [shadcn/ui](https://ui.shadcn.com/) components as the default choice for UI elements
- Before building custom components, check if shadcn/ui has a suitable component
- shadcn/ui components are installed into the project (not as npm packages), allowing full customization

### TypeScript Configuration
- Target: ES2017
- Module: ESNext with bundler resolution
- Strict mode enabled
- JSX: react-jsx (uses automatic runtime)

### Tooling
- **Biome**: Replaces ESLint and Prettier
  - Recommended rules enabled for Next.js and React
  - Auto-organizes imports on save
  - 2-space indentation
  - Ignores `node_modules`, `.next`, `dist`, `build`
- **React Compiler**: Enabled in `next.config.ts` for automatic memoization

## Important Notes

- Edit `src/app/page.tsx` to modify the homepage - Next.js auto-reloads on save
- This project uses Tailwind CSS v4, which has a different syntax than v3 (e.g., `@theme inline` blocks instead of traditional config)
- Biome is used instead of ESLint/Prettier - use `npm run lint` and `npm run format`
- Path imports use `@/` prefix for `src/` directory

## Code Organization

### Component Organization Strategy

**Feature-First Colocation**: Keep related code together. Use the App Router's colocation capabilities to organize by feature, not by file type.

#### When to Use `_components` (Page-Specific Components)

Place components in route-specific `_components/` folders when they are:
- **MUST**: Unique to a single route/page
- **MUST**: Not reused elsewhere in the application
- **MUST**: Part of that route's implementation detail

Example:
```
app/
  leis/
    _components/
      status-tile.tsx
      topic-chip.tsx
    page.tsx
```

The underscore prefix marks the folder as **private**, excluding it from the routing system while keeping related code colocated.

#### When to Use `src/components` (Shared Components)

Place components in global `src/components/` when they are:
- **MUST**: Shared across multiple routes
- **MUST**: Part of your design system
- **MUST**: Generic and reusable

Recommended organization:
```
src/
  components/
    ui/              # shadcn/ui components (button, dialog, etc.)
    layout/          # Layout components (navbar, footer, sidebar)
    features/        # Feature-specific but reusable components
```

### File and Component Naming Conventions

- **Component Files**: MUST use `kebab-case` (e.g., `user-profile.tsx`, `law-card.tsx`)
- **Component Names** (inside files): MUST use `PascalCase` (e.g., `UserProfile`, `LawCard`)
- **Utility Files**: MUST use `kebab-case` (e.g., `api-helpers.ts`, `date-formatters.ts`)
- **Hook Files**: MUST use `camelCase` with "use" prefix (e.g., `useAuth.ts`) or `kebab-case` (e.g., `use-auth.ts`)
- **Type Files**: MUST use `kebab-case` with `.types.ts` suffix (e.g., `user.types.ts`, `law.types.ts`)
- **Test Files**: MUST use same name as file being tested + `.test.tsx` or `.spec.tsx`

### Type Organization

#### Global Types
Place in `src/types/` when used across multiple features:
```
types/
  user.types.ts          # User-related types
  api.types.ts           # API response/request types
  law.types.ts           # Law entity types
  common.types.ts        # Shared utility types
```

#### Route-Specific Types
Colocate with routes using `_types/` folder:
```
app/
  leis/
    _types/
      filters.types.ts
    _components/
    page.tsx
```

#### Type Naming Conventions
```typescript
// Interfaces: PascalCase
interface UserProfile { }

// Types: PascalCase
type AuthState = { }

// Component Props: ComponentName + "Props"
interface LawCardProps { }
type ButtonProps = { }

// Enums: PascalCase
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5000000
const API_BASE_URL = 'https://api.example.com'
```

### Private Folders (Underscore Prefix)

Use private folders to organize internal implementation details:
- `_components/` - Route-specific components
- `_hooks/` - Route-specific custom hooks
- `_utils/` - Route-specific utilities
- `_types/` - Route-specific type definitions
- `_lib/` - Route-specific libraries

These folders are excluded from routing but keep code organized and colocated.

### Route Groups (Parentheses)

Use route groups `(name)` to organize routes without affecting URL structure:
```
app/
  (marketing)/
    about/page.tsx        → /about
    pricing/page.tsx      → /pricing
  (dashboard)/
    settings/page.tsx     → /settings
    analytics/page.tsx    → /analytics
```

### Constants Organization

- **App-wide constants**: Place in `src/constants/`
  ```
  constants/
    routes.ts           # Route paths
    api-endpoints.ts    # API URLs
    app.ts             # App-wide constants
  ```
- **Feature-specific constants**: Colocate with feature in route folder

### Import Patterns

**MUST** use path aliases for cleaner imports:
```typescript
// Good: Use path aliases
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import type { User } from "@/types/user.types"

// Bad: Avoid relative paths for distant files
import { Button } from "../../../components/ui/button"
```

### Decision Framework

Ask these questions when organizing code:

1. **Is this code used in multiple routes?**
   - **YES** → Place in `src/components`, `src/lib`, or `src/hooks`
   - **NO** → Colocate with the route in a `_folder`

2. **Is this a shadcn/ui component?**
   - **YES** → Place in `src/components/ui/`

3. **Is this a layout component (navbar, footer, sidebar)?**
   - **YES** → Place in `src/components/layout/`

4. **Is this a type/interface?**
   - **Used globally** → `src/types/`
   - **Route-specific** → Colocate in route's `_types/` folder

5. **Is this a constant?**
   - **App-wide** → `src/constants/`
   - **Feature-specific** → Colocate with feature

6. **Should this folder affect routing?**
   - **NO** → Use underscore prefix `_folder`
   - **Organize without URL impact** → Use route groups `(folder)`

This structure provides scalability, maintainability, and clear separation of concerns.

## UI/UX Guidelines

Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

### Interactions

- **Keyboard**
  - MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- **Targets & input**
  - MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- **Inputs & forms (behavior)**
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don't block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- **State & navigation**
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- **Feedback**
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, "Rename…") and loading states (eg, "Loading…", "Saving…", "Generating…")
- **Touch/drag/scroll**
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No "dead-looking" interactive zones—if it looks clickable, it is
- **Autofocus**
  - SHOULD: Autofocus on desktop when there's a single primary input; rarely on mobile (to avoid layout shift)

### Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it "physically" should)

### Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-*))
- MUST: Avoid unwanted scrollbars; fix overflows

### Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (" "); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don't ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not `...`)
- MUST: `scroll-margin-top` on headings for anchored links; include a "Skip to content" link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

### Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

### Design

- **MUST**: Avoid shadows in UI design; use only for floating elements (modals, sheets, dropdowns)
  - **Exception**: Shadows permitted ONLY on overlays that float above content (Dialog, Sheet, Dropdown Menu)
  - **Prefer**: Subtle borders (`border-foreground/10`), background contrast, and transforms for visual hierarchy
  - **Rationale**: Minimalist design with crisp, clean separation creates modern, premium feel
- SHOULD: Crisp edges via semi-transparent borders (avoid relying on shadows)
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)

## Micro-Interactions & Attention to Detail

This application **MUST** prioritize micro-interactions and thoughtful details in every user touchpoint. The goal is to create a **luxurious, refined experience** where every interaction feels intentional, smooth, and delightful.

### Philosophy

- **Every interaction matters**: Treat each hover, click, focus, and transition as an opportunity to delight the user
- **Finesse over flash**: Subtle, refined animations trump bold, distracting ones
- **Anticipate user intent**: Design should guide and respond to what the user wants to do next
- **Feel expensive**: Attention to detail creates a premium, trustworthy experience

### Micro-Interaction Checklist

Before shipping any component, verify these states and interactions exist:

#### **Interactive States**
- **MUST**: Define all 6 states for interactive elements:
  1. **Default** - Resting state
  2. **Hover** - Mouse over (desktop)
  3. **Focus** - Keyboard focus (visible ring, accessible)
  4. **Active** - Click/press down
  5. **Loading** - Processing state (spinner, skeleton, disabled)
  6. **Disabled** - Non-interactive state (reduced opacity, cursor change)
- **MUST**: Each state has a **smooth transition** (typically 150-300ms)
- **MUST**: Hover states include subtle visual feedback:
  - Color shift (text, background, or border)
  - Transform (scale, translate)
  - Shadow enhancement
  - Icon animation (scale, rotate, color)

#### **Transitions & Animations**
- **MUST**: Use `transition-all` or specific transition properties
- **SHOULD**: Duration hierarchy:
  - **Instant** (0ms): Layout changes that must be immediate
  - **Quick** (150ms): Small elements, color changes, icon transforms
  - **Standard** (200-250ms): Most interactive elements (buttons, links, cards)
  - **Deliberate** (300-400ms): Larger elements, modals, sheets, complex animations
- **MUST**: Easing functions match intent:
  - `ease-out`: Elements entering or expanding
  - `ease-in`: Elements exiting or shrinking
  - `ease-in-out`: Elements changing state smoothly
- **SHOULD**: Stagger animations for lists (e.g., `${index * 50}ms` delay)
- **MUST**: Honor `prefers-reduced-motion` for accessibility

#### **Feedback & Affordances**
- **MUST**: Provide **immediate visual feedback** for every action:
  - Button clicks: color change, scale down, ripple
  - Input focus: border color, ring, label animation
  - Form submission: loading state, optimistic UI
  - Errors: shake animation, color change, icon
  - Success: checkmark, color shift, subtle celebration
- **MUST**: Clear affordances (users should know what's clickable):
  - Cursor changes (`cursor-pointer`, `cursor-not-allowed`)
  - Hover effects reveal interactivity
  - Disabled states are obvious (reduced opacity, no pointer events)
- **SHOULD**: Loading states are informative:
  - Buttons: keep label visible, add spinner
  - Skeletons: mirror final content layout
  - Progress indicators for long operations

#### **Polish & Finesse**
- **MUST**: Icons have micro-interactions:
  - Scale on hover (`hover:scale-110`, `hover:scale-105`)
  - Color transitions (`text-muted-foreground hover:text-primary`)
  - Rotation for directional icons (arrows, chevrons)
- **MUST**: Cards and containers:
  - Subtle hover lift (`hover:scale-[1.02]`, `hover:scale-[1.01]`)
  - Border color/opacity transitions (`hover:border-primary/20`)
  - Smooth background color shifts (`hover:bg-muted/50`)
- **MUST**: Navigation:
  - Active route indicators (underline, background, color)
  - Smooth underline/indicator animations (`transition-all duration-300`)
  - Focus rings that feel designed, not default
- **SHOULD**: Scroll-dependent effects:
  - Navbar gains background/blur on scroll (`bg-background/95 backdrop-blur-md`)
  - Sticky elements have subtle entrance animations
  - Scroll-triggered reveals for content
- **SHOULD**: Empty states and placeholders:
  - Helpful messaging with clear next actions
  - Illustrative icons or graphics
  - Smooth transitions when content loads

#### **Touch & Mobile**
- **MUST**: Touch targets ≥44px on mobile
- **MUST**: Active states on touch (`:active` pseudo-class)
- **MUST**: Prevent double-tap zoom (`touch-action: manipulation`)
- **SHOULD**: Swipe gestures for sheets/modals on mobile
- **SHOULD**: Haptic-like visual feedback (scale down on touch)

#### **Keyboard & Accessibility**
- **MUST**: Visible, styled focus rings (not default blue outline)
- **MUST**: Focus management in modals/sheets (trap focus, return on close)
- **MUST**: Keyboard shortcuts are discoverable (e.g., `⌘K` badge on search)
- **MUST**: Skip links for screen readers
- **SHOULD**: Logical tab order follows visual hierarchy

### Luxury & Refinement Principles

- **Elevation without shadows**: Use scale transforms, border transitions, and background contrast instead
- **Smooth scale transitions**: `hover:scale-[1.02]` for cards, `hover:scale-105` for avatars/icons
- **Color harmony**: Transitions between related hues (e.g., muted → primary)
- **Intentional spacing**: Every gap and padding value is deliberate
- **Typography rhythm**: Consistent line-height, font-weight, and size hierarchy
- **Backdrop blur**: Semi-transparent backgrounds with `backdrop-blur-md` for modals/headers/navbar
- **Border subtlety**: Use semi-transparent borders (`border-foreground/10`) for layered depth and separation

### Examples from This Codebase

#### **Navbar (src/components/layout/navbar.tsx)**
- Logo: `hover:scale-[1.02]` for subtle lift effect
- Nav links: animated underline grows from center
- Search button: icon scales, kbd hint transitions
- Avatar: scales up on hover, dropdown menu
- Mobile: hamburger → X animation, staggered link reveals
- Scroll: navbar gains background blur/opacity on scroll (`bg-background/95 backdrop-blur-md`)

#### **Command Palette (src/components/layout/search-command-palette.tsx)**
- Keyboard shortcut: global `⌘K` listener
- Results: icons transition color on hover, icons reveal on group hover
- Footer: keyboard shortcuts guide with styled `<kbd>` elements
- Empty state: helpful message, not just "no results"

### Before Shipping Checklist

- [ ] All interactive elements have hover, focus, active, loading, and disabled states defined
- [ ] Transitions are smooth (150-300ms) and use appropriate easing
- [ ] Icons have micro-interactions (scale, color, rotation)
- [ ] Loading states are informative (spinners, skeletons, optimistic UI)
- [ ] Keyboard navigation works perfectly (focus rings, shortcuts, tab order)
- [ ] Touch targets are ≥44px on mobile
- [ ] Empty states and errors have helpful messaging
- [ ] Animations honor `prefers-reduced-motion`
- [ ] Every interaction feels intentional and delightful

**Remember**: Users notice details. A smooth hover transition, a thoughtful loading state, or a perfectly-timed animation builds trust and makes the app feel professional, polished, and premium.
