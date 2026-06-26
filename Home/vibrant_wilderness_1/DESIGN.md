---
name: Lumina Voyager
colors:
  surface: '#121412'
  surface-dim: '#121412'
  surface-bright: '#383a37'
  surface-container-lowest: '#0d0f0d'
  surface-container-low: '#1a1c1a'
  surface-container: '#1e201e'
  surface-container-high: '#292a28'
  surface-container-highest: '#333533'
  on-surface: '#e2e3df'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e2e3df'
  inverse-on-surface: '#2f312e'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb693'
  primary: '#ffb693'
  on-primary: '#561f00'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#a04100'
  secondary: '#c5c7c2'
  on-secondary: '#2e312e'
  secondary-container: '#474a46'
  on-secondary-container: '#b7b9b4'
  tertiary: '#c4c7c2'
  on-tertiary: '#2d312d'
  tertiary-container: '#969a95'
  on-tertiary-container: '#2e322e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e1e3de'
  secondary-fixed-dim: '#c5c7c2'
  on-secondary-fixed: '#191c19'
  on-secondary-fixed-variant: '#454744'
  tertiary-fixed: '#e0e3dd'
  tertiary-fixed-dim: '#c4c7c2'
  on-tertiary-fixed: '#191d19'
  on-tertiary-fixed-variant: '#444843'
  background: '#121412'
  on-background: '#e2e3df'
  surface-variant: '#333533'
  vibrant-orange: '#ff6b00'
  surface-dark: '#1e211e'
  border-muted: '#2e322e'
  text-primary: '#ffffff'
  text-secondary: '#9ca3af'
  input-bg: transparent
typography:
  headline-xl:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-xl-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 896px
  section-gap: 2rem
  item-gap: 1.5rem
  inline-padding: 1rem
  block-padding: 3rem
---

## Brand & Style

Lumina Voyager is a high-end AI travel concierge designed for the modern explorer. The brand personality is **sophisticated, efficient, and forward-looking**, blending the warmth of adventure with the precision of artificial intelligence. 

The design style is **Corporate Modern with a Dark Mode focus**, utilizing a deep, monochromatic base contrasted by a vibrant, energetic "Vibrant Orange" accent. The aesthetic relies on clear information hierarchy, subtle border definitions instead of heavy shadows, and a "fidelity" variant that feels premium and curated. It evokes a sense of reliability and excitement, making complex trip planning feel effortless and organized.

## Colors

The palette is anchored in a deep **#121412 Dark Background**, creating a focused environment that reduces eye strain. 

- **Primary:** A "Vibrant Orange" (#ff6b00) is used sparingly for call-to-action elements, focus states, and selection indicators. It represents energy and the "spark" of AI intelligence.
- **Surface & Borders:** We use a tiered dark system. `darkSurface` (#1e211e) defines the main containers, while `darkBorder` (#2e322e) provide subtle separation without breaking the dark-mode immersion.
- **Typography Colors:** White is reserved for high-priority headings and active text. A muted gray (#9ca3af) is used for descriptions and labels to maintain a clear visual hierarchy.

## Typography

The system exclusively uses **Be Vietnam Pro**, a contemporary sans-serif that offers excellent readability in both Vietnamese and English. 

The type scale is intentionally dramatic:
- **Headlines:** Large, bold, and high-contrast (White on Dark).
- **Labels:** Small, uppercase, and tracked out (10% letter-spacing) to create a "technical" or "dashboard" feel for metadata and form headers.
- **Body:** Open and airy with a generous line height (1.6) to ensure long descriptions are easy to parse.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop, centering the main interaction area to keep the user focused. 

- **Containers:** The primary content area is constrained to a 4xl (max-width: 896px) layout with deep padding (48px on desktop, reduced to 32px on mobile).
- **Grid System:** A responsive 2-column grid is used for form inputs on tablet and desktop, collapsing to a single column on mobile.
- **Rhythm:** We use an 8px base unit. Vertical rhythm is established through consistent 32px (space-y-8) gaps between major form sections and 24px (gap-6) between related input fields.

## Elevation & Depth

In this dark-mode system, depth is communicated through **Tonal Layering** and **Subtle Border Glows**:

- **Level 0 (Background):** #121412 - The deepest layer.
- **Level 1 (Card/Container):** #1e211e - Raised slightly, defined by a 1px border (#2e322e).
- **Level 2 (Interactive/Focus):** Elements like selected radio cards use a low-opacity primary tint (`bg-primary/5`) and a primary-colored border to appear "active."
- **Shadows:** We use large, soft shadows (`shadow-2xl`) on the primary container to lift it off the background, but secondary elements rely on borders to maintain a clean, "flat-modern" look.

## Shapes

The design uses a **Consistent Rounded** language. 

- **Standard Radius:** 8px (`rounded-eight`) is the universal radius for cards, input fields, and buttons. This creates a friendly yet structured appearance.
- **Interactive Elements:** Buttons and inputs share the same radius to create a unified visual block when aligned in a grid.

## Components

### Buttons
- **Primary:** High-impact, solid #ff6b00 with white bold text. Transitions to a slightly darker shade on hover. Includes a subtle glow (`shadow-primary/20`).
- **Secondary/Back:** Outlined style with #2e322e borders. Hover state darkens the background slightly to #1f2937 for tactile feedback.

### Input Fields
- **Text/Date/Number:** Transparent backgrounds with #374151 (gray-700) borders. On focus, the border transitions to Primary Orange with a matching ring. Placeholder text is muted.
- **Date Picker:** Custom webkit-indicator inversion (white icon) to ensure visibility against dark backgrounds.

### Selection Cards (Radio/Budget)
- **Inactive:** Transparent with subtle borders. Gray-400 subtext.
- **Active:** 1px Primary border with a 5% opacity primary color fill. This "glow" effect makes the selection feel "selected" without being heavy.

### Labels
- All form labels must be `text-xs`, `font-bold`, `uppercase`, and `tracking-widest` in a muted gray color to separate the prompt from the user-entered data.