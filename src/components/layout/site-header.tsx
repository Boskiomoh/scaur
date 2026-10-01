import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Suspense, type FC } from "react";

import CartButton from "@/components/layout/cart-button";
import MainNav from "@/components/layout/main-nav";
import MobileMenu from "@/components/layout/mobile-menu";
import NavLinks from "@/components/layout/nav-links";
import Logo from "@/components/ui/logo";

const SiteHeader: FC = () => (
  <header className="h-14 border-b border-line md:h-16">
    <div className="mx-auto flex h-full max-w-page items-center gap-1 ps-4 pe-2 md:ps-8 md:pe-5 lg:gap-10 lg:px-12">
      <div className="me-auto lg:me-0">
        <Logo />
      </div>

      <Suspense fallback={<NavLinks current={null} />}>
        <MainNav />
      </Suspense>

      <Link
        href="/search"
        aria-label="Search"
        className="flex size-11 items-center justify-center rounded-full"
      >
        <MagnifyingGlassIcon aria-hidden="true" className="size-5.5" />
      </Link>
      <div className="hidden lg:block">
        <CartButton variant="pill" />
      </div>
      <div className="lg:hidden">
        <CartButton variant="icon" />
      </div>
      <div className="lg:hidden">
        <MobileMenu />
      </div>
    </div>
  </header>
);

export default SiteHeader;
