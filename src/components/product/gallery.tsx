"use client";

import Image from "next/image";
import { useState, type FC } from "react";

import Segmented from "@/components/ui/segmented";
import { cn } from "@/lib/cn";
import type { Colour, Image as ProductImage } from "@/types/product";

interface GalleryProps {
  title: string;
  colour: Colour;
  details: ProductImage[];
  thermal: string | null;
}

const viewOptions = [
  { value: "photo", label: "Photo" },
  { value: "thermal", label: "Thermal" },
] as const;

const Gallery: FC<GalleryProps> = ({ title, colour, details, thermal }) => {
  // State
  const [index, setIndex] = useState(0);
  const [isThermal, setIsThermal] = useState(false);

  // Derived
  const shots = [colour.image, ...details].filter((shot) => shot !== null);
  const shot = shots[index] ?? shots[0];
  const isLifestyle = index === 0;
  const showThermal = isThermal && isLifestyle && thermal !== null;
  const alt = shot?.altText ?? title;

  // Handlers
  const handleView = (value: string) => {
    setIsThermal(value === "thermal");
    if (value === "thermal") setIndex(0);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-3.5 lg:gap-4">
      <div
        className={cn(
          "relative h-110 md:h-160 lg:h-190",
          isLifestyle ? "p-5 md:p-10 lg:p-14" : "bg-mist",
        )}
        style={isLifestyle ? { backgroundColor: colour.hex } : undefined}
      >
        <div className="relative size-full">
          {showThermal ? (
            <Image
              src={thermal}
              alt={`Illustrative thermal view of the ${title}: warmer areas read brighter`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-stage"
            />
          ) : (
            shot && (
              <Image
                src={shot.url}
                alt={alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-stage"
              />
            )
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="flex gap-2 md:gap-2.5">
          {shots.map((item, i) => (
            <button
              key={item.url}
              type="button"
              aria-label={
                i === 0
                  ? "Show on the hill"
                  : `Show ${item.altText ?? "detail"}`
              }
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="relative h-15 w-12 bg-mist outline-2 md:h-20 md:w-16 outline-offset-2 outline-transparent aria-pressed:outline-ink lg:h-22 lg:w-18"
            >
              <Image
                src={item.url}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {thermal && (
          <div className="ms-auto">
            <Segmented
              label="Image view"
              options={viewOptions}
              value={showThermal ? "thermal" : "photo"}
              onChange={handleView}
            />
          </div>
        )}
      </div>

      {showThermal && (
        <p className="text-caption text-ink-2 lg:text-sm">
          Illustrative thermal view, not a measurement. Warmer areas read
          brighter.
        </p>
      )}
    </div>
  );
};

export default Gallery;
