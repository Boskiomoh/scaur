import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import RangeBar from "@/components/ui/range-bar";
import { formatRange } from "@/lib/format";
import { axisPosition, heat, heatStops } from "@/lib/heat";
import { layers, type Layer } from "@/lib/layers";
import type { Image as ProductImage, Product } from "@/types/product";

interface LayerAxisProps {
  products: Product[];
  images: Partial<Record<Layer, ProductImage | null>>;
}

const ticks = Array.from({ length: 10 }, (_, i) => -10 + i * 10);
const gradient = `linear-gradient(90deg, ${heatStops.map((stop) => stop.hex).join(", ")})`;

// Bars sit on the shared -10 to 80°F axis; every name and range is also plain text.
const LayerAxis: FC<LayerAxisProps> = ({ products, images }) => (
  <section
    aria-labelledby="axis-heading"
    className="mx-auto flex max-w-page flex-col gap-6 px-4 py-14 md:px-8 lg:gap-12 lg:px-12 lg:pt-28 lg:pb-24"
  >
    <div className="flex flex-col gap-4">
      <h2 id="axis-heading" className="font-display text-h2-phone lg:text-h2">
        One scale for every layer.
      </h2>
      <p className="max-w-axis text-base leading-lead text-ink-2 md:hidden">
        Each piece shows the temperatures it is made for. Ratings assume you are
        moving.
      </p>
      <p className="max-w-axis text-base leading-lead text-ink-2 max-md:hidden lg:text-lg">
        Each piece shows the temperatures it is made for, so you can see how a
        kit covers the day. Ratings assume you are moving.
      </p>
    </div>

    <div>
      <div className="flex flex-col gap-1.5 md:grid md:grid-cols-axis-tablet md:gap-x-6 lg:grid-cols-axis">
        <div className="max-md:hidden" />
        <div className="relative h-11 max-md:hidden">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute top-0 -translate-x-1/2 font-data text-xs text-ink-2"
              style={{ left: `${axisPosition(tick) * 100}%` }}
            >
              {tick}°F
            </span>
          ))}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-2 h-1.5"
            style={{ background: gradient }}
          />
        </div>
        <div
          aria-hidden="true"
          className="h-1.5 md:hidden"
          style={{ background: gradient }}
        />
        <div className="flex justify-between font-data text-2xs text-ink-2 md:hidden">
          <span>-10°F</span>
          <span>35°F</span>
          <span>80°F</span>
        </div>
      </div>

      <ul className="mt-5 md:mt-0">
        {layers.map((layer) => {
          const items = products
            .filter((product) => product.layer === layer.id)
            .sort((a, b) => a.range.lo - b.range.lo);
          const image = images[layer.id];
          return (
            <li
              key={layer.id}
              className="flex flex-col gap-3 border-t border-line py-4 md:grid md:grid-cols-axis-tablet md:gap-x-6 lg:grid-cols-axis md:py-0"
            >
              <Link
                href={`/shop?layer=${layer.id}`}
                className="flex items-center gap-3 no-underline md:gap-4 md:py-5"
              >
                <div className="relative size-12 shrink-0 bg-mist md:size-18">
                  {image && (
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="flex grow items-center justify-between gap-1 md:flex-col md:items-start">
                  <span className="font-display text-lg md:text-wordmark-sm">
                    {layer.label}
                  </span>
                  <span className="text-sm text-ink-2">
                    {items.length} pieces
                  </span>
                </span>
              </Link>

              <ul className="flex flex-col gap-3 md:relative md:block md:min-h-28 md:pt-6 md:pb-4">
                {items.map((product) => {
                  const isLate = product.range.hi > 50;
                  return (
                    <li
                      key={product.handle}
                      className="flex flex-col gap-1 md:relative md:block md:h-7.5"
                    >
                      <span className="flex justify-between text-caption md:hidden">
                        <span>{product.title}</span>
                        <span className="font-data text-2xs text-ink-2">
                          {formatRange(product.range)}
                        </span>
                      </span>
                      <RangeBar
                        lo={product.range.lo}
                        hi={product.range.hi}
                        className="h-2 md:hidden"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute top-0 h-3 max-md:hidden"
                        style={{
                          insetInlineStart: `${axisPosition(product.range.lo) * 100}%`,
                          width: `${(axisPosition(product.range.hi) - axisPosition(product.range.lo)) * 100}%`,
                          background: `linear-gradient(90deg, ${heat(product.range.lo)}, ${heat(product.range.hi)})`,
                        }}
                      />
                      <span
                        className="absolute -top-1 text-caption whitespace-nowrap max-md:hidden"
                        style={
                          isLate
                            ? {
                                insetInlineEnd: `calc(${(1 - axisPosition(product.range.lo)) * 100}% + 12px)`,
                              }
                            : {
                                insetInlineStart: `calc(${axisPosition(product.range.hi) * 100}% + 12px)`,
                              }
                        }
                      >
                        {product.title}{" "}
                        <span className="font-data text-xs text-ink-2">
                          {formatRange(product.range)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default LayerAxis;
