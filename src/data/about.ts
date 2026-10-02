export const repoUrl = "https://github.com/Boskiomoh/scaur";

// Served from public/fidelity (scripts/publish-evidence.mjs).
export const fidelityUrl: string | null = "/fidelity/report.html";

export const works = [
  {
    title: "Colour and size variants with live stock",
    body: "Sold-out sizes stay visible but can't be chosen; “Only 3 left in M” comes from real inventory.",
    where: "Product page",
    href: "/products/scarp-shell",
  },
  {
    title: "A whole kit added in one action",
    body: "Four lines go into the cart together and stay grouped as a kit you can edit.",
    where: "Kit builder",
    href: "/kit",
  },
  {
    title: "Filters that live in the URL",
    body: "Layer, temperature and Photo or Thermal are in the address, so a shared link opens the same view.",
    where: "Shop",
    href: "/shop",
  },
  {
    title: "Quantity limits from real inventory",
    body: "The plus button stops at the stock Shopify reports; failed updates roll back with a clear message.",
    where: "Cart",
    href: "/products/scarp-shell?colour=Tide&size=XL",
  },
  {
    title: "A cart that survives a reload",
    body: "The cart lives on Shopify and is found again from a secure cookie.",
    where: "Cart",
    href: "/shop",
  },
  {
    title: "Predictive search",
    body: "Results as you type, by name, layer or temperature, all by keyboard.",
    where: "Search",
    href: "/search?q=shell",
  },
  {
    title: "Shopify's real checkout, in test mode",
    body: "The cart hands over to Shopify. No card is charged and nothing ships.",
    where: "Checkout",
    href: "/kit",
  },
];

export const stack = [
  {
    name: "Framework",
    body: "Next.js 16 with the App Router, Server Components and Server Actions; React 19; TypeScript in strict mode.",
  },
  {
    name: "Commerce",
    body: "Shopify Storefront API on a development store, called from the server with a private token. No Shopify SDK: one typed fetch wrapper.",
  },
  {
    name: "Data checks",
    body: "Every URL parameter and cart request is checked on the server.",
  },
  {
    name: "Styling",
    body: "Tailwind CSS v4, with the design's colours, type and spacing as tokens.",
  },
  {
    name: "Tests",
    body: "Vitest for the kit rules and the catalogue parser; Playwright end-to-end tests with an axe accessibility check on every page.",
  },
  {
    name: "Hosting",
    body: "Vercel Hobby. No paid apps or services: it costs $0 a month to run.",
  },
];

// Results stay null until they are measured; nothing here is estimated.
export const targets: {
  name: string;
  target: string;
  result: string | null;
}[] = [
  { name: "Performance", target: "90+", result: null },
  { name: "Accessibility", target: "100", result: null },
  { name: "Best Practices", target: "100", result: null },
  { name: "SEO", target: "100", result: null },
  { name: "Largest paint (LCP)", target: "< 2.0 s", result: null },
  { name: "Layout shift (CLS)", target: "< 0.02", result: "0" },
  { name: "Initial JavaScript", target: "< 120 KB", result: "141-151 KB" },
  { name: "Running cost", target: "$0 / month", result: "$0 / month" },
];

export const fidelity: {
  name: string;
  desktop: string | null;
  tablet: string | null;
  phone: string | null;
}[] = [
  { name: "Home", desktop: "89.9%", tablet: "88.3%", phone: "79.9%" },
  { name: "Shop", desktop: "99.4%", tablet: "97.8%", phone: "96.8%" },
  { name: "Product", desktop: "97.1%", tablet: "94.6%", phone: "95.3%" },
  { name: "Kit builder", desktop: "96.1%", tablet: "85.4%", phone: "95.9%" },
];

export const limits = [
  "No real payments or shipping. Checkout runs in Shopify's test mode.",
  "No customer accounts, wishlists or subscriptions.",
  "No reviews, ratings or customer counts: nothing here pretends to be real.",
  "Thermal views and temperature ratings are illustrative, not lab results.",
  "Not indexed by search engines, because Scaur isn't a real shop.",
  "No custom checkout: Shopify's hosted checkout is used, as it should be.",
];
