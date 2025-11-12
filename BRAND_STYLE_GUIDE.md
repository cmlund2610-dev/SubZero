# SubZero Brand Style Guide

**Precision in Data. Clarity in Design.**

This guide defines the visual identity, design principles, and usage guidelines for the SubZero brand across all digital touchpoints.

---

## 🎨 Color Palette

### Primary Colors

**Coral (Primary Action Color)**
- Hex: `#FF6D56`
- RGB: `255, 109, 86`
- Usage: Primary buttons, CTAs, active states, key highlights, links
- Hover state: `#E55F4C`

**Neutral Gray**
- Hex: `#828392`
- RGB: `130, 131, 146`
- Usage: Borders, secondary text, subtle UI elements, disabled states

### Background & Surface Colors

**Surface Light**
- Hex: `#FBFCFF`
- RGB: `251, 252, 255`
- Usage: Page backgrounds, card surfaces, elevated containers

**White**
- Hex: `#FFFFFF`
- Usage: Pure white for contrast, overlays, modals

### Text Colors

**Text Dark (Primary Text)**
- Hex: `#2E2F33`
- RGB: `46, 47, 51`
- Usage: Headings, body text, primary content

**Text Secondary**
- Hex: `#52535C`
- Usage: Secondary text, supporting content, captions

**Text Tertiary**
- Hex: `#828392`
- Usage: Placeholder text, subtle labels, metadata

**Text Light**
- Hex: `#FFFFFF`
- Usage: Text on dark backgrounds, inverted UI elements

### Status Colors

**Success Green**
- Primary: `#10B981`
- Background: `#ECFDF5`
- Usage: Success messages, positive metrics, healthy status

**Warning Orange**
- Primary: `#F59E0B`
- Background: `#FEF3C7`
- Usage: Warnings, attention needed, moderate risk

**Error Red**
- Primary: `#EF4444`
- Background: `#FEE2E2`
- Usage: Errors, critical alerts, high churn risk

**Info Blue**
- Primary: `#3B82F6`
- Background: `#EFF6FF`
- Usage: Informational messages, neutral notifications

---

## ✏️ Typography

### Font Family

**Inter** - Modern, clean, highly legible sans-serif optimized for UI.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, sans-serif;
```

### Font Weights

- **300 (Light)**: Large display text, hero sections
- **400 (Regular)**: Body text, paragraphs, default UI text
- **500 (Medium)**: Subheadings, emphasized text, labels
- **700 (Bold)**: Headings, key metrics, strong emphasis

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **h1** | 32px | 700 | 1.2 | Page titles, hero headings |
| **h2** | 24px | 700 | 1.3 | Section headings |
| **h3** | 20px | 600 | 1.4 | Subsection headings |
| **h4** | 18px | 600 | 1.5 | Card titles, widget headers |
| **body-lg** | 16px | 400 | 1.6 | Large body text |
| **body-md** | 14px | 400 | 1.6 | Default body text |
| **body-sm** | 13px | 400 | 1.5 | Small text, captions |
| **body-xs** | 12px | 500 | 1.4 | Labels, metadata, tiny text |

---

## 🖼 Logo Usage

### Logo Variants

SubZero has three logo formats optimized for different contexts:

#### 1. Primary Logo (Gray)
- **File**: `Primary Logo grey.svg`
- **Usage**: Light backgrounds, main navigation, documentation
- **Min width**: 120px
- **Color**: Neutral dark gray

#### 2. Logo (White)
- **File**: `Logo White.svg`
- **Usage**: Dark backgrounds, hero sections, footer
- **Min width**: 120px
- **Color**: Pure white (#FFFFFF)

#### 3. Submark (Orange)
- **File**: `Submark.logo.orange.svg`
- **Usage**: Favicons, small UI elements, app icons, loading states
- **Min size**: 24px × 24px
- **Color**: Coral (#FF6D56)

### Logo Guidelines

**Clear Space**: Maintain minimum padding equal to the height of the "S" letterform around all logos.

**Minimum Sizes**:
- Full logo: 120px width
- Submark: 24px × 24px

**Don'ts**:
- ❌ Don't stretch or distort logos
- ❌ Don't change logo colors (use provided variants)
- ❌ Don't add effects (shadows, gradients, outlines)
- ❌ Don't place logos on busy or low-contrast backgrounds

---

## 📐 Spacing System

SubZero uses an 8px base grid for consistent spacing and rhythm.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, icon padding |
| `sm` | 8px | Small gaps, compact layouts |
| `md` | 16px | Default spacing, standard gaps |
| `lg` | 24px | Section spacing, card padding |
| `xl` | 32px | Large section breaks, page padding |
| `2xl` | 48px | Hero spacing, major divisions |

### Padding Guidelines

- **Cards/Containers**: 16-24px (md-lg)
- **Page margins**: 24-32px (lg-xl)
- **Button padding**: 8px 16px (sm md)
- **Input fields**: 10-12px vertical, 12-16px horizontal

---

## 🔘 Component Patterns

### Border Radius

SubZero uses consistent rounded corners for a modern, approachable feel.

- **Small elements** (buttons, inputs, tags): `8px`
- **Medium elements** (cards, modals): `12px`
- **Large elements** (page containers, hero sections): `12px`

### Shadows

Subtle shadows create depth without visual clutter.

**Small elevation**:
```css
box-shadow: 0 1px 3px rgba(46, 47, 51, 0.08),
            0 1px 2px rgba(46, 47, 51, 0.06);
```

**Medium elevation** (cards, dropdowns):
```css
box-shadow: 0 4px 6px rgba(46, 47, 51, 0.07),
            0 2px 4px rgba(46, 47, 51, 0.06);
```

**Large elevation** (modals, popovers):
```css
box-shadow: 0 10px 15px rgba(46, 47, 51, 0.08),
            0 4px 6px rgba(46, 47, 51, 0.05);
```

### Buttons

**Primary Button** (Coral solid):
- Background: `#FF6D56`
- Text: `#FFFFFF`
- Hover: `#E55F4C`
- Border radius: `8px`
- Padding: `8px 16px`
- Font weight: 500

**Secondary Button** (Neutral outlined):
- Border: `1px solid #828392`
- Text: `#2E2F33`
- Background: Transparent
- Hover: Light gray background `#F8F9FA`

**Tertiary Button** (Plain/ghost):
- Text: `#828392`
- Background: Transparent
- Hover: Light background

### Input Fields

- Border: `1px solid #E0E0E2` (neutral light)
- Border radius: `8px`
- Padding: `10px 12px`
- Focus state: Border `#FF6D56` (coral), shadow glow

### Cards

- Background: `#FFFFFF` or `#FBFCFF`
- Border: `1px solid #E0E0E2` or none (elevated with shadow)
- Border radius: `12px`
- Padding: `16-24px`
- Shadow: Medium elevation

---

## 🎭 Brand Voice

**Tone**: Professional yet approachable, data-driven but human-centered.

**Principles**:
- **Precision**: Use specific language and accurate data
- **Clarity**: Avoid jargon; make insights accessible
- **Confidence**: Assert value without being arrogant
- **Empathy**: Understand customer success challenges

**Example Headlines**:
- ✅ "Track what matters. Act before it's urgent."
- ✅ "Turn data into decisions. Customers into champions."
- ❌ "Revolutionary AI-powered next-gen platform" (too buzzword-heavy)

---

## 🧩 Design Principles

1. **Data First**: Prioritize actionable insights and clarity in data visualization
2. **Consistency**: Use design tokens and components uniformly
3. **Accessibility**: Maintain WCAG AA contrast ratios, keyboard navigation
4. **Performance**: Optimize assets, use lazy loading, minimize bundle size
5. **Responsive**: Design mobile-first, scale gracefully to desktop

---

## 🔗 Resources

- **Design Tokens**: `src/assets/subzero.tokens.json`
- **Theme Configuration**: `src/assets/theme.js`
- **Global Styles**: `src/index.css`
- **Logo Assets**: `public/` directory
  - `Primary Logo grey.svg`
  - `Logo White.svg`
  - `Submark.logo.orange.svg`

---

## ✅ Checklist for New Features

When building new UI components:

- [ ] Use design tokens from `subzero.tokens.json` or Joy UI theme
- [ ] Apply correct typography scale (h1-h4, body-*)
- [ ] Use 8px spacing grid
- [ ] Apply 8-12px border radius
- [ ] Ensure text contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Use coral (#FF6D56) for primary actions only
- [ ] Test on mobile, tablet, desktop viewports
- [ ] Use Inter font family
- [ ] Apply appropriate shadow elevation
- [ ] Follow button and input field patterns

---

**SubZero Brand Style Guide** | Version 1.0 | Last updated: November 12, 2025
