---
name: HelpDesk
description: Support ticket console with a calm, technical instrument-panel identity
colors:
  canvas: "oklch(96% 0.005 75)"
  canvas-dark: "oklch(16% 0.006 75)"
  surface: "oklch(99% 0.003 75)"
  surface-dark: "oklch(22% 0.008 75)"
  border: "oklch(88% 0.006 75)"
  border-dark: "oklch(30% 0.008 75)"
  text-primary: "oklch(22% 0.01 75)"
  text-primary-dark: "oklch(94% 0.006 75)"
  text-secondary: "oklch(45% 0.01 75)"
  text-secondary-dark: "oklch(70% 0.01 75)"
  signal: "oklch(58% 0.09 200)"
  signal-hover: "oklch(50% 0.10 200)"
  signal-dark: "oklch(72% 0.10 200)"
  state-registrado: "oklch(55% 0.04 240)"
  state-asignado: "oklch(58% 0.11 300)"
  state-en-proceso: "oklch(70% 0.14 70)"
  state-resuelto: "oklch(60% 0.12 155)"
  state-cerrado: "oklch(50% 0.02 75)"
  state-anulado: "oklch(55% 0.11 25)"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.signal-hover}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: HelpDesk

## Overview

**Creative North Star: "The Night Ops Console"**

HelpDesk is an instrument panel for triage, not a marketing surface: an agent scans it dozens of times a day to know what's waiting, what's moving, and what's on fire. The system rejects the two defaults every AI-generated admin panel reaches for: cheerful SaaS blue-on-white, and neon-glow dark-hacker-terminal. Instead it takes its calm from real operations consoles — warm graphite instead of clinical white or pure black, one desaturated signal color instead of a rainbow of accents, and a status vocabulary that reads as *meaningful state* rather than decoration.

Density stays high (this is a data-first tool: tables, badges, counts), but every surface gets real tonal elevation instead of relying on `shadow` alone to separate layers. Confirmed rejection: no bright default blue (`blue-600`/`sky-500` family), no pure `#fff`/`#000`, no rainbow-of-random-hues status colors.

**Key Characteristics:**
- Warm graphite neutrals, never blue-tinted slate
- One signal color (desaturated teal-cyan) carries all primary actions and focus states
- Status colors are chosen for meaning (urgency, resolution, neutrality), not for variety
- Space Grotesk marks structural headings only; body text stays a plain system stack for maximum scan speed

## Colors

The palette is restrained: two neutral ramps (light/dark) plus one signal accent plus six status roles tied one-to-one to the ticket lifecycle.

### Primary
- **Signal Teal** (oklch(58% 0.09 200)): the only accent used for primary buttons, active nav item, focus rings, and links. Rare by design — if more than one region of a screen is fighting for attention with this color, that's a violation.

### Neutral
- **Warm Paper** (oklch(96% 0.005 75)): light-mode page canvas.
- **Warm Paper Elevated** (oklch(99% 0.003 75)): light-mode card/surface background, one step lighter than canvas.
- **Ops Graphite** (oklch(16% 0.006 75)): dark-mode page canvas — a real near-black, warmer than Tailwind's default `slate-950`.
- **Ops Graphite Elevated** (oklch(22% 0.008 75)): dark-mode card/surface background, one step lighter than canvas for genuine tonal elevation.
- **Ink** (oklch(22% 0.01 75) light / oklch(94% 0.006 75) dark): primary text.
- **Ink Muted** (oklch(45% 0.01 75) light / oklch(70% 0.01 75) dark): secondary text, descriptions, timestamps.
- **Hairline** (oklch(88% 0.006 75) light / oklch(30% 0.008 75) dark): borders and dividers.

### Named Rules
**The One Signal Rule.** Signal Teal is the only accent color allowed for interactive/action purposes. Status colors communicate ticket state, never user action — a status badge is never clickable-looking.

## Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif fallback)
**Body Font:** system-ui, -apple-system, Segoe UI, Roboto, sans-serif

**Character:** A geometric, slightly technical display face for page/section titles against an entirely plain, fast-reading system body — the pairing should feel like a labeled instrument, not a branded product.

### Hierarchy
- **Display** (600, 1.875rem/30px, 1.2): page titles ("Dashboard", "Tickets"). Space Grotesk only.
- **Title** (600, 1.125rem/18px, 1.3): card/section headings.
- **Body** (400, 0.875rem/14px, 1.5): table cells, descriptions, form content.
- **Label** (500, 0.75rem/12px, 1.4, uppercase optional for status badges only): field labels, badge text, table headers.

### Named Rules
**The Two-Font Ceiling Rule.** Never introduce a third font family. Space Grotesk is reserved for Display/Title; everything else is body.

## Layout

Existing grid/spacing behavior is preserved (`md:grid-cols-2 xl:grid-cols-4` dashboard cards, responsive sidebar drawer). Spacing rhythm uses 8px steps (`spacing.sm/md/lg` = 8/16/24px); keep more space above a heading than below it.

## Elevation & Depth

Hybrid: tonal layering is the primary depth cue (Warm Paper → Warm Paper Elevated, Ops Graphite → Ops Graphite Elevated), with a soft ambient shadow as a secondary, subtle reinforcement — never the only signal, since flat tonal contrast must read correctly even if shadows are disabled or overridden.

### Named Rules
**The Tonal-First Rule.** A card is legible as "elevated" from its background color shift alone, with shadow only adding softness on top.

## Shapes

Rounded corners throughout, slightly larger than the current default: `rounded.lg` (16px) for cards/panels, `rounded.sm` (8px) for buttons/inputs/badges. No sharp corners anywhere — this is a calm, approachable console, not a dense terminal grid.

## Components

### Buttons
- **Shape:** 8px radius
- **Primary:** Signal Teal background, Warm Paper Elevated text, 10px/20px padding
- **Hover / Focus:** background shifts to Signal Teal Hover (oklch(50% 0.10 200)); focus-visible gets a 2px Signal Teal ring with offset
- **Secondary / Ghost:** transparent background, Hairline border, Ink text; hover fills with a faint Signal Teal tint (8% opacity)

### Cards / Containers
- **Corner Style:** 16px radius
- **Background:** Warm Paper Elevated (light) / Ops Graphite Elevated (dark)
- **Shadow Strategy:** soft ambient shadow, secondary to the tonal shift (see Elevation & Depth)
- **Internal Padding:** 24px

### Status Badges (signature component)
Each of the six ticket states gets its own hue, not a shared "info blue": Registrado (neutral gray-blue), Asignado (violet), En proceso (amber — the one state meant to visually read as "needs attention"), Resuelto (emerald), Cerrado (muted graphite), Anulado (muted red, deliberately desaturated so it never reads as alarming). Badges are pill-shaped (full radius), 12px label text, never used for anything clickable.

### Inputs / Fields
- **Style:** Hairline border, Warm Paper Elevated / Ops Graphite Elevated background, 8px radius
- **Focus:** border shifts to Signal Teal, 2px ring
- **Error:** border shifts to the Anulado red, inline message below in the same red, `aria-invalid`/`aria-describedby` wired (already implemented)

### Navigation
Sidebar keeps its current responsive drawer behavior. Active nav item uses Signal Teal text/icon with a subtle tinted background pill; inactive items use Ink Muted.

## Do's and Don'ts

### Do:
- **Do** use Signal Teal for exactly one thing per screen: the primary action or the active nav/focus state.
- **Do** give every ticket status its own named hue from the six defined above — never reuse a status color for a new meaning.
- **Do** keep body text on the plain system stack; reserve Space Grotesk for Display/Title only.

### Don't:
- **Don't** use Tailwind's stock `blue-600`/`sky-500`, `slate-900`, or pure white/black anywhere — those are the exact defaults this system replaces.
- **Don't** add a second accent color "for variety." Rarity is what makes Signal Teal legible as action.
- **Don't** let a status badge look interactive (no hover states, no pointer cursor, no shadow-on-hover).
