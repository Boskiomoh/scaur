import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import RangeBar from "@/components/ui/range-bar";
import { formatMoney, formatRange } from "@/lib/format";
import { layers } from "@/lib/layers";
import { thermalSrc } from "@/lib/thermal";
import type { View } from "@/lib/url";
import type { Product } from "@/types/product";

interface ProductTileProps {
  product: Product;
  view: View;
  isPriority?: boolean;
}

const ProductTile: FC<ProductTileProps> = ({ product, view, isPriority }) => {
  // Derived
  const colour = product.colours[0];
  const photo = colour?.image ?? product.images[0];
  const thermal = colour ? thermalSrc(product.handle, colour.name) : null;
  const isThermal = view === "thermal" && thermal !== null;
  const layerLabel = layers.find((layer) => layer.id === product.layer)?.label;
  const colourCount = product.colours.length;
  const meta =
    colourCount > 1 ? `${layerLabel}, ${colourCount} colours` : layerLabel;
  const price = formatMoney(product.price);
  const alt = photo?.altText ?? product.title;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex min-w-0 flex-col gap-2 no-underline md:gap-2.5 lg:gap-3"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-mist">
        {isThermal ? (
          <Image
            src={thermal}
            alt={`Illustrative thermal view: ${alt}`}
            fill
            sizes="(min-width: 1024px) 318px, (min-width: 768px) 33vw, 50vw"
            className="object-cover object-tile"
          />
        ) : (
          photo && (
            <Image
              src={photo.url}
              alt={alt}
              fill
              priority={isPriority}
              sizes="(min-width: 1024px) 318px, (min-width: 768px) 33vw, 50vw"
              className="object-cover object-tile"
            />
          )
        )}
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-sm leading-snug font-semibold group-hover:underline md:text-nav lg:text-base">
          {product.title}
        </span>
        <span className="hidden font-data text-sm lg:inline">{price}</span>
      </div>
      <span className="flex items-baseline justify-between gap-2 text-caption text-ink-2 lg:text-sm">
        <span className="lg:hidden">{layerLabel}</span>
        <span className="hidden lg:inline">{meta}</span>
        <span className="font-data text-caption text-ink lg:hidden">
          {price}
        </span>
      </span>
      <RangeBar
        lo={product.range.lo}
        hi={product.range.hi}
        className="h-1 lg:h-1.5"
      />
      <span className="font-data text-2xs text-ink-2 lg:text-xs">
        <span className="hidden lg:inline">Made for </span>
        {formatRange(product.range)}
      </span>
    </Link>
  );
};

export default ProductTile;
