"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";

import Button from "@/components/ui/button";
import Segmented from "@/components/ui/segmented";
import { formatMoney } from "@/lib/format";
import { heatStops } from "@/lib/heat";
import type { Image as ProductImage, Money } from "@/types/product";

interface HeroProps {
  photo: ProductImage;
  thermal: string;
  title: string;
  colour: string;
  price: Money;
  href: string;
}

const viewOptions = [
  { value: "photo", label: "Photo" },
  { value: "thermal", label: "Thermal" },
] as const;

const Hero: FC<HeroProps> = ({
  photo,
  thermal,
  title,
  colour,
  price,
  href,
}) => {
  // State
  const [isThermal, setIsThermal] = useState(false);

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto flex max-w-page flex-col gap-5 px-4 pt-7 pb-10 md:px-8 md:pt-10 md:pb-14 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pb-12"
    >
      <div className="flex flex-col justify-center gap-5 lg:col-span-5 lg:gap-7 lg:pe-4">
        <h1
          id="hero-heading"
          className="font-display text-h1-phone md:text-hero-tablet lg:text-h1"
        >
          Four layers.
          <br />
          One system.
        </h1>
        <p className="max-w-hero text-blurb leading-normal text-ink-2 lg:text-lead">
          Every piece is a base, mid, insulation or shell layer, rated on one
          temperature scale so kits add up.
        </p>
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
          <Button href="/kit" size="lg" className="lg:h-12">
            Build your kit
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4.5 max-md:hidden rtl:-scale-x-100"
            />
          </Button>
          <Button
            href="/shop"
            variant="secondary"
            size="lg"
            className="lg:h-12"
          >
            Shop layers
          </Button>
        </div>
      </div>

      <figure className="mt-2 flex flex-col gap-3 lg:col-span-7 lg:mt-0 lg:gap-0">
        <div className="relative h-110 overflow-hidden bg-heat-0 md:h-140 lg:h-155">
          <Image
            src={isThermal ? thermal : photo.url}
            alt={
              isThermal
                ? `Illustrative thermal view of a hiker in the ${title}: the shell glows warm against a cold sky`
                : (photo.altText ?? title)
            }
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-hero"
          />
        </div>
        <figcaption className="flex items-center gap-3 lg:h-14 lg:gap-5 lg:border-b lg:border-line">
          <Segmented
            label="Image view"
            options={viewOptions}
            value={isThermal ? "thermal" : "photo"}
            onChange={(value) => setIsThermal(value === "thermal")}
          />
          {isThermal ? (
            <div className="flex grow items-center gap-2.5">
              <span className="font-data text-xs text-ink-2 max-lg:hidden">
                Cooler
              </span>
              <div
                aria-hidden="true"
                className="h-2 w-60 max-lg:hidden"
                style={{
                  background: `linear-gradient(90deg, ${heatStops.map((stop) => stop.hex).join(", ")})`,
                }}
              />
              <span className="font-data text-xs text-ink-2 max-lg:hidden">
                Warmer
              </span>
              <span className="text-caption text-ink-2 lg:ms-auto lg:text-sm">
                Illustrative thermal view, not a measurement.
              </span>
            </div>
          ) : (
            <div className="flex grow items-center gap-4">
              <span className="text-caption text-ink-2 lg:text-nav lg:font-semibold lg:text-ink">
                {title} in {colour}
                <span className="lg:hidden">, {formatMoney(price)}</span>
              </span>
              <span className="font-data text-sm max-lg:hidden">
                {formatMoney(price)}
              </span>
              <Link
                href={href}
                className="ms-auto text-nav font-semibold max-lg:hidden"
              >
                View the shell
              </Link>
            </div>
          )}
        </figcaption>
      </figure>
    </section>
  );
};

export default Hero;
