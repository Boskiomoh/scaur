import Image from "next/image";
import type { FC } from "react";

import { cn } from "@/lib/cn";
import { kitThermalSrc } from "@/lib/thermal";

interface KitFigureProps {
  level: number;
  pieces: number;
}

const levels = [0, 1, 2, 3, 4];

// All five levels stay mounted so warmth cross-fades between them (the one eased moment).
const KitFigure: FC<KitFigureProps> = ({ level, pieces }) => (
  <figure className="flex flex-col gap-2 lg:gap-2.5">
    <div className="relative h-60 bg-heat-0 md:h-75 lg:h-110">
      {levels.map((item) => (
        <Image
          key={item}
          src={kitThermalSrc(item)}
          alt={
            item === level
              ? `Illustrative thermal view of a hiker, warmer with ${pieces} ${pieces === 1 ? "layer" : "layers"}`
              : ""
          }
          aria-hidden={item !== level}
          fill
          sizes="(min-width: 1024px) 25vw, 100vw"
          priority={item === level}
          className={cn(
            "object-cover object-kit-figure transition-opacity duration-360 ease-warmth lg:object-center",
            item === level ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
    <figcaption className="text-caption text-ink-2">
      Illustrative thermal view: warmth spreads outward with each layer you add.
    </figcaption>
  </figure>
);

export default KitFigure;
