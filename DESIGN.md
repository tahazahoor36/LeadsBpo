---
name: Executive Growth
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#0036ce'
  on-secondary: '#ffffff'
  secondary-container: '#194cfe'
  on-secondary-container: '#dbdeff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#dee1ff'
  secondary-fixed-dim: '#b9c3ff'
  on-secondary-fixed: '#001258'
  on-secondary-fixed-variant: '#0032c3'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  navy-deep: '#0A192F'
  blue-royal: '#1B4DFF'
  green-mint: '#10B981'
  slate-text: '#475569'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 120px
---

## Brand & Style

This design system is engineered for a premium BPO and call center environment where trust, scalability, and operational excellence are the primary drivers. The brand personality is **authoritative, mature, and transparent**, moving away from the cluttered aesthetics of legacy outsourcing providers toward a modern, enterprise-grade software feel.

The design style follows a **Corporate / Modern** aesthetic with a strong emphasis on **Minimalism**. It utilizes expansive white space to denote luxury and clarity of thought, while employing high-contrast typography to ensure a conversion-focused user journey. Visual interest is generated through precise geometry and "Human-in-the-loop" business imagery rather than decorative elements.

## Colors

The palette is anchored by **Dark Navy (#0A192F)**, used for primary headings and navigation to establish immediate authority. **Royal Blue (#1B4DFF)** serves as the functional action color, guiding users through the conversion funnel. **Mint Green (#10B981)** is used sparingly as a "Trust & Growth" signal, primarily for success states, growth metrics, and subtle accents in iconography.

Backgrounds should remain predominantly white (#FFFFFF) to maintain a clean, airy feel. Secondary surfaces and container backgrounds use a soft **Slate Neutral (#F8FAFC)** to provide structural separation without introducing heavy shadows.

## Typography

The typography system uses **Plus Jakarta Sans** for headlines to provide a sophisticated, modern geometric feel. Generous tracking (letter spacing) should be applied to all display headings to enhance the premium, "editorial" look of the corporate messaging.

**Inter** is utilized for body copy and UI labels for its exceptional legibility at small sizes and its neutral, systematic character. All body text should maintain a minimum line-height of 1.5 to ensure readability in data-heavy or long-form service descriptions.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy on desktop (1280px max-width) and a **Fluid Grid** on mobile devices. A 12-column grid is standard, with generous 24px gutters to prevent content crowding. 

Spacing follows a strict 8px base unit. Section vertical spacing is intentionally large (120px on desktop) to enforce the "Spacious" brand attribute. Content reflow for mobile should transition to a single column, with horizontal margins reduced to 16px to maximize real estate for text-heavy service details.

## Elevation & Depth

To maintain a "Serious Corporate" feel, depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

- **Level 1 (Cards):** Use a 1px border (#E2E8F0) with a very soft ambient shadow (Y: 4px, Blur: 12px, Color: rgba(10, 25, 47, 0.04)).
- **Level 2 (Hover/Active):** Increase shadow depth (Y: 8px, Blur: 24px, Color: rgba(10, 25, 47, 0.08)) and transition the border color to Royal Blue.
- **Overlays:** Use a subtle backdrop blur (8px) on navigation headers to maintain context when scrolling.

## Shapes

The shape language is defined by a consistent **0.5rem (8px)** base radius for standard elements like inputs and buttons, scaling up to **1rem (16px)** for primary content cards. This "Rounded" approach softens the corporate navy palette, making the interface feel approachable while maintaining professional rigor. Circular shapes are reserved strictly for avatars and progress indicators.

## Components

- **Buttons:** Primary buttons use the Royal Blue fill with white text. Secondary buttons use a Navy outline. All buttons must have high horizontal padding (24-32px) and use the `button` typography style for a compact, professional look.
- **Cards:** White backgrounds with 16px corner radius. Include a 1px slate-200 border. Headings within cards should always be Navy-deep.
- **Input Fields:** Use a subtle Slate Neutral background (#F8FAFC) that turns white with a Royal Blue border upon focus. No drop shadows on inputs.
- **Chips/Badges:** Use low-saturation backgrounds of the primary colors (e.g., Mint Green at 10% opacity) with high-saturation text for status indicators.
- **Iconography:** Use "Thin" or "Light" weight line icons (2px stroke). Icons should be monochromatic (Navy) or use the Mint Green accent for specific growth-related features.
- **Lists:** Use custom bullet points (small Royal Blue squares or checkmarks) rather than standard browser dots to reinforce the bespoke nature of the BPO services.