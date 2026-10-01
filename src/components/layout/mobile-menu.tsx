"use client";

import { CaretRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRef, type FC } from "react";

import Logo from "@/components/ui/logo";
import { layers } from "@/lib/layers";
import { useCartStore } from "@/store/cart-store";

const moreLinks = [
  { href: "/search", label: "Search" },
  { href: "/products/scarp-shell#size-guide", label: "Size guide" },
  { href: "/credits", label: "Photo credits" },
  { href: "/about", label: "How this store was built" },
];

const MobileMenu: FC = () => {
  // Stores
  const totalQuantity = useCartStore((state) => state.cart?.totalQuantity ?? 0);
  const openCart = useCartStore((state) => state.open);

  // State
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handlers
  const handleOpen = () => dialogRef.current?.showModal();
  const handleClose = () => dialogRef.current?.close();
  const handleOpenCart = () => {
    handleClose();
    openCart();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-haspopup="dialog"
        onClick={handleOpen}
        className="flex size-11 items-center justify-center rounded-full"
      >
        <ListIcon aria-hidden="true" className="size-5.5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none flex-col bg-snow text-ink open:flex"
      >
        <div className="flex h-14 shrink-0 items-center gap-1 border-b border-line ps-4 pe-2 md:h-16 md:ps-8 md:pe-5">
          <div className="me-auto">
            <Logo onClick={handleClose} />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={handleClose}
            className="flex size-11 items-center justify-center rounded-full"
          >
            <XIcon aria-hidden="true" className="size-5.5" />
          </button>
        </div>

        <nav
          aria-label="Main"
          className="flex grow flex-col overflow-y-auto px-4 pt-4 md:px-8"
        >
          <span className="pb-2 text-sm font-semibold">Shop by layer</span>
          {layers.map((layer) => (
            <Link
              key={layer.id}
              href={`/shop?layer=${layer.id}`}
              onClick={handleClose}
              className="flex items-center gap-3.5 border-t border-line py-3 no-underline"
            >
              <span className="grow font-display text-wordmark">
                {layer.label}
              </span>
              <CaretRightIcon
                aria-hidden="true"
                className="size-4.5 rtl:-scale-x-100"
              />
            </Link>
          ))}
          <Link
            href="/kit"
            onClick={handleClose}
            className="flex items-center gap-3.5 border-y border-line py-3 no-underline"
          >
            <span className="flex grow flex-col gap-0.5">
              <span className="font-display text-wordmark">Kit builder</span>
              <span className="text-caption text-ink-2">
                One piece per layer, picked for the day
              </span>
            </span>
            <CaretRightIcon
              aria-hidden="true"
              className="size-4.5 rtl:-scale-x-100"
            />
          </Link>
          <div className="flex flex-col pt-4">
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className="py-2.5 text-base no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="shrink-0 border-t border-line p-4 md:px-8">
          <button
            type="button"
            onClick={handleOpenCart}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full border-control border-ink text-base font-semibold active:translate-y-px"
          >
            Cart <span className="font-data text-sm">{totalQuantity}</span>
          </button>
        </div>
      </dialog>
    </>
  );
};

export default MobileMenu;
