"use client";

import type { FC } from "react";

import { useCartStore } from "@/store/cart-store";

const TestCheckoutLink: FC = () => {
  // Stores
  const open = useCartStore((state) => state.open);

  return (
    <button
      type="button"
      onClick={open}
      className="self-start text-start underline underline-offset-3 hover:decoration-2"
    >
      Test checkout
    </button>
  );
};

export default TestCheckoutLink;
