"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { FC } from "react";

import { useSearchStore } from "@/store/search-store";

// A link to /search without JavaScript; with it, the overlay opens in place.
const SearchButton: FC = () => {
  // Stores
  const open = useSearchStore((state) => state.open);

  return (
    <Link
      href="/search"
      aria-label="Search"
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault();
        open();
      }}
      className="flex size-11 items-center justify-center rounded-full"
    >
      <MagnifyingGlassIcon aria-hidden="true" className="size-5.5" />
    </Link>
  );
};

export default SearchButton;
