import Link from "next/link";
import type { FC } from "react";

import { layers } from "@/lib/layers";

interface NavLinksProps {
  current: string | null;
}

const items = [
  ...layers.map((layer) => ({
    key: layer.id,
    href: `/shop?layer=${layer.id}`,
    label: layer.label,
  })),
  { key: "kit", href: "/kit", label: "Kit builder" },
];

const NavLinks: FC<NavLinksProps> = ({ current }) => (
  <nav aria-label="Main" className="hidden grow gap-7 lg:flex">
    {items.map((item) => (
      <Link
        key={item.key}
        href={item.href}
        aria-current={item.key === current ? "page" : undefined}
        className="text-nav font-medium no-underline hover:underline aria-[current=page]:underline"
      >
        {item.label}
      </Link>
    ))}
  </nav>
);

export default NavLinks;
