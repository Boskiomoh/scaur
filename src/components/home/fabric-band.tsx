import Image from "next/image";
import type { FC } from "react";

import type { Image as ProductImage } from "@/types/product";

interface FabricBandProps {
  image: ProductImage | null;
}

const facts = [
  {
    figure: "20,000 mm",
    text: "Waterproof rating on Scarp and Downpour fabric.",
    isPhone: true,
  },
  {
    figure: "15,000 g",
    text: "Moisture vapour out per square metre per day.",
    isPhone: false,
  },
  {
    figure: "Every seam",
    text: "Taped from the inside, hood to hem.",
    isPhone: true,
  },
];

const FabricBand: FC<FabricBandProps> = ({ image }) => (
  <section
    aria-labelledby="fabric-heading"
    className="mx-auto flex max-w-page flex-col gap-5 py-14 lg:gap-10 lg:pt-28 lg:pb-24"
  >
    <h2
      id="fabric-heading"
      className="px-4 font-display text-h2-phone md:px-8 lg:px-12 lg:text-h2"
    >
      Rain stays on the outside.
    </h2>
    {image && (
      <div className="relative h-65 bg-mist lg:h-105">
        <Image
          src={image.url}
          alt="Water beading on the outer fabric of a shell jacket"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    )}
    <div className="flex flex-col gap-4 px-4 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-5 md:px-8 lg:px-12">
      {facts.map((fact) => (
        <div
          key={fact.figure}
          className={
            fact.isPhone
              ? "flex flex-col gap-1 lg:gap-1.5"
              : "flex flex-col gap-1.5 max-md:hidden"
          }
        >
          <span className="font-data text-wordmark lg:text-sheet-title lg:leading-normal">
            {fact.figure}
          </span>
          <span className="text-nav text-ink-2 lg:text-base">{fact.text}</span>
        </div>
      ))}
      <p className="text-caption text-ink-2 md:col-span-full lg:text-sm">
        Figures are illustrative for this demo store.
      </p>
    </div>
  </section>
);

export default FabricBand;
