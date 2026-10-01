import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import Button from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { KitSlot } from "@/lib/kit";
import { layers } from "@/lib/layers";

type FilledSlot = Extract<KitSlot, { status: "filled" }>;

interface FinishTheKitProps {
  slots: FilledSlot[];
  size: string;
}

const FinishTheKit: FC<FinishTheKitProps> = ({ slots, size }) => (
  <section
    aria-labelledby="finish-kit-heading"
    className="mt-14 bg-snow px-4 pt-12 pb-14 md:px-8 lg:mt-24 lg:px-12 lg:pt-18 lg:pb-24"
  >
    <div className="mx-auto flex max-w-page flex-col gap-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <h2
          id="finish-kit-heading"
          className="font-display text-h2-phone leading-none lg:text-collection-phone"
        >
          Finish the kit
        </h2>
        <Button
          href="/kit"
          variant="secondary"
          size="lg"
          className="max-md:hidden"
        >
          Add all three in {size}
        </Button>
      </div>
      <ul className="grid gap-6 md:grid-cols-3">
        {slots.map(({ layer, product, variant }) => {
          const image = product.colours.find(
            (colour) => colour.name === variant.colour,
          )?.image;
          const label = layers.find((item) => item.id === layer)!.label;
          return (
            <li
              key={layer}
              className="flex min-w-0 items-center gap-4 border-t border-line pt-5"
            >
              <div className="relative h-20 w-16 shrink-0 bg-mist md:h-32 md:w-26">
                {image && (
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.title}
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-sm text-ink-2">
                  {label === "Insulation" ? label : `${label} layer`}
                </span>
                <Link
                  href={`/products/${product.handle}`}
                  className="text-blurb font-semibold no-underline hover:underline"
                >
                  {product.title}
                </Link>
                <span className="font-data text-sm">
                  {formatMoney(variant.price)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <Button href="/kit" variant="secondary" size="lg" className="md:hidden">
        Add all three in {size}
      </Button>
    </div>
  </section>
);

export default FinishTheKit;
