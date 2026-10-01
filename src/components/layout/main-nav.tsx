"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { FC } from "react";

import NavLinks from "@/components/layout/nav-links";

const MainNav: FC = () => {
  // Router
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derived
  const current =
    pathname === "/kit"
      ? "kit"
      : pathname === "/shop"
        ? searchParams.get("layer")
        : null;

  return <NavLinks current={current} />;
};

export default MainNav;
