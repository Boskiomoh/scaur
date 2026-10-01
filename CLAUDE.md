# Scaur

A headless Shopify storefront for a fictional brand of technical mountain apparel sold as a layering system, with a kit builder and illustrative thermal views. Portfolio project for Daniel Omoyibo. Next.js 16 plus the Shopify Storefront API on a free development store.

## Read before working

1. `PRODUCT.md`: audience, constraints, honesty rules.
2. `docs/PRD.md`: routes, features with acceptance criteria, states, the catalog (Appendix A).
3. `docs/ARCHITECTURE.md`: stack, folders, the Shopify data layer, the kit rules (section 5), cart, thermal images, caching, tests.
4. `docs/DESIGN-SPEC.md`: tokens, type, layout, motion, components. Reference markup in `docs/design/*.dc.html` (interactive; their scripts show intended behaviour).
5. `docs/WORKFLOW.md`: build one lettered step at a time; do only the step asked for.
6. The `nextjs-house-style` skill: folder layout, naming, component anatomy, state, styling and formatting rules for all code. ARCHITECTURE section 3 is written to match it. The `figma-to-code` skill covers intake (`design/INTAKE.md`) and fidelity measurement against `design/frames/`.

PRD wins on behaviour, DESIGN-SPEC wins on looks. `docs/design/Kit.dc.html` and ARCHITECTURE section 5 must agree on the kit rules; if they ever differ, ask.

This Next.js version has breaking changes from older training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing framework code (caching, `searchParams`, Server Actions, `proxy.ts`).

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm test            # vitest
npm run test:e2e    # playwright (needs .env.local with the Shopify vars)
npm run build       # prebuild runs scripts/thermal.mjs and scripts/brand.mjs
```

## Non-negotiables

- **Zero running cost.** Vercel Hobby, the Shopify development store, no paid apps or APIs.
- **Shopify is the source of truth** for products, prices, stock, images and the cart. No local product database; `content/catalog.json` is seed data and the thermal map only.
- **Secrets stay on the server.** The Storefront private token is only read in `server-only` modules. Never add an Admin API token to the app.
- **The server guards the cart.** Every cart action re-checks variant availability and stock before calling Shopify.
- **State that people share lives in the URL:** shop filters, colour and size, the whole kit.
- **Thermal colour is data, not decoration.** The ironbow scale appears only on ratings, range bars, thermal images and the kit figure.
- **Design tokens only.** No raw hex in components. Pills for anything you press, square corners for media and panels. No shadows, blur, glass or decorative gradients.
- **Accessibility is part of done.** WCAG 2.2 AA, axe clean, keyboard-complete cart drawer and kit builder, sold-out variants announced.
- **Honesty.** Scaur is fictional: keep the footer disclaimer, `noindex`, "illustrative" labels on specs and thermal views, and the test-checkout notice. Credit photos in `ATTRIBUTION.md`.
- **UI copy has no em dashes.** Ranges use "to" or a hyphen.
- **No new dependencies** beyond ARCHITECTURE section 2 without asking.
- **Performance budgets** are in PRD section 7; check them before calling a step done.

## How to work

- Finish the whole WORKFLOW step, including its "Done when" check, and report real command output.
- For UI, use the `impeccable` skill (`/impeccable critique`, `audit`, `polish`) against `.impeccable/surfaces/app-page-tsx.md`; use `ui-ux-pro-max` for states and flows.
- Do not commit or push unless asked.
