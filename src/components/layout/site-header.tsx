import { Suspense, type FC } from "react";

import CartButton from "@/components/layout/cart-button";
import MainNav from "@/components/layout/main-nav";
import MobileMenu from "@/components/layout/mobile-menu";
import NavLinks from "@/components/layout/nav-links";
import SearchButton from "@/components/layout/search-button";
import Logo from "@/components/ui/logo";
import type { Layer } from "@/lib/layers";
import type { LayerSummary } from "@/lib/shopify/products";

interface SiteHeaderProps {
  summaries: Record<Layer, LayerSummary>;
}

const SiteHeader: FC<SiteHeaderProps> = ({ summaries }) => (
  <header className="h-14 border-b border-line md:h-16">
    <div className="mx-auto flex h-full max-w-page items-center gap-1 ps-4 pe-2 md:ps-8 md:pe-5 lg:gap-10 lg:px-12">
      <div className="me-auto lg:me-0">
        <Logo />
      </div>

      <Suspense fallback={<NavLinks current={null} />}>
        <MainNav />
      </Suspense>

      <SearchButton />
      <div className="hidden lg:block">
        <CartButton variant="pill" />
      </div>
      <div className="lg:hidden">
        <CartButton variant="icon" />
      </div>
      <div className="lg:hidden">
        <MobileMenu summaries={summaries} />
      </div>
    </div>
  </header>
);

export default SiteHeader;
