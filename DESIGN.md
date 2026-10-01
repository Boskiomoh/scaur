---
name: Scaur
description: A headless Shopify store where every layer sits on one temperature scale.
colors:
  frost: "#eef1f3"
  snow: "#f8f9fa"
  mist: "#dde2e6"
  ink: "#111418"
  ink-2: "#4a525b"
  line: "#cfd5da"
  field: "#5f6870"
  ghost: "#8a929a"
  ghost-line: "#b7bec5"
  empty-line: "#9aa3ab"
  ember: "#cf3a1c"
  ember-hover: "#b0301a"
  error: "#b3261e"
  heat-0: "#140c2e"
  heat-1: "#4a1a78"
  heat-2: "#a3206f"
  heat-3: "#e0452b"
  heat-4: "#f79a2e"
  heat-5: "#ffe08a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "68px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112.5"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112.5"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  data:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 87.5"
rounded:
  none: "0"
  pill: "9999px"
spacing:
  gutter: "24px"
  margin-phone: "16px"
  margin-tablet: "32px"
  margin-desktop: "48px"
  section-phone: "56px"
  section-desktop: "112px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ember-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.snow}"
  chip:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.snow}"
  size-pill:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.pill}"
    height: "44px"
    width: "52px"
  segmented-track:
    backgroundColor: "{colors.mist}"
    rounded: "{rounded.pill}"
    padding: "3px"
  panel:
    backgroundColor: "{colors.snow}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: Scaur

## Overview

**Creative North Star: "Heat Map"**

Scaur shows what a layer does, not only what it looks like. The store is light, photo-led and flat: a cool grey ground, near-black type, square photographs cropped hard on the garment, and one warm accent for the things you press. The only rich colour in the interface is the thermal scale, and it appears only where it encodes warmth: range bars, ratings, the thermal photo views and the kit figure.

Everything hangs off one temperature axis, -10°F to 80°F. A product's range bar on a shop tile, its rating on the product page, the home page's layer chart and the kit builder's "comfortable down to" readout all sit on that same axis, so a shopper can compare any two pieces at a glance. Density is moderate: generous section spacing, compact controls, data set in a narrow mono face.

The system refuses the default outdoor-store look: a full-bleed ridge photo with "Shop now", a four-up grid of look-alike jackets, dark neon, glass, blur and drop shadows.

**Key Characteristics:**
- One temperature axis for every rating, bar and readout.
- Thermal colour is data, never decoration.
- Flat depth: flat colour fields and 1px rules, no shadows.
- Everything you press is a pill; everything you look at is square.
- State changes cut; only the kit figure's warmth eases.

## Colors

A cool, near-neutral palette with one ember accent and a six-stop "ironbow" thermal scale reserved for data.

### Primary
- **Ember** (`ember`): primary buttons, the focus ring, the cart badge and the text caret. Hover deepens to **Banked Ember** (`ember-hover`). Ember on frost is 4.3:1, so it is never used for body-size text.

### Neutral
- **Frost** (`frost`): the page ground everywhere.
- **Snow** (`snow`): raised panels, inputs, chips, the cart drawer, the kit teaser band and the store-down block.
- **Mist** (`mist`): the Photo/Thermal track, image placeholders, skeletons and range-bar tracks.
- **Ink** (`ink`): text, pressed chips and sizes, the secondary-button border (16.2:1 on frost).
- **Slate** (`ink-2`): secondary text (7.0:1 on frost).
- **Hairline** (`line`): 1px rules and decorative chip borders.
- **Field** (`field`): borders on inputs and selects, which must meet 3:1.
- **Ghost** (`ghost`, `ghost-line`): sold-out sizes, with a dashed border and a line-through.
- **Empty** (`empty-line`): the dashed outline of an empty kit slot and the disabled plus in the stepper.
- **Error** (`error`): error text and invalid borders (5.8:1 on frost).

### Thermal scale
- **Ironbow** (`heat-0` to `heat-5`): night violet, deep purple, magenta, ember red, amber, pale gold, placed at 0, 0.22, 0.45, 0.66, 0.84 and 1 along -10°F to 80°F. Range bars are a gradient between the scale colours at their two ends.

### Named Rules
**The Thermal Is Data Rule.** The heat colours appear only where they encode a temperature. If removing the colour would lose no information, it doesn't belong there.

**The Quiet Ember Rule.** Ember marks what you can press next (the primary button, focus, the cart count). It is never a background, a heading colour or a decoration.

## Typography

**Display Font:** Archivo at 112.5% width, weight 800, uppercase (with system-ui)
**Body Font:** Archivo at normal width, weights 400 to 600
**Label/Mono Font:** Martian Mono at 87.5% width with tabular numbers

**Character:** A wide, heavy grotesk for headlines gives the brand a technical-label confidence; Martian Mono sets every measurement (prices, temperatures, sizes, stock) so numbers read like instrument readings.

### Hierarchy
- **Display** (800, 68px desktop / 42px phone, 0.95): page titles (H1).
- **Headline** (800, 48px desktop / 32px phone, 1): section titles (H2). Product titles use 52px at 0.98.
- **Title** (600, 20px, 1.3): sub-sections, kit slot names.
- **Body** (400, 16 to 19px, 1.55 to 1.6): descriptions and blurbs, at most 60 characters a line.
- **Label** (600, 14 to 15px): field labels, nav, buttons.
- **Data** (Martian Mono, 11 to 28px, tabular): prices, temperatures, sizes, stock lines, axis ticks. The kit readout reaches 56px.

### Named Rules
**The Readout Rule.** If it is a measurement or money, it is set in Martian Mono. Mono is never used for decoration or labels.

**The No-Eyebrow Rule.** Headings stand alone: no small uppercase kicker above them.

## Layout

A 12-column grid to 1440px with 24px gutters and 48px side margins on desktop; 32px margins on tablet (768 to 1023px); a single column with 16px margins on phones. Sections are spaced 112px apart on desktop and 56px on phones.

Desktop pages split asymmetrically: the home hero text sits in columns 1 to 5 against a photo in 6 to 12; the product gallery takes 1 to 7 and the details 9 to 12; the kit builder's form takes 1 to 4 and its results 6 to 12. Tablet keeps the phone header and menu sheet, stacks the stage above two-column details, and shows shop tiles three across. Phones show tiles two across and kit slots two by two.

Long text is capped (60ch for copy, 58ch on the home axis, 110ch for the footer's small print). No page scrolls sideways from 320px up.

## Elevation & Depth

There are no shadows. Depth comes from tonal layering: frost ground, snow panels, mist tracks, and 1px hairline rules between rows. The only overlay is the 50% ink scrim behind the cart, menu and search sheets.

### Named Rules
**The Flat Field Rule.** Surfaces overlap in flat colour. No box-shadow, blur, glass or gradient anywhere outside the thermal scale.

## Shapes

**The Pill-Or-Square Rule.** Everything you press is a full pill: buttons, chips, size pills, colour swatches, the Photo/Thermal switch and the quantity stepper. Everything you look at is square: photos, panels, the drawer, skeletons and range bars. There is no intermediate radius.

Borders are 1px hairlines for structure and 1.5px for controls. Dashed borders mean absence: a sold-out size or an empty kit slot.

## Components

### Buttons
Confident, compact and tactile.
- **Shape:** full pill.
- **Primary:** ember with white 16px/600 text, 48px tall (52px on the product page, kit builder and drawer), 24px padding. "Adding" sits on the deeper ember with `aria-busy`.
- **Hover / Focus:** hover deepens to ember-hover; every focusable element gets a 2px ember outline; pressing nudges the button down 1px.
- **Secondary:** transparent with a 1.5px ink border; hover fills ink with snow text.

### Chips
- **Style:** 40px snow pills with a 1.5px hairline border and 14px/600 text.
- **State:** pressed chips fill ink with snow text and carry `aria-pressed`; the kit builder uses the same look on real radio buttons.

### Size pills and swatches
- **Size pill:** Martian Mono 13px, at least 52 by 44px; selected fills ink. Sold out: dashed ghost border, ghost text, line-through, announced as "XS, sold out".
- **Swatch:** a 40px circle of the colourway with a 2px frost inner ring; selected adds a 2px ink outline. The chosen name is printed above ("Colour: Moss").

### Segmented switch (Photo / Thermal)
A mist pill track with 3px padding holding two 34px pills; the selected one is ink with snow text. It is two buttons with `aria-pressed` in a labelled group. Products without a thermal image don't show it.

### Cards / Containers
- **Corner Style:** square.
- **Background:** snow on the frost ground.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none, or a 1px hairline between rows.
- **Internal Padding:** 24px on phones, 32px on larger screens.

### Inputs / Fields
- **Style:** snow fill, 1.5px field border, pill shape; 16px text on phones and tablets so iOS doesn't zoom.
- **Focus:** the 2px ember outline.
- **Error:** error-red text next to the field with a warning icon, announced through a live region.

### Navigation
The desktop header is 64px: the logo, the four layers and Kit builder as 15px links, then search and a cart button that shows its count. Below 1024px the header is 56px with search, the cart badge and a menu that opens a full-screen sheet with each layer's photo and temperature range.

### Range bar (signature)
A square bar on the -10°F to 80°F axis: a mist track (omitted on the home layer chart), filled with a gradient between the heat colours at the piece's lowest and highest temperatures. Every bar also has its range as text.

### Kit slot (signature)
A mono layer label, a 4:5 photo, the name, the price, and labelled swap and remove buttons. An empty slot is a dashed square that explains why it's empty and offers "Add one anyway"; a sold-out slot offers "Change size".

## Do's and Don'ts

### Do:
- **Do** put every temperature on the shared -10°F to 80°F axis, and print the number next to every bar.
- **Do** set prices, temperatures, sizes and stock in Martian Mono with tabular numbers.
- **Do** keep pressable things full pills and everything else square.
- **Do** cut between states (colourway, Photo to Thermal, kit swaps); ease only the kit figure's warmth (360ms, `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Do** caption photos below the image, never on it.
- **Do** label illustrative thermal views as illustrative.

### Don't:
- **Don't** use heat colours, gradients or ember for decoration.
- **Don't** add shadows, blur, glass or rounded cards.
- **Don't** use ember for body-size text (4.3:1 on frost).
- **Don't** put text over photographs or use a full-bleed hero with "Shop now".
- **Don't** add scroll-triggered entrances, parallax or marquees; honour reduced motion.
