"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useState, useTransition, type FC } from "react";

import { addLine } from "@/components/cart/actions";
import Button from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { Variant } from "@/types/product";

interface AddToCartProps {
  variant?: Variant;
}

const AddToCart: FC<AddToCartProps> = ({ variant }) => {
  // Stores
  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.open);

  // State
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [isAdded, setIsAdded] = useState(false);

  // Derived
  const canAdd = !!variant?.availableForSale;
  const label = !canAdd
    ? "Choose a size"
    : isPending
      ? "Adding"
      : isAdded
        ? "Added to cart"
        : "Add to cart";

  // Handlers
  const handleAdd = () => {
    if (!variant || !canAdd || isPending) return;
    setError(undefined);
    startTransition(async () => {
      const result = await addLine(variant.id, 1);
      if (result.ok) {
        setCart(result.cart);
        openCart();
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <Button
        size="lg"
        aria-describedby="demo-note"
        aria-disabled={!canAdd}
        aria-busy={isPending}
        onClick={handleAdd}
        className="aria-busy:bg-ember-hover aria-disabled:cursor-not-allowed"
      >
        {label}
      </Button>
      <span role="status" className="text-sm text-error empty:hidden">
        {error && (
          <span className="flex items-center gap-1.5">
            <WarningCircleIcon aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </span>
        )}
      </span>
    </>
  );
};

export default AddToCart;
