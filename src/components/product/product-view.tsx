"use client";

import Link from "next/link";
import type { FC } from "react";

import AddToCart from "@/components/product/add-to-cart";
import Gallery from "@/components/product/gallery";
import { variantIn } from "@/components/product/selection";
import VariantPicker from "@/components/product/variant-picker";
import Accordion from "@/components/ui/accordion";
import Button from "@/components/ui/button";
import RangeBar from "@/components/ui/range-bar";
import { formatMoney, formatRange } from "@/lib/format";
import { layers } from "@/lib/layers";
import { productHref } from "@/lib/url";
import type { Colour, Image, Product, Size } from "@/types/product";

interface ProductViewProps {
  product: Product;
  colour: Colour;
  size?: Size;
  lead: string;
  details: Image[];
  thermals: Record<string, string | null>;
}

const ProductView: FC<ProductViewProps> = ({
  product,
  colour,
  size,
  lead,
  details,
  thermals,
}) => {
  // Derived
  const variant = variantIn(colour, size);
  const price = variant?.price ?? product.price;
  const layer = layers.find((item) => item.id === product.layer)!;

  // Handlers
  // replaceState keeps the static page and updates useSearchParams without a server round trip.
  const handleSelect = (next: Colour, nextSize?: Size) =>
    window.history.replaceState(
      null,
      "",
      productHref(product.handle, { colour: next.name, size: nextSize }),
    );

  return (
    <div className="grid gap-7 lg:grid-cols-12 lg:gap-x-6">
      <div className="px-4 md:px-8 lg:col-span-7 lg:px-0">
        <Gallery
          title={product.title}
          colour={colour}
          details={details}
          thermal={thermals[colour.name] ?? null}
        />
      </div>

      <div className="flex flex-col gap-6 px-4 md:px-8 lg:col-span-4 lg:col-start-9 lg:gap-7 lg:px-0 lg:pt-2">
        <div className="flex flex-col gap-2.5 lg:gap-3">
          <Link
            href={`/shop?layer=${product.layer}`}
            className="text-sm text-ink-2 lg:text-nav"
          >
            {layer.label === "Insulation"
              ? "Insulation layer"
              : `${layer.label} layer`}
          </Link>
          <h1 className="font-display text-collection-phone leading-product md:text-product">
            {product.title}
          </h1>
          <span className="font-data text-wordmark-sm lg:text-wordmark">
            {formatMoney(price)}
          </span>
        </div>
        <p className="text-base leading-lead text-ink-2 lg:text-blurb">
          {lead}
        </p>

        <div className="flex flex-col gap-2 lg:gap-2.5">
          <span className="text-sm font-semibold">
            Made for{" "}
            <span className="font-data">{formatRange(product.range)}</span>
          </span>
          <RangeBar
            lo={product.range.lo}
            hi={product.range.hi}
            className="h-2.5"
          />
          <div className="flex justify-between font-data text-2xs text-ink-2">
            <span>-10°F</span>
            <span>35°F</span>
            <span>80°F</span>
          </div>
        </div>

        <VariantPicker
          colours={product.colours}
          colour={colour}
          size={size}
          onSelect={handleSelect}
        />

        <div className="flex flex-col gap-2.5">
          <AddToCart variant={variant} />
          <Button href="/kit" variant="secondary" size="lg">
            Build a kit around it
          </Button>
          <span id="demo-note" className="text-caption text-ink-2">
            Test checkout only. Nothing ships from this demo store. Specs and
            ratings are illustrative.
          </span>
        </div>

        {product.details.length > 0 && (
          <div className="border-b border-line lg:border-b-0">
            {product.details.map((detail, index) => (
              <Accordion
                key={detail.title}
                title={detail.title}
                isOpen={index === 0}
              >
                <p>{detail.body}</p>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;
