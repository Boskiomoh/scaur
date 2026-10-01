"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useState, useTransition, type FC } from "react";

import { addKit } from "@/components/cart/actions";
import Button from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { Kit } from "@/lib/kit";
import { useCartStore } from "@/store/cart-store";

interface KitFooterProps {
  kit: Kit;
  size: string;
  label: string;
  href: string;
}

const KitFooter: FC<KitFooterProps> = ({ kit, size, label, href }) => {
  // Stores
  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.open);

  // State
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedHref, setAddedHref] = useState<string>();

  // Derived
  const variantIds = kit.slots.flatMap((slot) =>
    slot.status === "filled" ? [slot.variant.id] : [],
  );
  const isAdded = addedHref === href;
  const canAdd = variantIds.length > 0 && !isPending && !isAdded;

  // Handlers
  const handleAdd = () =>
    startTransition(async () => {
      setMessage("");
      setError("");
      const result = await addKit(variantIds, { label, url: href });
      if (result.ok) {
        setCart(result.cart);
        setAddedHref(href);
        setMessage(
          `${variantIds.length} items added. Cart has ${result.cart?.totalQuantity ?? variantIds.length}.`,
        );
        openCart();
      } else {
        setError(result.error);
      }
    });

  return (
    <div className="-mx-4 flex flex-wrap items-center gap-4 border-t border-line bg-snow p-4 md:mx-0 md:gap-5 md:px-0 md:pt-5 lg:bg-transparent">
      <div className="flex flex-col gap-0.5 lg:gap-1">
        <span className="text-caption text-ink-2 lg:text-sm">
          {kit.pieces} {kit.pieces === 1 ? "piece" : "pieces"} in {size}
        </span>
        <span className="font-data text-wordmark font-semibold lg:text-2xl">
          {formatMoney({ amount: String(kit.total), currencyCode: "USD" })}
        </span>
      </div>
      <span role="status" className="ms-auto text-sm max-md:sr-only">
        {message}
      </span>
      <Button
        size="lg"
        aria-disabled={!canAdd}
        aria-busy={isPending}
        onClick={canAdd ? handleAdd : undefined}
        className="aria-busy:bg-ember-hover max-md:ms-auto"
      >
        {isPending ? "Adding" : isAdded ? "Kit added" : "Add kit to cart"}
      </Button>
      <span role="alert" className="basis-full text-sm text-error empty:hidden">
        {error && (
          <span className="flex items-center justify-end gap-1.5">
            <WarningCircleIcon aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </span>
        )}
      </span>
    </div>
  );
};

export default KitFooter;
