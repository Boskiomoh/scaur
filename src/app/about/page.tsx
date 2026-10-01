import type { Metadata } from "next";

import About from "@/components/about";

export const metadata: Metadata = {
  title: "How this store was built",
  description:
    "How Scaur was built: a headless Shopify storefront on Next.js 16, with a kit builder and illustrative thermal views.",
};

export default function Page() {
  return <About />;
}
