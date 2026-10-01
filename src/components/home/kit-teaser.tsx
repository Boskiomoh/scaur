"use client";

import Image from "next/image";
import { useState, type FC } from "react";

import {
  activityLabels,
  rainLabels,
  severity,
} from "@/components/kit/kit-copy";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import {
  activities,
  buildKit,
  defaultKitInput,
  rains,
  type KitInput,
} from "@/lib/kit";
import { layers } from "@/lib/layers";
import { kitHref } from "@/lib/url";
import type { Product } from "@/types/product";

interface KitTeaserProps {
  products: Product[];
}

const tempSizes = ["text-base", "text-xl", "text-2xl", "text-temp-2"];
const reasons = {
  mid: (temp: number) => `Warm enough to skip a mid layer at ${temp}°F`,
  insulation: (temp: number) => `No insulation needed at ${temp}°F`,
  shell: () => "Dry and not too windy: no shell needed",
  base: () => "",
};

// The same rules as the kit builder, with wind fixed at Breezy.
const KitTeaser: FC<KitTeaserProps> = ({ products }) => {
  // State
  const [input, setInput] = useState<KitInput>({
    ...defaultKitInput,
    wind: "breezy",
  });

  // Derived
  const kit = buildKit(input, products);
  const update = (patch: Partial<KitInput>) => setInput({ ...input, ...patch });

  return (
    <section aria-labelledby="teaser-heading" className="bg-snow">
      <div className="mx-auto flex max-w-page flex-col gap-5 px-4 py-14 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-5 lg:col-span-4 lg:gap-7">
          <h2
            id="teaser-heading"
            className="font-display text-h2-phone lg:text-teaser"
          >
            Tell us the day. We&apos;ll layer it.
          </h2>
          <p className="text-base leading-lead text-ink-2 md:hidden">
            A day hike at 38°F in steady rain gets this kit. Change the day in
            the kit builder.
          </p>
          <p className="text-blurb leading-lead text-ink-2 max-md:hidden">
            Pick the activity and the weather. The kit builder picks one piece
            per layer and skips what you won&apos;t need.
          </p>

          <div
            role="group"
            aria-label="Activity"
            className="flex flex-col gap-2.5 max-md:hidden"
          >
            <span className="text-sm font-semibold">Activity</span>
            <div className="flex gap-2">
              {activities.map((activity) => (
                <Chip
                  key={activity}
                  isPressed={input.activity === activity}
                  onClick={() => update({ activity })}
                >
                  {activityLabels[activity]}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 max-md:hidden">
            <label
              htmlFor="teaser-temp"
              className="flex justify-between text-sm font-semibold"
            >
              Temperature
              <span
                className={cn(
                  "font-data font-semibold",
                  tempSizes[severity(input.temp)],
                )}
              >
                {input.temp}°F
              </span>
            </label>
            <input
              id="teaser-temp"
              type="range"
              min={-10}
              max={70}
              value={input.temp}
              aria-valuetext={`${input.temp} degrees Fahrenheit`}
              onChange={(event) => update({ temp: Number(event.target.value) })}
              className="w-full accent-ember"
            />
          </div>
          <div
            role="group"
            aria-label="Rain"
            className="flex flex-col gap-2.5 max-md:hidden"
          >
            <span className="text-sm font-semibold">Rain</span>
            <div className="flex gap-2">
              {rains.map((rain) => (
                <Chip
                  key={rain}
                  isPressed={input.rain === rain}
                  onClick={() => update({ rain })}
                >
                  {rainLabels[rain]}
                </Chip>
              ))}
            </div>
          </div>
          <Button
            href={kitHref(input)}
            size="lg"
            className="self-start max-md:hidden lg:h-12"
          >
            See my kit
          </Button>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 self-center md:grid-cols-4 md:gap-4 lg:col-span-7 lg:col-start-6">
          {kit.slots.map((slot) => {
            const label = layers.find(
              (layer) => layer.id === slot.layer,
            )!.label;
            const image =
              slot.status === "filled"
                ? slot.product.colours.find(
                    (colour) => colour.name === slot.variant.colour,
                  )?.image
                : null;
            return (
              <li
                key={slot.layer}
                className="flex min-w-0 flex-col gap-2 md:gap-3"
              >
                <span className="font-data text-2xs text-ink-2 md:text-xs">
                  {label}
                </span>
                {slot.status === "filled" ? (
                  <>
                    <div className="relative aspect-4/5 bg-mist">
                      {image && (
                        <Image
                          src={image.url}
                          alt={slot.product.title}
                          fill
                          sizes="(min-width: 1024px) 180px, 50vw"
                          className="object-cover object-tile"
                        />
                      )}
                    </div>
                    <span className="text-sm leading-snug font-semibold md:text-nav">
                      {slot.product.title}
                    </span>
                    <span className="font-data text-xs md:text-caption">
                      {formatMoney(slot.variant.price)}
                    </span>
                  </>
                ) : (
                  <div className="flex aspect-4/5 items-center justify-center border-control border-dashed border-empty-line p-4 text-center text-sm text-ink-2">
                    {reasons[slot.layer](input.temp)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <Button href="/kit" size="lg" className="md:hidden">
          Open the kit builder
        </Button>
      </div>
    </section>
  );
};

export default KitTeaser;
