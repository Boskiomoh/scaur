# Scaur design spec

The build handoff for the original design canvas. Reference markup for every artboard is in [`design/`](design/); the artboards are interactive, so their `renderVals()` code also shows the intended behaviour.

> A handoff spec. The final DESIGN.md is written from the finished build.

## 1. Direction: "Heat Map"

Scaur shows what a layer does, not only what it looks like. The store is light, photo-led and modern; the thermal scale appears only where it encodes warmth.

What it refuses: a full-bleed ridge photo with "Shop now" and a four-up grid of look-alike jackets; the dark-neon look; glass, blur and drop shadows.

Disciplines carried through every page:
1. **One temperature axis.** -10°F to 80°F. Every range bar, rating and the kit's coverage sit on it.
2. **Thermal colour is data.** The ironbow scale is used for ratings, range bars, thermal views and the kit figure. It never decorates.
3. **Flat depth.** Layers overlap in flat colour. No shadows, blur, glass or gradients outside the thermal scale.
4. **Decisive cuts.** State changes (colourway flood, Photo to Thermal, kit swaps) cut, not fade. Only warmth spreading in the kit figure eases.
5. **Hard-cropped photography** of the garment on the body; captions below images, never on them.

## 2. Tokens (`src/app/globals.css` `@theme`)

| Token | Hex | Use |
|---|---|---|
| `--color-frost` | `#eef1f3` | page ground |
| `--color-snow` | `#f8f9fa` | panels, inputs, chips, the cart drawer, the kit teaser band |
| `--color-mist` | `#dde2e6` | segmented-switch track, image placeholders, range-bar track |
| `--color-ink` | `#111418` | text, pressed chips and sizes, secondary-button border |
| `--color-ink-2` | `#4a525b` | secondary text |
| `--color-line` | `#cfd5da` | 1px rules, chip borders (decorative) |
| `--color-field` | `#5f6870` | select and input borders |
| `--color-ghost` | `#8a929a` | sold-out size text (disabled) |
| `--color-ember` | `#cf3a1c` | primary buttons, focus ring, cart badge |
| `--color-ember-hover` | `#b0301a` | primary button hover |
| `--color-error` | `#b3261e` | error text and invalid borders |

**Thermal scale** (`src/lib/heat.ts` and `--heat-0` to `--heat-5`): `#140c2e`, `#4a1a78`, `#a3206f`, `#e0452b`, `#f79a2e`, `#ffe08a` at 0, 0.22, 0.45, 0.66, 0.84 and 1 along -10°F to 80°F.

**Colourway floods** (product data, not UI tokens): Moss `#3f5a45`, Tide `#2d5d8f`, and each product colour's hex from `content/catalog.json`.

**Verified contrast:** ink on frost 16.2; ink-2 on frost 7.0; ink-2 on snow 7.5; white on ember 4.9; error on frost 5.8; field border on snow 5.4. Ember on frost is 4.3, so **never use ember for body-size text**; it is for buttons, focus and graphics only. Sold-out ghosts are disabled controls and are exempt, but they also carry "sold out" in their accessible name.

## 3. Type

| Role | Face | Spec |
|---|---|---|
| Display (H1, H2, wordmark) | Archivo, `font-stretch: 112.5%`, weight 800, uppercase, tracking -0.01em | H1 68/0.95 desktop, 42 phone; H2 48/1 (32 phone); product H1 52/0.98; wordmark 22px at +0.04em |
| Text | Archivo, width 100, weights 400 to 600 | body 16 to 19 / 1.5 to 1.6, max 60ch; labels 14/600 |
| Data | Martian Mono, `font-stretch: 87.5%`, tabular numbers | prices, temperatures, sizes, stock lines, axis ticks; 11 to 28px |

Both from Google Fonts via `next/font` (variable, with the `wdth` axis). Mono is only for measurements and money, never as decoration. No eyebrows above headings.

## 4. Layout

- 12-column grid, 48px side margins, 24px gutters, max 1440. Section top padding 112px desktop, 56px phone.
- **Radius rule:** everything you press is a full pill (buttons, chips, size pills, swatches, the Photo/Thermal switch, the quantity stepper); photos, panels, the drawer and range bars are square.
- **Home:** hero text in columns 1-5, the photo in 6-12 (620px tall, switch strip 56px below it); the layer axis with a 280px label column; the featured product stage in 1-7 and details in 9-12; the kit teaser band (snow) with controls in 1-4 and four slots in 6-12; a full-bleed fabric photo (420px) with three facts below.
- **Shop:** title and blurb, one filter row (layer chips, "Made for" slider, count, Photo/Thermal), then tiles 318px wide (4 per row at 1440), image 4:5, 48px row gap.
- **Product:** gallery in 1-7 (stage 760px, 56px flood padding), info in 9-12; "Finish the kit" band (snow) below.
- **Kit:** form in 1-4; results in 6-12 (thermal figure 3 of 7 inner columns, 440px tall; the "comfortable down to" readout beside it; four slots below; footer bar with total and "Add kit to cart").
- **Cart drawer:** 480px from the right over a 50% ink scrim; 72px header; scrolling lines; fixed footer.
- **Phone (under 768px):** single column, 16px margins, 56px header with search, cart badge and menu; hero text first then a 440px photo; the axis becomes stacked rows with full-width bars; kit slots 2 by 2.
- **Tablet (768 to 1023px):** 32px margins; the phone header (logo, search, cart badge, menu sheet) per PRD F1; hero text above a full-width 560px photo; the axis keeps a 150px label column with each bar under its name; the featured product and product page put the stage full width with details in two columns below; shop tiles 3 per row; kit teaser slots 4 in a row; the kit builder form in two columns with its four slots in a row; the cart as a full-screen sheet; footer in three columns. From 1024px the desktop layout applies.
- **Overlays:** search drops from the top on desktop (88px bar, results list in columns 1-8, layer links in 10-12, 50% ink scrim) and fills the screen on phones; the phone menu and cart are full-screen sheets.

## 5. Motion

| What | How | Why |
|---|---|---|
| Photo / Thermal | instant swap; both images preloaded after first interaction | a cut reads as switching instruments |
| Colourway flood | instant background and image change | decisive; the colour is the news |
| Kit warmth | the figure cross-fades between levels over 360ms, `cubic-bezier(0.16, 1, 0.3, 1)` | warmth spreading is the one eased moment |
| Cart drawer | slides in 220ms ease-out; scrim fades 180ms | orientation |
| Add to cart | button shows "Adding", then the drawer opens | feedback |
| Buttons | `:active` translateY(1px) | tactility |
| Everything | `prefers-reduced-motion: reduce` makes every transition instant | required |

No entrance animations on scroll, no parallax, no marquee, no custom cursor.

## 6. Components

- **Button primary:** ember, white 16/600, 48px (52 in the drawer, product and kit), 24px padding, pill. Hover ember-hover.
- **Button secondary:** 1.5px ink border, transparent, ink text; hover fills ink with snow text.
- **Chip:** 40px, snow, 1.5px line border; pressed: ink fill, snow text; `aria-pressed`.
- **Segmented switch (Photo / Thermal):** mist track, 3px padding, 34px pills; selected is ink with snow text; two `<button>`s with `aria-pressed` inside `role="group"`.
- **Size pill:** Martian Mono 13, min 52 by 44px. Selected ink. Sold out: dashed `#b7bec5` border, ghost text, line-through, `aria-disabled="true"`, accessible name "XS, sold out".
- **Swatch:** 40px circle of the colour, 2px frost inner border, 2px ink outline when selected; accessible name is the colour name; the selected name is printed above ("Colour: Moss").
- **Range bar:** square; track mist (only on product and tile bars; the home axis has no track), fill is a linear gradient between the heat colours at its two ends.
- **Stock line:** Martian Mono 13, `role="status"`: "Only 3 left in M", "M in stock", "Pick a size".
- **Quantity stepper:** pill with a 1.5px line border, 36px round buttons, the plus disabled at stock.
- **Kit slot:** label (mono 12), image 4:5, name, price, swap and remove icon buttons (36px, labelled). Empty: dashed `#9aa3ab` border, the reason, "Add one anyway".
- **Logo:** `brand/mark.svg` plus the wordmark in live text. Clear space equals one band height; minimum 16px.

## 7. Artboards

Frozen at canvas version 19 (1 Oct 2026). Reference PNGs of every artboard are in `design/frames/`. Rows on the canvas: Desktop, Tablet, Phone, System. Each artboard's height is its content height in the default state, so it can be used as a fidelity baseline as is.

| Artboard | File | Size | Defines |
|---|---|---|---|
| Home, desktop | `design/Main.dc.html` | 1440x4560 | hero with the thermal switch, layer axis, featured product, kit teaser, fabric band, footer |
| Product page | `design/Product.dc.html` | 1440x1720 | gallery, thermal, colourway flood, sizes, size guide, accordions, finish the kit |
| Collection with filters | `design/Collection.dc.html` | 1440x2160 | filter bar, tiles, thermal grid, empty state |
| Kit builder | `design/Kit.dc.html` | 1440x1220 | inputs, thermal figure, coverage readout, slots, add kit; the reference kit rules |
| Cart drawer and test-checkout notice | `design/Cart.dc.html` | 1440x960 | grouped kit lines, stepper limits, empty state, the notice |
| Search overlay | `design/Search.dc.html` | 1440x960 | predictive results, empty and no-result states (Tweaks: query) |
| Search results | `design/SearchResults.dc.html` | 1440x1080 | `/search?q=`, tile grid, no-result state (Tweaks: query) |
| 404 | `design/NotFound.dc.html` | 1440x940 | "That trail doesn't go anywhere." |
| Credits | `design/Credits.dc.html` | 1440x2090 | photo, type and icon credits, retouch note |
| How this store was built (`/about`) | `design/Build.dc.html` | 1440x2870 | from the PRD: summary, the one-minute test (goal 1), what works (goal 2), the two signature features, stack, targets and results (goals 3 and 4, section 7), design match, what it doesn't do (non-goals); results are placeholders until measured |
| Home, tablet | `design/TabletHome.dc.html` | 768x4890 | tablet layout |
| Product page, tablet | `design/TabletProduct.dc.html` | 768x2340 | tablet layout |
| Collection, tablet | `design/TabletCollection.dc.html` | 768x2260 | tablet layout |
| Kit builder, tablet | `design/TabletKit.dc.html` | 768x1590 | form in two columns, readout beside the thermal figure, four slots in a row |
| Cart, tablet | `design/TabletCart.dc.html` | 768x1024 | full-screen cart sheet |
| Home, phone | `design/Mobile.dc.html` | 390x3850 | phone layout |
| Menu, phone | `design/MobileMenu.dc.html` | 390x844 | the menu sheet |
| Search, phone | `design/MobileSearch.dc.html` | 390x844 | full-screen search |
| Product page, phone | `design/MobileProduct.dc.html` | 390x2500 | phone product page |
| Collection, phone | `design/MobileCollection.dc.html` | 390x2630 | scrolling layer chips, 2-up grid |
| Kit builder, phone | `design/MobileKit.dc.html` | 390x2370 | form, readout, 2 by 2 slots, total bar |
| Cart, phone | `design/MobileCart.dc.html` | 390x844 | full-screen cart, notice and empty states |
| How this store was built, phone | `design/MobileBuild.dc.html` | 390x4830 | phone layout of `/about` |
| Brand | `design/Brand.dc.html` | 1440x1180 | lockups, favicon sizes, colour, thermal scale, type, controls |
| Loading and error states | `design/States.dc.html` | 1440x2226 | skeletons, add-to-cart states, store down, cart error, sold-out kit slot, missing thermal |
| Social card | `design/OGCard.dc.html` | 1200x630 | 1200x630 |

Icons: Phosphor, regular weight (`MagnifyingGlass`, `Tote`, `List`, `X`, `ArrowRight`, `ArrowsLeftRight`, `CaretDown`, `Minus`, `Plus`). The artboards draw a few of these inline as stand-ins.
