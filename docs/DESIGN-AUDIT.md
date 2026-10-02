# Design audit

Audited canvas version 15 and resolved in version 16 (1 Oct 2026). Every artboard was
rendered locally at its own size and checked against DESIGN-SPEC.md, the PRD and the photo
credits.

## 1. Third-party brands in photos (fixed)

A full-size check of every photo found six with real logos or brand text:

| Photo | What showed | Fix |
|---|---|---|
| `shell-green-splash.jpg` (hero, Scarp Shell) | RECCO on the hood | Retouched |
| `base-orange.jpg` (Tarn Merino Quarter-Zip) | Wedze chest logo | Retouched |
| `insulation-red.jpg` (Cornice Down Jacket) | chest logo and "600" on the sleeve | Retouched |
| `shell-olive.jpg` (Downpour Jacket) | printed text on the sleeve | Retouched |
| `insulation-black-climb.jpg` (Belay Hoody) | "ICE F..." knitted into a beanie | Replaced with another Felicia Montenegro photo from the same shoot (fpxR4FzHGgI) |
| `shell-fog-ridge.jpg` | Arc'teryx and deuter logos | Never shown as a photo; only its blurred thermal versions are used, where nothing is readable |

Thermal versions of the changed photos were regenerated with the same mapping the canvas uses
(inverted brightness on the thermal scale). Originals are backed up offline. ATTRIBUTION.md and the credits page say
which photos were edited.

## 2. Consistency (fixed)

- Search icon added to the Kit header; every header search icon now opens the search overlay.
- Kit page: footer added; the empty gap under the "comfortable down to" readout closed.
- Cart: the kit group now holds all four kit pieces, with the shell in Moss M as the kit
  builder picks it; the "only 1 left" limit moved to the Belay Hoody.
- Home stock line now reads "Only 3 left in M" as the spec says (it read "M: 3 left"); the
  Brand type sample matches.
- Footer: dead links to Shipping and Contact (pages not in the PRD) replaced with Search and
  Test checkout; "Photo credits" and "How this store was built" now link to real artboards.
- Correction to the first pass: the Cart background is a live import of the Product page, not a
  redraw, so it cannot drift.

## 3. Artboard heights (fixed)

Home desktop (3620 tall, content 4557) and Home phone (3420, content 3845) were clipping their
fabric facts and footers on the canvas. Product (300px empty) and Kit were too tall. Every
artboard is now its content height in the default state, so it can be used as a fidelity
baseline as is.

## 4. Screens added (15)

Tablet at 768: Home, Product, Collection. Phone at 390: menu, search, Product, Collection, Kit,
Cart. Desktop: search overlay, search results, 404, credits, "How this store was built"
(PRD open question 3, pending your OK). A states sheet: loading skeletons, add-to-cart states,
store not responding, cart update failed, sold-out kit slot, missing thermal image.

The empty cart, checkout notice and collection with no matches were already on the canvas as
interactive states.

## 5. Follow-up (version 17)

- `/about` approved and redesigned from the PRD, desktop and phone.
- Kit builder and Cart drawn at 768.

## 6. Still open

- Two photos break the "people outdoors" style (Squall Jacket on a studio sweep, Bothy Pile on
  a wall). Optional.

## 7. Passes

Tokens, type (Archivo expanded 800 + Martian Mono), ember used only for primary actions, the
thermal scale kept for data, square photos with pill buttons, no em dashes in the copy, stock
and sold-out states, the disabled "+" at the stock limit, and the demo disclaimers.
