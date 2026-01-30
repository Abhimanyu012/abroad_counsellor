---
description: UI Design System - Premium dark theme guidelines for consistent styling
---

# Abroad Counsellor Design System

## Color Palette

### Backgrounds
- **Primary background**: `#000` / `black`
- **Card background**: `rgba(255, 255, 255, 0.02)` - `rgba(255, 255, 255, 0.03)`
- **Card hover**: `rgba(255, 255, 255, 0.04)`
- **Icon containers**: `rgba(255, 255, 255, 0.06)`

### Text Colors (in order of emphasis)
| Level | Color | Usage |
|-------|-------|-------|
| Primary | `#fff` / `text-white` | Headlines, titles, important text |
| Secondary | `#b4b4b4` | Body text, descriptions, nav links |
| Tertiary | `#999` | Labels, captions, meta text |
| Muted | `#777` | Copyright, disabled text |

### Borders
- **Subtle**: `rgba(255, 255, 255, 0.04)` - barely visible
- **Default**: `rgba(255, 255, 255, 0.08)` - standard borders
- **Hover**: `rgba(255, 255, 255, 0.1)` - interactive states
- **Visible**: `rgba(255, 255, 255, 0.2)` - scroll indicators, emphasis

### Accent Colors
- **Violet glow**: `rgba(139, 92, 246, 0.03)` - cursor spotlight
- **Gradient orbs**: `violet-500/20`, `fuchsia-500/15`, `indigo-500/10`

---

## Typography

### Font
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
-webkit-font-smoothing: antialiased;
```

### Sizes
| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Hero heading | `clamp(2.5rem, 8vw, 5.5rem)` | 700 | `-0.02em` |
| Section heading | `clamp(2rem, 5vw, 3.5rem)` | 700 | `tight` |
| Card title | `18px` - `20px` | 600 | normal |
| Body text | `14px` - `17px` | 400 | normal |
| Labels | `12px` - `13px` | 500 | `0.15em` (uppercase) |
| Nav links | `14px` | 400 | normal |
| Buttons | `14px` - `15px` | 500 | normal |

---

## Components

### Buttons

#### Primary Button (btn-premium)
```css
.btn-premium {
  background: linear-gradient(180deg, #fafafa 0%, #e4e4e7 100%);
  color: #09090b;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 0.5rem; /* rounded-lg */
  padding: 0.75rem 1.75rem; /* py-3 px-7 */
}
```

#### Ghost Button (btn-ghost)
```css
.btn-ghost {
  background: transparent;
  color: #a1a1aa;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Cards

#### Spotlight Card
- Background: `rgba(255, 255, 255, 0.02)`
- Border: `1px solid rgba(255, 255, 255, 0.04)`
- Border radius: `1rem` (rounded-2xl)
- Padding: `2rem` (p-8)
- Hover: Mouse-tracking glow effect

#### Premium Card
```css
.card-premium {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
.card-premium:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
}
```

---

## Spacing

### Section Padding
- Vertical: `py-36` (9rem)
- Container max-width: `1200px`
- Horizontal padding: `px-6` (1.5rem)

### Component Gaps
- Grid gap: `gap-5` (1.25rem)
- Section header margin-bottom: `mb-20` (5rem)
- Card internal padding: `p-8` (2rem)

---

## Effects

### Glass Navigation
```css
.glass-nav {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
```

### Spotlight Effect (mouse tracking)
```javascript
const handleMouseMove = (e) => {
  const rect = ref.current.getBoundingClientRect()
  ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}
```

### Shimmer Text
```css
.shimmer-text {
  background: linear-gradient(110deg, #fafafa 0%, #fafafa 35%, #a1a1aa 50%, #fafafa 65%, #fafafa 100%);
  background-size: 250% auto;
  animation: shimmer 4s ease-in-out infinite;
}
```

### Gradient Orbs
- Use `blur(100px)` filter
- Animate with slow drift (25s duration)
- Opacity: 0.35 - 0.5

---

## Animation Guidelines

### Framer Motion Defaults
```javascript
// Smooth spring
const smooth = { type: 'spring', stiffness: 100, damping: 30 }

// Entry animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}

// Hover scale
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Stagger children
staggerChildren: 0.08
```

### Scroll Animations
- Use `whileInView` with `viewport={{ once: true }}`
- Delay stagger: `delay: i * 0.08`

---

## Quick Reference

### Do's ✅
- Use `#b4b4b4` for readable secondary text
- Use `rgba(255,255,255,0.08)` for visible borders
- Keep animations subtle (2-4px transforms)
- Use spring physics for interactions

### Don'ts ❌
- Don't use text colors darker than `#777`
- Don't use border opacity below `0.04`
- Don't use abrupt animations
- Don't mix warm and cool grays
