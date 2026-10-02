# Scaur PRD

Product requirements for **Scaur**, a headless Shopify storefront for a fictional brand of technical mountain apparel sold as a layering system. Portfolio project for Daniel Omoyibo.

- Design: original, made for this project. Reference copies: [`design/`](design/).
- Product truth: [`../PRODUCT.md`](../PRODUCT.md)
- Build docs: [`ARCHITECTURE.md`](ARCHITECTURE.md), [`DESIGN-SPEC.md`](DESIGN-SPEC.md)
- Seed data: [`../content/catalog.json`](../content/catalog.json), [`../content/shopify-products.csv`](../content/shopify-products.csv)

---

## 1. Summary

Scaur sells jackets and layers as one system. Every product is a **base, mid, insulation or shell** layer and carries a temperature range on one shared scale (-10°F to 80°F). The store has the standard commerce path (home, shop with filters, product pages with colour and size variants, a cart drawer, Shopify checkout) plus two signature features:

1. **Thermal view.** Any product photo flips into an illustrative thermal image, so a shopper sees what a layer is for.
2. **Kit builder.** The shopper picks activity, temperature, rain and wind; the store picks one piece per layer, skips what isn't needed, lets them swap or remove pieces, and adds the whole kit to the cart in one action.

All product data, prices, stock and images come from a real Shopify development store through the Storefront API. Checkout is Shopify's, in test mode.

## 2. Goals and non-goals

**Goals**
1. A hirer can add a product and a kit to the cart and reach Shopify checkout in under a minute, on a phone.
2. The hard commerce parts visibly work: variant selection with per-variant stock, sold-out handling, a multi-line cart added in one action, filters that live in the URL, quantity limits from real inventory.
3. Lighthouse mobile: Performance 90+, Accessibility, Best Practices and SEO 100 on home, shop and a product page.
4. $0 per month to run.

**Non-goals**
- Customer accounts, wishlists, reviews, subscriptions, multi-currency, discounts UI.
- A custom checkout (Shopify's hosted checkout is used, as it should be).
- Real payments or fulfilment.
- Any claim presented as real: no reviews, ratings, customer counts, lab results or certifications.

## 3. Audience

| Who | Situation | Needs |
|---|---|---|
| Hiker, climber or trail runner (in-story) | On a phone, knows roughly what they need, unsure how pieces combine | Clear layer and temperature info, the right size in stock, a kit that works together |
| Upwork hirer (real) | Opened the portfolio link, will poke at it for a minute | Speed, a working cart and checkout handoff, polish, evidence of Shopify competence |

## 4. Routes

| Route | Page | Artboard |
|---|---|---|
| `/` | Home | `Main.dc.html`, `TabletHome.dc.html`, `Mobile.dc.html` |
| `/shop` | All products; `?layer=base|mid|insulation|shell` and `?t=<°F>` filters; `?view=thermal` | `Collection.dc.html`, `TabletCollection.dc.html`, `MobileCollection.dc.html` |
| `/products/[handle]` | Product page; `?colour=` and `?size=` in the URL | `Product.dc.html`, `TabletProduct.dc.html`, `MobileProduct.dc.html` |
| `/kit` | Kit builder; its whole state in the URL | `Kit.dc.html`, `TabletKit.dc.html`, `MobileKit.dc.html` |
| `/search?q=` | Search results (same tile grid as `/shop`) | `Search.dc.html` (overlay), `SearchResults.dc.html` |
| Cart | Slide-over drawer on every page (no `/cart` page needed; `/cart` redirects home and opens it) | `Cart.dc.html`, `TabletCart.dc.html`, `MobileCart.dc.html` |
| `/credits` | Photo and font credits (from `ATTRIBUTION.md`) | `Credits.dc.html` |
| `/about` | How this store was built: stack, method, targets and results, fidelity results, repo link | `Build.dc.html`, `MobileBuild.dc.html` |
| `404` | "That trail doesn't go anywhere." with links to Shop and the kit builder | `NotFound.dc.html` |

## 5. Features and acceptance criteria

### F1. Header and navigation
- 64px bar: logo (home), Base, Mid, Insulation, Shell (each `/shop?layer=`), Kit builder, a search button, and "Cart" with the live item count.
- Under 1024px: logo, search, cart icon with count badge, and a menu button opening a full-height sheet. Focus is trapped in the sheet; Esc closes it.
- **Done when:** keyboard operable, `aria-current` on the active section, fits one line at 1024px.

### F2. Home hero with the Photo / Thermal switch
- Left: "Four layers. One system." (two lines), the subline, "Build your kit" (primary) and "Shop layers" (secondary).
- Right: the Scarp Shell photo with a Photo / Thermal segmented switch beneath it. Thermal swaps to the pre-rendered thermal image and shows a Cooler to Warmer scale and "Illustrative thermal view, not a measurement."
- Photo mode caption: "Scarp Shell in Moss", its live price from Shopify, and "View the shell".
- **Done when:** the headline is the LCP element, the switch is two real buttons with `aria-pressed`, the swap causes no layout shift, and reduced motion swaps instantly.

### F3. One scale for every layer
- A shared temperature axis (-10°F to 80°F, ticks every 10°F, the thermal gradient under it) and four rows (Base, Mid, Insulation, Shell), each with a thumbnail, piece count and one range bar per product, labelled with name and range.
- Ranges come from product tags (`temp-lo:`, `temp-hi:`); see ARCHITECTURE section 4.
- **Done when:** every product appears on the axis with its real tag values, rows link to `/shop?layer=`, and the chart has a text equivalent (a visually hidden list of product and range).

### F4. Featured product (Scarp Shell)
- Stage flooded with the chosen colourway's colour (Moss #3f5a45, Tide #2d5d8f) in one hard cut, photo inset 48px.
- Colour swatches (with names), size pills, stock line, "Add to cart", "Add to a kit".
- **Done when:** it uses the same variant-picker and add-to-cart components as the product page (F7).

### F5. Kit teaser (home)
- Activity chips, a temperature slider (the temperature label grows with severity), rain chips, and four slots showing what the kit builder would pick, using the exact rules in `lib/kit.ts` with wind fixed at Breezy. "See my kit" links to `/kit` carrying the chosen state.
- **Done when:** the slots always match what `/kit` shows for the same inputs.

### F6. Shop (collection) with filters
- Title and one-line blurb per layer; filter bar with layer chips (All, Base, Mid, Insulation, Shell), a "Made for" temperature slider (-10°F to 80°F, step 5, "Any" by default), a live product count, and a Photo / Thermal switch for the whole grid.
- Tiles: image (4:5), name, price, layer and colour count, range bar on the shared axis, "Made for X to Y°F".
- Every filter is in the URL (`?layer=mid&t=40&view=thermal`); back and forward restore state; results are server-rendered.
- Empty state: "Nothing here is made for 80°F", a helpful line, and "Clear filters".
- **Done when:** filters are keyboard operable, the count is announced in a live region, and a shared URL reproduces the view.

### F7. Product page
- Gallery: stage (flooded with the colourway colour for the lifestyle shot, neutral for detail shots), thumbnails, Photo / Thermal switch (thermal applies to the lifestyle shot).
- Info: layer link, name, price, "Made for" range with a bar on the shared axis, colour swatches with names, size pills, stock line, size guide (inline disclosure with a measurement table), "Add to cart", "Build a kit around it", demo note, accordions (Fabric and fit, Features, Care).
- Variant rules: sold-out sizes stay visible as dashed, struck-through ghosts with `aria-disabled` and "sold out" in their accessible name; if the chosen size is sold out in a newly chosen colour, the selection clears and the button reads "Choose a size". Stock line prints "Only N left in M" when 3 or fewer, else "M in stock".
- "Finish the kit": the other three layers' default picks for a mild wet day, and "Add all three in <size>".
- Colour and size live in the URL.
- **Done when:** a sold-out variant can't be added by any path (UI or server action), the price and stock always match the selected variant, and the page is statically generated per handle and revalidated.

### F8. Cart drawer
- Opens from the header and after any add; `role="dialog"`, `aria-modal`, focus trapped, Esc and the close button return focus to the opener.
- Lines: image, name, colour and size, line total, a quantity stepper (the plus button disables at available stock and prints "Only N left in this size"), Remove.
- Lines added by the kit builder are grouped under "Kit: <activity>, <temp>, <rain>" with "Edit kit" (back to `/kit` with the same state).
- Subtotal; "Shipping and taxes are worked out at checkout."; "Checkout".
- Empty state: "Your cart is empty" with "Build your kit" and "Shop layers".
- Updates are optimistic and reconciled with the server response; a failed update rolls back and shows an inline error on that line.
- **Done when:** the cart survives reloads (cart id in a cookie), quantities can't exceed stock, and the drawer is fully keyboard and screen-reader operable.

### F9. Test-checkout notice
- "Checkout" first shows, inside the drawer: "This is a test checkout", that there is no need to place the order, the test card for anyone who wants to (Bogus Gateway: card number `1`, any future date, any 3-digit code), and the store password with a note that Shopify may ask for it because development stores are private. "Continue to checkout" goes to `cart.checkoutUrl`; "Back to cart" returns.
- Development stores reportedly cap test orders (around 10), so the notice steers visitors away from placing orders; reaching Shopify's checkout page is the demonstration.
- **Done when:** Continue lands on Shopify's checkout with the right lines, and one test order placed by you from production succeeds.

### F10. Kit builder
- Inputs: Activity (Trail run, Day hike, Alpine climb), Temperature at the start (-10°F to 70°F slider; the number grows with severity; word: Mild, Cool, Cold, Bitter), Rain (Dry, Showers, Steady rain), Wind (Calm, Breezy, Gusty), Your size.
- Output: the thermal figure (five pre-rendered warmth levels), "Your kit is comfortable down to X°F", a coverage bar with a marker at the start temperature, a summary sentence, and four slots (Base, Mid, Insulation, Shell). A filled slot has image, name, price, Swap (cycles that layer's products) and Remove. An empty slot says why ("No insulation needed at 48°F") and offers "Add one anyway".
- Footer: piece count and size, total, "Add kit to cart" (one `cartLinesAdd` call with every line, each carrying kit attributes), then a status line.
- Rules: `src/lib/kit.ts` (ARCHITECTURE section 5), identical to `docs/design/Kit.dc.html`. Every input and override is in the URL so a kit can be shared.
- If a picked product is sold out in the chosen size, the slot says so and offers the next product in that layer that is in stock.
- **Done when:** unit tests cover every rule branch, one click adds the whole kit, and the page works without JavaScript as a form that submits to the same URL.

### F11. Search
- Header search opens an overlay with an input and predictive results (products) from the Storefront `predictiveSearch` query; Enter goes to `/search?q=`.
- Empty and no-result states are designed ("No layers match 'parka'. Try 'down' or 'insulation'.").
- **Done when:** fully keyboard operable (arrow keys through results, Esc closes).

### F12. Brand
- Mark (four parallel bands rising like layers, the lowest in ember) in `brand/`; `favicon-16.svg` is the pixel-drawn 16px version; wordmark in live Archivo text.
- Favicon set generated at build: `icon.svg`, `favicon.ico`, `apple-icon.png` (180), `icon-512.png`, web manifest.
- Social card from `OGCard.dc.html` (1200x630) rendered at build.

### F13. States and resilience
- Loading: skeleton tiles and product-info blocks shaped like the real content; no spinners on page loads.
- Shopify unreachable: pages that were statically generated keep serving; dynamic calls show "The store isn't responding right now. Try again in a minute." with Retry; cart actions fail inline, never silently.
- Thermal image missing for a product: the switch is hidden for that product, not broken.

### F14. SEO and honesty
- Per-page metadata and Open Graph, product JSON-LD with `offers` (price, availability), sitemap, robots.txt.
- `robots: noindex, nofollow` sitewide: Scaur is fictional and must not appear in search as a real shop.
- Footer on every page: "Scaur is a fictional brand made for a portfolio. Products are listed on a Shopify development store; checkout runs in test mode and nothing ships. Specs and thermal views are illustrative. Photography from Unsplash, credited on the credits page."

## 6. States

| State | Behaviour |
|---|---|
| Sold-out variant | Ghost pill, not selectable, announced as sold out |
| Low stock (3 or fewer) | "Only N left in M" |
| Add in progress | Button shows "Adding" with `aria-busy`; drawer opens on success |
| Add failed | Inline error under the button: "Couldn't add that. Try again." |
| Quantity at stock limit | Plus disabled; "Only N left in this size" |
| Empty cart | F8 empty state |
| Empty filter result | F6 empty state |
| Kit slot sold out | Slot explains and offers the next in-stock product |
| Shopify down | F13 |
| 404 | "That trail doesn't go anywhere." |

## 7. Non-functional requirements

- **Performance (Lighthouse mobile):** LCP under 2.0s, CLS under 0.02, TBT under 200ms, initial JS under 120 KB gzip. Images via `next/image` from Shopify's CDN with explicit sizes; thermal images as WebP.
- **Accessibility:** WCAG 2.2 AA; axe clean; targets at least 24px (44px for primary controls); focus ring 2px ember; all state changes announced where they matter (cart count, filter count, stock line, kit added).
- **Security:** the Storefront private token is server-only; no admin token in the app; cart id cookie is httpOnly, secure, sameSite=lax.
- **Browsers:** last two versions of Chrome, Edge, Firefox, Safari; iOS 17+.
- **Cost:** Vercel Hobby, Shopify development store, no paid apps.

## 8. Open questions

1. Customer accounts via the Customer Account API (v2).
2. A saved-kits gallery ("popular kits") (v2).
3. ~~Whether to add a "How this was built" page linking the repo.~~ Yes (1 Oct 2026): `/about`, designed from this PRD in canvas version 17 (`Build.dc.html`, `MobileBuild.dc.html`).

---

## Appendix A. Catalog (seed data; Shopify is the runtime source of truth)

| Handle | Layer | Price | Made for (°F) | Warmth | Colours | Shell role |
|---|---|---|---|---|---|---|
| tarn-merino-crew | Base | $78 | 40 to 75 | 1 | Slate Blue | |
| tarn-merino-quarter-zip | Base | $92 | 25 to 60 | 2 | Ember | |
| knoll-quarter-zip | Mid | $104 | 30 to 60 | 2 | Midnight | |
| knoll-grid-fleece | Mid | $118 | 25 to 55 | 2 | Cobalt | |
| bothy-pile-jacket | Mid | $148 | 15 to 45 | 3 | Bark, Oat | |
| belay-hoody | Insulation | $224 | 0 to 40 | 4 | Graphite | |
| cornice-down-jacket | Insulation | $268 | -10 to 35 | 5 | Signal Red | |
| squall-jacket | Shell | $168 | 40 to 75 | 1 | Ember | showers |
| ridgeback-softshell | Shell | $188 | 20 to 55 | 1 | Stone | wind |
| downpour-jacket | Shell | $198 | 35 to 70 | 1 | Olive | rain |
| scarp-shell | Shell | $348 | -10 to 60 | 1 | Moss, Tide | storm |

Sizes XS to XXL on every product. Per-variant stock, descriptions and photo mapping are in `content/catalog.json`; stock deliberately includes sold-out and low-stock variants so those states are demonstrable (Scarp Shell: XS sold out in both colours, XXL sold out in Tide, 1 left in XL Tide).

All specs, ratings and figures are illustrative and labelled as such on the site.
