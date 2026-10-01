# Scaur: design intake

## Source

- **Design canvas, not Figma.** An original design made on a Claude Design canvas:
  https://claude.ai/artifact/R5AhczuNRCuA7FeF1R5V4L (private until shared). The README says
  "Design: original".
- **Frozen at canvas version 19 on 1 Oct 2026.** Any change after this is a change note in
  this file, and its artboard and frame are re-exported.
- **Change notes:**
  - Version 21 (1 Oct 2026): Build and MobileBuild, the "Data checks" line now reads "Every
    URL parameter and cart request is checked on the server." (Zod dropped from the stack.)
    Frames re-rendered.
- **Markup:** `docs/design/*.dc.html`, one file per artboard, plus `docs/design/canvas.json`
  (artboard sizes). The artboards are interactive, so their scripts show intended behaviour.
- **Reference frames:** `design/frames/<Artboard>.png`, rendered locally at each artboard's
  exact size with the canvas runtime (`design/canvas-render/`, not committed). These are the
  fidelity baselines.
- **Tokens:** `docs/DESIGN-SPEC.md` sections 2 to 6, which match the artboards' styles.

## Frames to routes

| Route | 1440 | 768 | 390 |
|---|---|---|---|
| `/` | Main (4560) | TabletHome (4890) | Mobile (3850) |
| `/shop` | Collection (2160) | TabletCollection (2260) | MobileCollection (2630) |
| `/products/[handle]` (Scarp Shell drawn) | Product (1720) | TabletProduct (2340) | MobileProduct (2500) |
| `/kit` | Kit (1220) | TabletKit (1590) | MobileKit (2370) |
| Cart drawer | Cart (960) | TabletCart (1024) | MobileCart (844) |
| Search overlay | Search (960) | uses the phone sheet | MobileSearch (844) |
| `/search?q=` | SearchResults (1080) | fluid from 1440 | fluid from 390 |
| `/about` | Build (2870) | fluid | MobileBuild (4830) |
| `/credits` | Credits (2090) | fluid | fluid |
| 404 | NotFound (940) | fluid | fluid |
| Menu sheet (under 1024) | none | MobileMenu | MobileMenu (844) |
| Social card | OGCard (1200x630) | | |
| System | Brand, States | | |

**Widths between frames:** phone layout under 768; tablet layout 768 to 1023 (phone-style
header with the menu sheet, per PRD F1); desktop from 1024, with a 1440 maximum container
(48px margins, 12 columns, 24px gutters). Fluid in between each pair. Pages marked "fluid"
have no drawn frame at that width and follow the same rules; they are not measured there.

## States

Drawn as interactive states (captured by driving the artboard in the renderer):
- Shop: every filter, the thermal grid, "Nothing here is made for 80°F".
- Product: Tide colourway with XS and XXL sold out, "Only 1 left in XL", size guide open,
  thermal view, each accordion.
- Kit: every input combination, removed slot with "Add one anyway", swaps, "Kit added".
- Cart: kit group plus a loose line, stepper at stock, test-checkout notice, empty cart.
- Search: results, nothing typed, no results (Tweaks: query).

Drawn on the States sheet: loading skeletons (grid and product), Adding, add failed, store not
responding, cart update failed, kit slot sold out, missing thermal image.

Defined in DESIGN-SPEC rather than drawn: hover (ember-hover on primary, ink fill on secondary),
focus (2px ember ring, 2px offset), pressed (translateY 1px), reduced motion.

## Fonts and assets

- Archivo (width axis 62 to 125) and Martian Mono (width 75 to 112.5), Google Fonts, OFL, via
  `next/font`.
- Icons: `@phosphor-icons/react`, regular weight. The artboards draw a few inline as stand-ins.
- Photos: `assets/photos/*.jpg` (16). Five were edited or replaced on 1 Oct 2026 to remove
  third-party logos (ATTRIBUTION.md); the originals are in `_backups/`, outside the repo.
- Thermal images: generated at build by `scripts/thermal.mjs` (ARCHITECTURE section 7). The
  canvas's thermal images were checked against the same recipe (mean difference 1.6 of 255).
- Brand: `brand/` (mark, reversed and one-colour marks, 16 and 32px favicons).

## Data the design assumes

Stock, prices and colours in the artboards match `content/catalog.json`, which seeds the
Shopify store, so the built pages should show the same numbers. The header cart count (2) and
the cart contents are a demo scenario: fidelity runs either seed the same cart or mask the
count badge, and the report says which.

## Questions and assumptions

1. **Photos for the Shopify import.** `content/shopify-products.csv` now points at
   `raw.githubusercontent.com/Boskiomoh/scaur/dev/assets/photos/…` so the store gets the edited
   photos, not the Unsplash originals with logos. This needs the public repo (WORKFLOW step B)
   pushed **before** the import (Phase 0.2). Assumption until confirmed: repo `Boskiomoh/scaur`,
   branch `dev`. The original CSV is backed up in `_backups/scaur-photos-2026-10-01/`.
2. **Thermal images for the build** come from `public/thermal/` (generated), not from Shopify.
3. **Tablet Search and Menu** reuse the phone sheets at 768; not drawn separately.
4. **Pages without frames at a width** (credits, 404, search results at 768 and 390, `/about`
   at 768) are built fluid and checked for overflow, not pixel-compared.
