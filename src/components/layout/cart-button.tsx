"use client";

import { ToteIcon } from "@phosphor-icons/react";
import type { FC } from "react";

import { useCartStore } from "@/store/cart-store";

interface CartButtonProps {
  variant: "pill" | "icon";
}

const CartButton: FC<CartButtonProps> = ({ variant }) => {
  // Stores
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const open = useCartStore((state) => state.open);

  // Derived
  const label =
    totalQuantity === 0 ? "Cart, empty" : `Cart, ${totalQuantity} items`;

  if (variant === "pill") {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={open}
        className="inline-flex h-10 items-center gap-2.5 rounded-full border-control border-ink px-4 text-nav font-semibold whitespace-nowrap transition-colors hover:bg-ink hover:text-snow active:translate-y-px"
      >
        Cart <span className="font-data text-caption">{totalQuantity}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={open}
      className="relative flex size-11 items-center justify-center rounded-full"
    >
      <ToteIcon aria-hidden="true" className="size-5.5" />
      {totalQuantity > 0 && (
        <span className="absolute top-1.5 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 font-data text-3xs text-white">
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

export default CartButton;
