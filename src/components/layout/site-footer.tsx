import Link from "next/link";
import type { FC } from "react";

import TestCheckoutLink from "@/components/layout/test-checkout-link";
import Logo from "@/components/ui/logo";
import { layers } from "@/lib/layers";

const phoneLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/kit", label: "Kit builder" },
  { href: "/products/scarp-shell#size-guide", label: "Size guide" },
  { href: "/credits", label: "Photo credits" },
  { href: "/about", label: "How this store was built" },
];

const SiteFooter: FC = () => (
  <footer className="mt-auto border-t border-line">
    <div className="mx-auto flex max-w-page flex-col gap-5 px-4 py-8 text-nav md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-8 md:px-8 md:pt-12 md:pb-9 lg:grid-cols-12 lg:gap-y-10 lg:px-12 lg:pt-14 lg:pb-10">
      <div className="hidden items-center gap-2.5 md:col-span-full md:flex lg:col-span-4 lg:flex-col lg:items-start lg:gap-3">
        <Logo size="md" isLink={false} />
        <p className="ms-3 text-ink-2 lg:ms-0">
          Technical layers, rated on one scale.
        </p>
      </div>

      <nav
        aria-label="Shop"
        className="hidden flex-col gap-2.5 md:flex lg:col-span-2 lg:col-start-6"
      >
        <span className="font-semibold">Shop</span>
        {layers.map((layer) => (
          <Link key={layer.id} href={`/shop?layer=${layer.id}`}>
            {layer.label}
          </Link>
        ))}
        <Link href="/kit">Kit builder</Link>
      </nav>
      <nav
        aria-label="Help"
        className="hidden flex-col gap-2.5 md:flex lg:col-span-2 lg:col-start-8"
      >
        <span className="font-semibold">Help</span>
        <Link href="/products/scarp-shell#size-guide">Size guide</Link>
        <Link href="/search">Search</Link>
        <TestCheckoutLink />
      </nav>
      <nav
        aria-label="About"
        className="hidden flex-col gap-2.5 md:flex lg:col-span-3 lg:col-start-10"
      >
        <span className="font-semibold">About</span>
        <Link href="/credits">Photo credits</Link>
        <Link href="/about">How this store was built</Link>
      </nav>

      <nav
        aria-label="Footer"
        className="flex flex-wrap gap-x-5 gap-y-3 md:hidden"
      >
        {phoneLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="col-span-full max-w-notice text-caption leading-relaxed text-ink-2 md:border-t md:border-line md:pt-5 lg:pt-6">
        Scaur is a fictional brand made for a portfolio. Products are listed on
        a Shopify development store; checkout runs in test mode and nothing
        ships. Specs and thermal views are illustrative. Photography from
        Unsplash, credited on the{" "}
        <Link href="/credits" className="text-ink-2">
          credits page
        </Link>
        .
      </p>
    </div>
  </footer>
);

export default SiteFooter;
