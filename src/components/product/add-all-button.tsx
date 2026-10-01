"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useState, useTransition, type FC } from "react";

import { addPlainLines } from "@/components/cart/actions";
import Button from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

interface AddAllButtonProps {
  variantIds: string[];
  size: string;
  className?: string;
}

const AddAllButton: FC<AddAllButtonProps> = ({
  variantIds,
  size,
  className,
}) => {
  // Stores
  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.open);

  // State
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  // Handlers
  const handleAdd = () =>
    startTransition(async () => {
      setError(undefined);
      const result = await addPlainLines(variantIds);
      if (result.ok) {
        setCart(result.cart);
        openCart();
      } else {
        setError(result.error);
      }
    });

  return (
    <div className={className}>
      <Button
        variant="secondary"
        size="lg"
        aria-busy={isPending}
        onClick={isPending ? undefined : handleAdd}
        className="w-full md:w-auto"
      >
        {isPending ? "Adding" : `Add all three in ${size}`}
      </Button>
      <span
        role="status"
        className="mt-2 block text-sm text-error empty:hidden"
      >
        {error && (
          <span className="flex items-center gap-1.5">
            <WarningCircleIcon aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </span>
        )}
      </span>
    </div>
  );
};

export default AddAllButton;
