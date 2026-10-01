import type { FC } from "react";

import BrandControls from "@/components/brand/brand-controls";
import Accordion from "@/components/ui/accordion";
import Logo from "@/components/ui/logo";
import Skeleton from "@/components/ui/skeleton";
import { heatStops } from "@/lib/heat";

const swatches = [
  { name: "Frost", className: "bg-frost border border-line" },
  { name: "Snow", className: "bg-snow border border-line" },
  { name: "Ink", className: "bg-ink" },
  { name: "Ink 2", className: "bg-ink-2" },
  { name: "Line", className: "bg-line" },
  { name: "Ember", className: "bg-ember" },
  { name: "Error", className: "bg-error" },
];

const Brand: FC = () => (
  <div className="mx-auto grid max-w-page grid-cols-12 content-start gap-x-6 gap-y-12 p-14">
    <h1 className="sr-only">Brand and controls</h1>

    <div className="col-span-7 flex flex-col gap-3.5">
      <span className="text-nav font-semibold">Interface colour</span>
      <div className="flex gap-3">
        {swatches.map((swatch) => (
          <div key={swatch.name} className="flex flex-1 flex-col gap-1.5">
            <div className={`h-22 ${swatch.className}`} />
            <span className="text-sm font-semibold">{swatch.name}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="col-span-5 flex flex-col gap-3.5">
      <span className="text-nav font-semibold">
        Thermal scale (data only: ratings, thermal views, the kit)
      </span>
      <div
        className="h-22"
        style={{
          background: `linear-gradient(90deg, ${heatStops.map((stop) => `${stop.hex} ${stop.at * 100}%`).join(", ")})`,
        }}
      />
      <div className="flex justify-between font-data text-caption text-ink-2">
        <span>-10°F</span>
        <span>35°F</span>
        <span>80°F</span>
      </div>
    </div>

    <div className="col-span-7 flex flex-col gap-4.5">
      <span className="text-nav font-semibold">Type</span>
      <span className="font-display text-h1">Scarp Shell</span>
      <p className="max-w-copy text-lead leading-normal">
        The stormproof one. Taped seams, a hood that fits over a helmet, and pit
        zips for when the climb heats up.
      </p>
      <span className="font-data text-wordmark">
        38°F $348 Only 3 left in M
      </span>
      <div className="flex items-center gap-6 bg-snow p-6">
        <Logo size="md" isLink={false} />
      </div>
    </div>
    <div className="col-span-5 flex flex-col gap-5">
      <span className="text-nav font-semibold">Controls</span>
      <BrandControls />
      <div>
        <Accordion title="Fabric and fit">
          <p>Three-layer recycled nylon with taped seams. Illustrative spec.</p>
        </Accordion>
        <Accordion title="Care">
          <p>Wash cold, tumble dry low to refresh the water repellency.</p>
        </Accordion>
      </div>
      <div
        aria-busy="true"
        aria-label="Loading example"
        className="flex flex-col gap-3"
      >
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-3.5" />
        <Skeleton className="h-3.5 w-3/5" />
      </div>
    </div>
  </div>
);

export default Brand;
