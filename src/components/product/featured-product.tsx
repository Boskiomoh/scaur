"use client";

import Image from "next/image";
import { useState, type FC } from "react";

import AddToCart from "@/components/product/add-to-cart";
import { resolveSelection, variantIn } from "@/components/product/selection";
import VariantPicker from "@/components/product/variant-picker";
import Button from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { Product, Size } from "@/types/product";

interface FeaturedProductProps {
  product: Product;
  lead: string;
}

// The home page's product feature: the same picker and add button as the product page.
const FeaturedProduct: FC<FeaturedProductProps> = ({ product, lead }) => {
  // State
  const defaults = resolveSelection(product, { hasSize: false });
  const [colour, setColour] = useState(defaults.colour!);
  const [size, setSize] = useState<Size | undefined>(defaults.size);

  // Derived
  const variant = variantIn(colour, size);

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-page px-8 pt-8 pb-16 max-md:hidden lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-16 lg:pb-28"
    >
      <div
        className="h-155 p-8 lg:col-span-7 lg:h-175 lg:p-12"
        style={{ backgroundColor: colour.hex }}
      >
        <div className="relative size-full">
          {colour.image && (
            <Image
              src={colour.image.url}
              alt={colour.image.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-featured"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 pt-8 lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-center lg:pt-0">
        <div className="flex flex-col gap-6 lg:contents">
          <div className="flex flex-col gap-2.5">
            <span className="text-nav text-ink-2">Shell layer</span>
            <h2 id="featured-heading" className="font-display text-h2">
              {product.title}
            </h2>
            <span className="font-data text-wordmark-sm">
              {formatMoney(variant?.price ?? product.price)}
            </span>
          </div>
          <p className="text-blurb leading-lead text-ink-2">{lead}</p>
        </div>
        <div className="flex flex-col gap-6 lg:contents">
          <VariantPicker
            colours={product.colours}
            colour={colour}
            size={size}
            onSelect={(nextColour, nextSize) => {
              setColour(nextColour);
              setSize(nextSize);
            }}
          />
          <div className="flex gap-3">
            <div className="flex grow flex-col gap-2">
              <AddToCart variant={variant} />
            </div>
            <Button href="/kit" variant="secondary" size="lg">
              Add to a kit
            </Button>
          </div>
        </div>
        <span id="demo-note" className="sr-only">
          Test checkout only. Nothing ships from this demo store.
        </span>
      </div>
    </section>
  );
};

export default FeaturedProduct;
