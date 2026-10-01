import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import RangeBar from "@/components/ui/range-bar";
import { formatMoney, formatRange } from "@/lib/format";
import { layers } from "@/lib/layers";
import type { Product } from "@/types/product";

interface SearchOptionProps {
  id: string;
  product: Product;
  isActive: boolean;
  onNavigate: () => void;
}

const SearchOption: FC<SearchOptionProps> = ({
  id,
  product,
  isActive,
  onNavigate,
}) => {
  // Derived
  const label = layers.find((layer) => layer.id === product.layer)!.label;
  const layerText = label === "Insulation" ? label : `${label} layer`;
  const image = product.colours[0]?.image;

  return (
    <Link
      id={id}
      role="option"
      aria-selected={isActive}
      href={`/products/${product.handle}`}
      onClick={onNavigate}
      className="grid grid-cols-search-option items-center gap-4 border-t border-line px-4 py-3 no-underline aria-selected:bg-frost md:px-3 lg:grid-cols-search-option-wide lg:gap-6"
    >
      <div className="relative h-17.5 w-14 bg-mist lg:h-20 lg:w-16">
        {image && (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="64px"
            className="object-cover object-tile"
          />
        )}
      </div>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-base font-semibold lg:text-blurb">
          {product.title}
        </span>
        <span className="text-caption text-ink-2 lg:text-sm">
          {layerText}
          <span className="ms-1 font-data text-2xs lg:hidden">
            {formatRange(product.range)}
          </span>
        </span>
      </span>
      <span className="flex flex-col gap-1.5 max-lg:hidden">
        <RangeBar
          lo={product.range.lo}
          hi={product.range.hi}
          className="h-1.5"
        />
        <span className="font-data text-xs text-ink-2">
          Made for {formatRange(product.range)}
        </span>
      </span>
      <span className="text-end font-data text-sm lg:text-nav">
        {formatMoney(product.price)}
      </span>
    </Link>
  );
};

export default SearchOption;
