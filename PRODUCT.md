# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, Server Components, server actions for cart mutations), React 19, TypeScript, Tailwind CSS v4, Zod. Product data from the Shopify Storefront API (GraphQL) on a free Shopify Partners development store owned by the user. Checkout is Shopify-hosted (handoff via `cart.checkoutUrl`). Hosted on Vercel's free tier. Chosen by the user from a recommendation.

## Users

- **In-story visitor: a hiker, climber or trail runner in the US** buying technical outer layers. They know roughly what they need (a shell for wet weather, a warm midlayer) but not how pieces combine, and they compare fit, weight, waterproof rating and price before buying. Most arrive on a phone.
- **Real audience: hiring clients on Upwork reviewing Daniel's portfolio.** Brands and agencies posting "headless Shopify / Next.js storefront" jobs, plus Shopify merchants who want a faster, more custom store than a theme gives them. They open the link from a portfolio card, add something to the cart, and decide in a minute whether Daniel can build their store.

## Product Purpose

The online store for **Scaur**, a fictional US brand of technical mountain apparel built as a layering system. Every piece belongs to one layer (base, mid, insulation, shell) and carries a conditions rating. Besides the standard store (home, collections with filters, product pages with size and colour variants, cart, Shopify checkout), its signature feature is the **kit builder**: the visitor picks their conditions and activity, and the store assembles a layered kit they can adjust and add to the cart in one action.

Success for the in-story visitor: they leave with a kit that works together, in the right sizes, without guessing. Success for the real audience: they complete a real add-to-cart and checkout handoff on a fast store, and believe Daniel can ship their headless Shopify build.

## Positioning

Most outdoor stores sell pieces one at a time and leave the customer to work out what layers together. Scaur sells a system: each product states its layer and the conditions it is for, and the kit builder puts compatible pieces together. For the portfolio, it proves the hard parts of commerce work (variant selection, per-variant stock, a multi-line cart built in one action, filters that sync with the URL) on a real Shopify backend, not mock data.

## Operating Context

- Mobile-first: most in-story visitors shop on a phone; hirers open it on either.
- Core paths: home → collection (filter by layer, activity, size, colour) → product (choose size and colour) → cart → checkout; and home → kit builder → cart → checkout.
- Product data, prices, stock and images are managed in the Shopify admin of the user's development store and read through the Storefront API.
- Checkout is Shopify's, with test payments (Shopify's Bogus Gateway). Development stores are password protected, which can block the checkout handoff; the build must verify this and handle it honestly (see Capabilities).

## Capabilities and Constraints

Confirmed:
- Home, collection pages with filters synced to the URL, product pages with size and colour variants and per-variant availability, a slide-over cart, and the checkout handoff.
- The kit builder (conditions and activity in, a layered kit out, one action to add the whole kit to the cart).
- Search across products.
- Size guide on product pages.
- Logo, favicon and social card designed as part of the project.

Hard constraints:
- **Zero running cost.** Free Shopify Partners development store, Vercel free tier, no paid apps or APIs.
- **No real brand imitated.** Scaur, its products and figures are fictional and labelled as a demo in the footer. The name was checked against existing apparel brands.
- **No real payments.** Test checkout only; the demo says so before handing off to checkout.
- **Imagery is real photography** from free-licence sources, credited in `ATTRIBUTION.md`, uploaded to the Shopify store as product media.
- Prices in USD; sizes XS to XXL.

Undecided: customer accounts (Shopify's Customer Account API) are out of scope for v1. Decided since: the whole kit lives in the URL, so kits are shareable.

## Brand Commitments

- Name: **Scaur** (an old northern English and Scots word for a steep, rocky crag). Pronounced "skar".
- Logo, favicon and social card are created for this project.

## Evidence on Hand

- No reviews, ratings, customer counts, athlete endorsements, lab results or sustainability certifications exist. Technical figures (waterproof ratings, weights, fabric specs) are authored demo content and must be labelled as illustrative; nothing is presented as a tested claim.
- Photography: free-licence stock, credited.

## Product Principles

1. **Sell the system, not the item.** Every product says which layer it is and what conditions it is for.
2. **Never make them guess.** Size, stock, price and what's in the cart are always clear before they commit.
3. **Fast on a phone on a trail-head signal.** Content and product images first; nothing blocks buying.
4. **Honest demo.** Test checkout, illustrative specs, fictional brand, all stated plainly.

## Accessibility & Inclusion

WCAG 2.2 AA. Variant pickers, filters, the cart drawer and the kit builder are fully keyboard and screen-reader operable; out-of-stock variants are announced, not only greyed; colour swatches carry text names. Respects `prefers-reduced-motion`.
