---
name: Vibrant Wilderness
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5a4136'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#4d6356'
  on-secondary: '#ffffff'
  secondary-container: '#d0e9d8'
  on-secondary-container: '#53695c'
  tertiary: '#4b6175'
  on-tertiary: '#ffffff'
  tertiary-container: '#859bb1'
  on-tertiary-container: '#1d3345'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#d0e9d8'
  secondary-fixed-dim: '#b4ccbc'
  on-secondary-fixed: '#0a1f15'
  on-secondary-fixed-variant: '#364b3f'
  tertiary-fixed: '#cee5fd'
  tertiary-fixed-dim: '#b2c9e0'
  on-tertiary-fixed: '#041d2f'
  on-tertiary-fixed-variant: '#33495c'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 80px
  max-width: 1280px
---

## Brand & Style

The design system is built to evoke the spirit of modern exploration—balancing the raw energy of the outdoors with the seamless comfort of high-end travel. The brand personality is **adventurous, energetic, and approachable**. It targets modern travelers who seek both excitement and clarity in their digital experiences.

The design style is **Corporate Modern with a Tactile twist**. It utilizes high-contrast typography and a bold primary action color to drive engagement, while softening the overall interface with pastel backgrounds and generous roundedness. This prevents the "utility" feel of standard travel apps, replacing it with a welcoming, editorial atmosphere that prioritizes high-quality nature imagery.

## Colors

The palette is anchored by **Vibrant Orange (#FF6B00)**, used exclusively for primary actions, notifications, and interactive highlights to ensure high visibility and energy. **Deep Black (#121212)** provides the grounding force, used for primary headings and heavy structural elements to create a premium feel.

Secondary and background surfaces utilize a "Nature Pastel" logic:
- **Mint Green (#D1EAD9):** Used for success states, sustainability tags, or eco-friendly travel categories.
- **Pale Sky Blue (#D0E7FF):** Used for weather information, flight/water-based activities, and secondary information containers.
- **Soft Sand (#F5F1E9):** The primary alternative to pure white for page backgrounds, reducing eye strain and adding a natural, paper-like warmth.

## Typography

This design system employs a pairing of **Montserrat** for headlines and **Inter** for body copy. 

Montserrat brings a geometric, bold, and adventurous character to the display hierarchy, essential for conveying the "impact" of travel destinations. Inter provides the necessary utilitarian balance, ensuring that long-form descriptions and itinerary details remain highly legible and professional. 

Headlines should use tight letter spacing to maintain a compact, modern look, while labels use slightly increased tracking for clarity at smaller sizes.

## Layout & Spacing

The layout follows a **Fluid Grid** system with a heavy emphasis on whitespace to mimic the openness of nature. 

- **Desktop:** 12-column grid with 24px gutters. Use large 80px side margins to center the content and provide an editorial feel.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.
- **Spacing Logic:** All spacing is based on a 4px baseline. Use `lg` (24px) for most component grouping and `xl` (48px) for section vertical padding to ensure the UI feels "breathable."

Content should reflow dynamically, but high-impact imagery should frequently break the grid or bleed to the edges to create an immersive experience.

## Elevation & Depth

To maintain the "clean and natural" aesthetic, this design system avoids heavy, muddy shadows. Instead, it uses **Tonal Layers** and **Soft Ambient Shadows**.

- **Surface Layers:** Use the Pastel palette (Sand, Mint, Sky) to create distinct zones without needing borders.
- **Shadows:** When elevation is required (e.g., for "floating" action buttons or cards over imagery), use a highly diffused, low-opacity shadow tinted with the primary neutral: `box-shadow: 0 8px 30px rgba(18, 18, 18, 0.08)`.
- **Active State:** Elements like pressed buttons or selected cards should physically "sink" by removing the shadow and applying a slight 1-2px vertical translation.

## Shapes

The shape language is defined by **Rounded (Level 2)** settings. This ensures that every touchpoint feels friendly and safe, mirroring the organic curves found in nature.

- **Standard Elements:** Buttons, input fields, and small tags use a 0.5rem (8px) radius.
- **Containers:** Cards and content modules use 1rem (16px) for a more pronounced "friendly" container.
- **Feature Elements:** Hero images and large promotional banners use 1.5rem (24px) to stand out as soft, inviting portals to destinations.

## Components

### Buttons
Primary buttons use the **Vibrant Orange** background with White text. They should have a minimum height of 48px for accessibility. Secondary buttons use a Deep Black outline (2px) with transparent backgrounds.

### Cards
Cards are the primary vehicle for travel content. They must feature a subtle 1px border in a darker shade of the Sand background to define edges on white surfaces. Imagery within cards should always have a top-only border radius of 1rem to match the container.

### Chips & Tags
Used for categories (e.g., "Hiking," "Luxury," "Eco-friendly"). These use the pastel Mint or Sky backgrounds with dark grey text. They should be pill-shaped (fully rounded) to contrast against the 8px radius of buttons.

### Input Fields
Inputs use the Soft Sand background rather than white. On focus, the border transitions to a 2px Vibrant Orange stroke. Labels always sit above the field in `label-md` Montserrat.

### Imagery
Images are a core component. Use a "soft-mask" approach where images have slight rounded corners. When overlaying text on images, use a 20% Black linear gradient from the bottom to ensure legibility of white typography.

### Progress Indicators
For booking flows, use a stepped horizontal indicator. Completed steps are Vibrant Orange, current steps are Deep Black, and future steps are Soft Sand.