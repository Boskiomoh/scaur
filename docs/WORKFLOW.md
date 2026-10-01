# Scaur build workflow, A to Z

Build Scaur with Claude Code in Antigravity's terminal, one lettered step at a time. Each step has a goal, a prompt to paste, and a "Done when" check. Don't move on until the check passes. Steps marked **(you)** are done by you in a browser.

**Every session**
- Run `claude` from `C:\Users\Dell\Personal Projects\scaur`. It loads `CLAUDE.md`, which points at the docs.
- Start each step with `/clear`; the docs carry the context between steps.
- Use plan mode (Shift+Tab) for steps F, J, K and L.
- After a step passes, ask Claude to commit it.
- Keep the design open to compare against: https://claude.ai/artifact/R5AhczuNRCuA7FeF1R5V4L
- Model: Opus 5.5 (`/model claude-opus-5-5`) for F, J, K, L and V; Sonnet 5 is fine for page and content steps.

---

## Phase 0: The Shopify store (you, about 30 minutes)

### 0.1 Partner account and development store (you)
1. Sign up free at **partners.shopify.com** (the Shopify Partner Program).
2. In the Dev Dashboard, go to **Stores**, then **Create store**, then **Dev**. Name it `scaur-demo` (the myshopify address can't be changed later). Any plan works; country **United States**, currency **USD**.
3. Log in to the new store's admin.

### 0.2 Import the products (you)
Do this after step B: the CSV loads photos from the public repo (`raw.githubusercontent.com/Boskiomoh/scaur/dev/assets/photos/`), so the store gets the logo-free edits rather than the Unsplash originals.

1. **Products**, then **Import**, then choose `content/shopify-products.csv`, then **Upload and preview**, then **Import products**.
2. Check a couple of products: 11 products, sizes XS to XXL, Scarp Shell and Bothy Pile Jacket with two colours each, photos present.
3. If any photos didn't import (Shopify occasionally rejects a remote URL), open that product, **Add media**, and upload the matching file from `assets/photos/` (the map is in `content/catalog.json`).

### 0.3 Headless channel and API token (you)
1. Install the **Headless** sales channel from the Shopify App Store (free, by Shopify), then **Create storefront**.
2. In the storefront's **Storefront API** permissions, make sure these are on: read products and collections, **read product inventory** (needed for "Only 3 left"), and read and write carts/checkouts.
3. Copy the **private access token** and your store domain (`scaur-demo.myshopify.com`).
4. **Products**, select all, **More actions**, **Include in sales channels**, tick **Headless**.

### 0.4 Test payments, shipping and the password (you)
1. **Settings**, **Payments**: if a card provider is active, deactivate it; then **Choose a provider**, **(for testing) Bogus Gateway**, **Activate**.
2. **Settings**, **Shipping and delivery**: add a flat US rate (for example "Standard, $8", free over $150) so checkout can complete.
3. **Online Store**, **Preferences**: copy the store password (dev stores always have one and it can't be removed).

### 0.5 Env file (you)
Create `C:\Users\Dell\Personal Projects\scaur\.env.local`:
```
SHOPIFY_STORE_DOMAIN=scaur-demo.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=<private token from 0.3>
SHOPIFY_STOREFRONT_API_VERSION=2026-07
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_PASSWORD=<password from 0.4>
```

**Done when:** the products show in the Headless channel and `.env.local` exists (never commit it).

---

## Phase 1: Foundations (A to E)

### A. Orientation
> Read CLAUDE.md, PRODUCT.md, ATTRIBUTION.md and everything in docs/. Summarise in 10 bullets: the direction, the four layers and the shared axis, the kit rules and the worked example, how layer/range/warmth are stored in Shopify, the cart rules, the thermal pipeline, and the budgets. No code.

**Done when:** the summary gets the worked example right (hike, 38°F, steady rain, breezy: quarter-zip, grid fleece, Belay Hoody, Scarp Shell, $782, comfortable down to 10°F).

### B. Git and GitHub
> Initialise git with a Node .gitignore that also ignores .env*.local, test-results/, playwright-report/ and .impeccable/review/. Commit the docs, brand/, assets/ and content/. Create a public GitHub repo named scaur with gh and push.

**Done when:** the repo is on GitHub and `.env.local` is not in it.

### C. Scaffold
> Scaffold Next.js 16 (App Router, TS, Tailwind v4, ESLint, src dir, alias @/* to src/*) into ../scaur-scaffold, then move it in without overwriting PRODUCT.md, CLAUDE.md, ATTRIBUTION.md, docs/, brand/, assets/ or content/. Delete the temp folder. Install the packages in ARCHITECTURE section 2, turn on the React Compiler, add Prettier with the house-style defaults, and lay out src/ per ARCHITECTURE section 3. Add the scripts from CLAUDE.md, with prebuild running scripts/thermal.mjs and scripts/brand.mjs (create them as stubs for now).

**Done when:** `npm run dev` runs and `npm run typecheck` passes.

### D. Tokens, fonts and the shell
> Per DESIGN-SPEC sections 2 to 4: every token in globals.css @theme, the thermal stops in src/lib/heat.ts, Archivo and Martian Mono via next/font with the width axis, themed selection/focus/caret/scrollbars, and the root layout with noindex metadata. Build components/layout/ site-header (with mobile-menu and a search button stub) and site-footer with the disclaimer, and components/ui/ button, chip, segmented, accordion, skeleton, matching docs/design/Main.dc.html and Brand.dc.html.

**Done when:** header and footer match the artboard at 1440 and 390, the mobile menu traps focus, and the Brand artboard's controls are reproduced on a scratch page.

### E. Tests and CI
> Set up Vitest and Playwright (Chromium, WebKit, a 390px project, against next start). One passing test of each kind. Add .github/workflows/ci.yml running typecheck, lint, unit and build, with the Shopify vars from repository secrets; e2e runs locally for now.

**Done when:** CI is green on GitHub (add the three Shopify secrets in the repo settings first).

---

## Phase 2: Data and pages (F to J)

### F. Shopify client and catalog
> Implement src/lib/shopify/client.ts, queries.ts and schemas.ts, and src/lib/catalog.ts per ARCHITECTURE section 4, with unit tests for tag parsing and variant grouping. Add a script `npm run shopify:check` that lists every product with layer, range, warmth, colours and stock per size.

**Done when:** the check prints all 11 products with the values in PRD Appendix A, and the tests pass.

### G. Thermal and brand scripts
> Write scripts/thermal.mjs exactly per ARCHITECTURE section 7 and src/lib/thermal.ts with its test. Write scripts/brand.mjs to produce src/app/icon.svg, favicon.ico, apple-icon.png (180) and icon-512.png from brand/favicon.svg, plus the web manifest.

**Done when:** public/thermal/ has 14 photo thermals (every photo except the two fabric close-ups) and kit-0 to kit-4, they look like docs/design/Kit.dc.html's thermal views, and the favicon shows in the tab.

### H. Shop page
> Build /shop per PRD F6 and docs/design/Collection.dc.html: server-side filtering from searchParams, FilterBar (layer chips, Made for slider, live count, Photo/Thermal), ProductTile with the range bar, the empty state, and skeleton tiles.

**Done when:** every filter lives in the URL, reload and back restore the view, and 80°F shows the empty state.

### I. Product page
> Build /products/[handle] per PRD F7 and docs/design/Product.dc.html: generateStaticParams, Gallery with the colourway flood and thermal switch, VariantPicker (sold-out ghosts, colour change clears an unavailable size, URL-synced), stock line, SizeGuide, accordions, "Finish the kit", and product JSON-LD. Add to cart can be a stub until step J.

**Done when:** Scarp Shell in Tide shows XS and XXL as sold out and "Only 1 left in XL", and the URL reproduces the selection.

### J. Cart and the checkout notice
> Implement src/components/cart/actions.ts, the cart cookie, src/store/cart-store.ts with optimistic updates, the CartDrawer with kit grouping and stock-capped steppers, and the CheckoutNotice, per ARCHITECTURE section 6, PRD F8 and F9 and docs/design/Cart.dc.html. Wire add to cart on the product page and the home featured product.

**Done when:** adding, changing quantity and removing work and survive reload; the plus button stops at stock; the server rejects a forced over-stock request; "Continue to checkout" lands on Shopify's checkout with the right lines.

---

## Phase 3: The signature features (K to N)

### K. Kit rules
> Implement src/lib/kit.ts exactly per ARCHITECTURE section 5 and make it agree with docs/design/Kit.dc.html. Write kit.test.ts covering every branch, the worked example and the sold-out fallback.

**Done when:** tests pass and the worked example returns the four products, $782, 10°F, level 4.

### L. Kit builder page
> Build /kit per PRD F10 and docs/design/Kit.dc.html: KitForm (state in the URL, works as a plain form without JS), KitFigure with the five warmth images cross-fading 360ms (instant under reduced motion), the comfortable-down-to readout and coverage bar, KitSlot with swap, remove and add back, and "Add kit to cart" calling addKit with the kit attributes.

**Done when:** one click adds a grouped kit to the cart, "Edit kit" in the drawer returns to the same kit, and a shared URL reproduces it.

### M. Home page
> Build the home page per PRD F2 to F5 and docs/design/Main.dc.html: Hero with the Photo/Thermal switch, LayerAxis from live data with a text equivalent, FeaturedProduct reusing the product components, KitTeaser using src/lib/kit.ts (wind Breezy), and the fabric band with the illustrative figures note.

**Done when:** it matches the artboard at 1440, the headline is the LCP element, and the teaser's slots match /kit for the same inputs.

### N. Search
> Build the search overlay (predictiveSearch, arrow-key navigation, Esc closes) and /search?q= reusing ProductTile, with designed empty and no-result states per PRD F11.

**Done when:** "down" finds the Cornice Down Jacket from the keyboard alone.

---

## Phase 4: Proof (O to U)

### O. Phone pass
> Implement the phone and tablet layouts from docs/design/Mobile*.dc.html and Tablet*.dc.html for every page (home, shop, product, kit, drawer, menu, search, about), per DESIGN-SPEC section 4. Test on a real phone over the LAN (`npm run dev -- -H 0.0.0.0`).

**Done when:** no horizontal scroll at 360px, every target at least 44px, and the drawer and kit builder work one-handed.

### P. States and resilience
> Implement every row of PRD section 6 and F13 that is still missing (add failed, Shopify down, missing thermal image, 404 "That trail doesn't go anywhere."). Then run /impeccable harden.

**Done when:** each state can be reached (simulate Shopify down with a bad token) and looks designed.

### Q. SEO, social card and credits
> Add per-route metadata, the sitemap and robots (noindex sitewide), src/app/opengraph-image.tsx built from docs/design/OGCard.dc.html, and /credits from ATTRIBUTION.md, and /about from docs/design/Build.dc.html.

**Done when:** a link preview (for example opengraph.xyz) shows the card, and view-source shows noindex.

### R. E2E suite
> Write the nine Playwright specs in ARCHITECTURE section 13.

**Done when:** all pass locally against a production build.

### S. Accessibility audit
> Run /impeccable audit on home, shop, product, kit and the open cart drawer. Fix every WCAG 2.2 AA issue, then rerun the axe specs.

**Done when:** zero axe violations, the whole purchase path works by keyboard, and NVDA or VoiceOver announces the cart count, filter count and stock line changes.

### T. Performance
> Build, run next start, and run Lighthouse mobile on /, /shop and /products/scarp-shell. Meet PRD section 7; report the initial JS size.

**Done when:** Performance 90+ and the other three scores 100 on all three pages.

### U. Deploy and a test order
> Walk me through deploying to Vercel: environment variables from ARCHITECTURE section 12 (NEXT_PUBLIC_SITE_URL set to the alias), turning off Deployment Protection for Production, and adding a stable alias.

Do the dashboard steps yourself. Then, from the production URL in a logged-out private window: add a kit, go to checkout, enter the store password if asked, and place **one** test order with card `1`. Check it appears under Orders in the Shopify admin. Don't place more; dev stores cap test orders.

**Done when:** the production site loads logged out and your one test order went through.

---

## Phase 5: Finish (V to Z)

### V. Final design review
> Run /impeccable critique and /impeccable audit on production against .impeccable/surfaces/app-page-tsx.md and fix material findings in one batch.

**Done when:** the review verdict is ship.

### W. DESIGN.md
> Run /impeccable document to write DESIGN.md from the finished build.

**Done when:** DESIGN.md and .impeccable/design.json exist.

### X. README and capture
> Write README.md: what it is, the live link, a 20-second screen recording (flip a product to thermal, build a kit, add it, open the drawer) as an optimised MP4 or GIF, three screenshots (home, kit builder, product page), the stack, how the Shopify data is modelled (type and tags), the kit rules in brief, the performance and accessibility numbers, how to run it against your own dev store, and credits linking ATTRIBUTION.md.

**Done when:** someone could judge the project from the README in 30 seconds.

### Y. Upwork portfolio entry
Upwork, then Portfolio, then + Add:

- **Project title** (55/70): `Scaur — Headless Shopify Store with a Layer Kit Builder`
- **Your role:** `Frontend Engineer`
- **Project description:** paste the text below (character count in the line under it).

```
A headless Shopify store for a fictional outdoor brand, built with Nextjs on Shopify's Storefront API and a real development store. Every product is a base, mid, insulation or shell layer on one temperature scale. The kit builder takes the activity and weather, picks one piece per layer in your size and adds the whole kit to the cart in one action. Product photos flip to an illustrative thermal view. Per-variant stock, sold-out sizes, filters kept in the URL and a keyboard-friendly cart drawer all run on live Shopify data.
```

  (528/600.) "Nextjs" is spelled without the dot on purpose: Upwork's link filter blocks "Next.js" in free text.
- **Skills (5):** Shopify, Next.js, React, TypeScript, E-commerce Website Development (take the nearest match the dropdown offers)
- **Content:** the production link, the recording from step X, and the three screenshots.

**Done when:** the entry is published and the link opens logged out.

### Z. Portfolio order
Put Scaur first or second in your portfolio. With Harborline (SaaS), Meridian (admin and testing), Lacquer & Co (performance rescue) and Fenn One (3D), it covers the e-commerce work that most frontend jobs on Upwork ask for.

**Done when:** the portfolio shows Scaur near the top with its recording as the cover.
