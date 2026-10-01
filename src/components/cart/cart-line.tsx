"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import { formatMoney, lowStock } from "@/lib/format";
import type { CartLine as CartLineData } from "@/types/cart";

interface CartLineProps {
  line: CartLineData;
  error?: string;
  isPending: boolean;
  onQuantity: (quantity: number) => void;
  onNavigate: () => void;
}

const CartLine: FC<CartLineProps> = ({
  line,
  error,
  isPending,
  onQuantity,
  onNavigate,
}) => {
  // Derived
  const max = line.quantityAvailable;
  const isMaxed = max !== null && line.quantity >= max;
  const note = isMaxed
    ? `Only ${max} left in this size`
    : max !== null && max <= lowStock
      ? `${max} left in this size`
      : "";

  return (
    <li
      aria-busy={isPending}
      className="flex gap-4 py-2.5 md:max-lg:gap-5 md:max-lg:border-t md:max-lg:border-line md:max-lg:py-3.5"
    >
      <div className="relative h-24 w-19 shrink-0 bg-mist md:max-lg:h-25 md:max-lg:w-20">
        {line.image && (
          <Image
            src={line.image.url}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 grow flex-col gap-1">
        <div className="flex justify-between gap-3">
          <Link
            href={`/products/${line.handle}`}
            onClick={onNavigate}
            className="text-nav font-semibold no-underline hover:underline md:max-lg:text-base"
          >
            {line.title}
          </Link>
          <span className="font-data text-sm">{formatMoney(line.total)}</span>
        </div>
        <span className="text-sm text-ink-2">{line.options}</span>
        <div className="mt-1 flex items-center gap-3">
          <div
            role="group"
            aria-label={`Quantity of ${line.title}`}
            className="flex items-center rounded-full border-control border-line"
          >
            <button
              type="button"
              aria-label={
                line.quantity === 1
                  ? `Remove ${line.title}`
                  : `One fewer ${line.title}`
              }
              onClick={() => onQuantity(line.quantity - 1)}
              className="flex size-9 items-center justify-center rounded-full hover:bg-mist"
            >
              <MinusIcon aria-hidden="true" className="size-3.5" />
            </button>
            <span className="min-w-6 text-center font-data text-sm">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label={
                isMaxed ? "No more in stock" : `One more ${line.title}`
              }
              aria-disabled={isMaxed}
              onClick={
                isMaxed ? undefined : () => onQuantity(line.quantity + 1)
              }
              className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-mist aria-disabled:cursor-not-allowed aria-disabled:text-empty-line aria-disabled:hover:bg-transparent"
            >
              <PlusIcon aria-hidden="true" className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onQuantity(0)}
            className="text-sm underline underline-offset-3"
          >
            Remove
          </button>
        </div>
        <span role="status" className="min-h-4 font-data text-xs">
          {error ? (
            <span className="font-sans text-sm text-error">{error}</span>
          ) : (
            note
          )}
        </span>
      </div>
    </li>
  );
};

export default CartLine;
