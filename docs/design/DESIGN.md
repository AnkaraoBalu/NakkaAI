---
name: Obsidian Terminal Minimal
colors:
  surface: '#121319'
  surface-dim: '#121319'
  surface-bright: '#383940'
  surface-container-lowest: '#0d0e14'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#292a30'
  surface-container-highest: '#34343b'
  on-surface: '#e3e1ea'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#e3e1ea'
  inverse-on-surface: '#2f3037'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#00e2ed'
  on-tertiary: '#00373a'
  tertiary-container: '#00c4ce'
  on-tertiary-container: '#004c50'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#6ff6ff'
  tertiary-fixed-dim: '#00dce6'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f53'
  background: '#121319'
  on-background: '#e3e1ea'
  surface-variant: '#34343b'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies the precision, high-density utility, and focused calm of premier developer platforms like Cursor, Linear, and Vercel. Engineered specifically for builders, technical architects, and developers interacting with intelligent agentic systems, the aesthetic prioritizes extreme clarity over decorative clutter.

### Style Archetype
**Technical Minimalism with Precision Instrumentation.** The visual language rejects soft skeuomorphism, saturated gradients, and gratuitous blur effects in favor of:
- **Zero-noise dark canvas**: Absolute focus on information architecture and code context.
- **Razor micro-borders**: Crisp 1px structural framing replacing heavy elevations.
- **Engineered accents**: Restrained icy-cyan and emerald indicators operating purely as contextual state signals and execution triggers.
- **Monospaced parity**: Code and system metadata treated as first-class visual citizens alongside proportional interface type.

## Colors

The palette is tuned for prolonged dark-mode sessions, eliminating ocular strain while sustaining razor-sharp contrast ratios (minimum 7:1 for core text, 4.5:1 for interactive states).

### Base Surfaces
- **Canvas Base (`#090a0f`)**: Deepest near-black void reserved for terminal backdrops and foundational workspace frames.
- **Surface Layer 1 (`#0d0e14`)**: Default viewport background and low-level container canvas.
- **Surface Layer 2 (`#12141c`)**: Raised cards, active file panels, code execution blocks, and inspector panels.
- **Surface Layer 3 (`#181a24`)**: Hover states, popovers, dropdown flyouts, and command palette menus.

### Structural Lines & Dividers
- **Border Default (`#1f2430`)**: Ubiquitous 1px structural boundary defining layout splits and panel rails.
- **Border Subtle (`#161922`)**: Micro-gridlines and internal table cell separators.
- **Border Active / Focus (`#262c3d`)**: Unfocused interactive boundaries, escalating to `#38bdf8` upon direct focus.

### Accent Signals
- **Primary Accent (`#38bdf8` - Icy Blue)**: Command links, focused inputs, active branch tabs, and primary action surfaces.
- **Success & Agent Output (`#10b981` - Emerald)**: Execution complete, tests passing, active session signals, and streaming stability.
- **Telemetry Cyan (`#00f2fe`)**: High-voltage AI token generation pulses, live diff updates, and real-time socket indicators.
- **Destructive / Error (`#f43f5e`)**: Build breakages, syntax termination, and critical alerts.

## Typography

The typographic hierarchy implements an intentional pairing between **Geist** for frictionless prose navigation and **JetBrains Mono** for all code, parameters, token badges, hotkeys, and timestamps.

### Usage Standards
- **Headlines (`Geist`)**: Tight negative letter spacing (`-0.015em` to `-0.03em`) creates a dense, editorial tech feel without loss of legibility.
- **Body Text (`Geist`)**: Maintained at high-contrast neutral whites and greys (`#ededed` for primary text, `#8b949e` for secondary descriptors).
- **Code & Micro-labels (`JetBrains Mono`)**: Strict tabular alignment. All metadata tags, keyboard shortcuts (e.g., `⌘K`), status badges, and CLI commands must employ monospaced sizing to enforce column alignment.

## Layout & Spacing

The layout model is anchored to a strict **4px baseline and 8px rhythmic grid**, optimizing workspace density for complex dashboards, code views, and terminal consoles.

### Grid System & Rails
- **Desktop Layout**: Three-pane responsive frame (Collapsible Navigation Rail 240px, Master Feed / Editor Fluid, Contextual Inspector 320px). Internal divisions lock to 12-column layouts when visualizing analytics or metrics.
- **Gutter & Margin Rules**: Tight gutters (`1rem` / `1.5rem`) maximize screen real estate. Edge margins align exactly with border lines to preserve grid continuity.
- **Breakpoint Transitions**:
  - **Desktop (`>= 1280px`)**: Full triple-pane workbench enabled.
  - **Tablet (`768px - 1279px`)**: Inspector collapses into an overlay drawer; terminal slides below editor.
  - **Mobile (`< 768px`)**: Stacked single-column; primary navigation converts to an off-canvas drawer or bottom command trigger.

## Elevation & Depth

This system avoids diffuse shadows and physical elevation in favor of **structural planar hierarchy via tonal surfacing and precision hairline boundaries**.

### Layering Rules
1. **Base Layer (Elevation 0 - `#090a0f`)**: System backdrop, outer workbench wrapper, empty terminal pane.
2. **Structural Panes (Elevation 1 - `#0d0e14`)**: Primary editor panels, chat streams, sidebars. Framed by a continuous 1px solid `#1f2430` border.
3. **Floating Overlays (Elevation 2 - `#12141c`)**: Modals, dropdown menus, quick-search palettes (`⌘K`). Outlined with 1px `#262c3d` coupled with a restrained, dark ambient drop: `box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.7)`.
4. **Active Focus & Hover**: Surfaces do not grow in scale; instead, their borders illuminate to `#38bdf8` or `#262c3d`, providing instantaneous, crisp feedback.

## Shapes

The design system operates with **Soft (`1`) geometric rounding**. Large sweeping curves are prohibited, as they erode screen density and compromise the industrial, terminal-inspired identity.

### Geometry Specifications
- **Micro Elements (Inputs, Buttons, Chips, Code Badges)**: Fixed `0.25rem` (4px) corner radius.
- **Containers & Panes (Cards, Modal Sheets, Code Snippets)**: Fixed `0.5rem` (8px) corner radius (`rounded-lg`).
- **Terminal & Editor Panes**: Seamless 0px corners when docking against outer screen boundaries, rounding strictly to `0.5rem` when floating.
- **Pills & Avatars**: Strictly disallowed for generic UI containers; used exclusively for active connection state dots (perfect circles).

## Components

### Buttons
- **Primary**: Background `#38bdf8`, foreground `#090a0f`, font `Geist` 13px weight 500. Sharp transition on hover (brightness 1.08, subtle cyan glow `0 0 12px rgba(56, 189, 248, 0.35)`).
- **Secondary**: Background `#12141c`, border 1px `#1f2430`, foreground `#ededed`. Hover: border `#262c3d`, background `#181a24`.
- **Ghost / Icon**: Transparent fill, foreground `#8b949e`. Hover: foreground `#ededed`, background `#12141c`.

### Text Inputs & Search Fields
- Single-line inputs and terminal prompts feature an inset `#090a0f` fill with a crisp 1px `#1f2430` perimeter.
- Active focus drops the default browser outline and applies an immaculate `border-color: #38bdf8` with no offset spread.
- Monospaced prefix indicators (e.g. `$`, `>`, `search:`) set in `#8b949e`.

### Chips & Badges
- Constructed with `JetBrains Mono` at `label-sm` (10px).
- Low-key status: Background `#12141c`, border 1px `#1f2430`, foreground `#8b949e`.
- Active/Agent status: Background `rgba(16, 185, 129, 0.1)`, border 1px `rgba(16, 185, 129, 0.3)`, foreground `#10b981`.

### Cards & Panels
- Background `#0d0e14` or `#12141c`, encapsulated by 1px `#1f2430`. No standard drop-shadow.
- Optional top header rail with a clean horizontal divider `#1f2430`, housing panel title (`label-md`) and utility actions.

### Checkboxes & Radios
- 14px × 14px squares with 2px radius. Background `#090a0f`, border 1px `#262c3d`.
- Checked state: `#38bdf8` fill with an internal deep-black checkmark mark.

### Terminal & Code Diff Blocks
- Background `#090a0f`. Continuous left indicator bar for execution stream (1px or 2px accent line).
- Line numbers rendered in `JetBrains Mono` `#4b5563`, unselectable.
- Diffs rendered with low-saturation green (`rgba(16, 185, 129, 0.15)`) and red (`rgba(244, 63, 94, 0.15)`) full-width horizontal bands.