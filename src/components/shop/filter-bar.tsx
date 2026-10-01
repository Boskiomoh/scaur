"use client";

import { useRouter } from "next/navigation";
import { useTransition, type FC, type ReactNode } from "react";

import MadeForSlider from "@/components/shop/made-for-slider";
import Chip from "@/components/ui/chip";
import Segmented from "@/components/ui/segmented";
import { cn } from "@/lib/cn";
import { layers } from "@/lib/layers";
import { shopHref, views, type ShopState, type View } from "@/lib/url";

interface FilterBarProps {
  state: ShopState;
  count: number;
  children: ReactNode;
}

const layerChips = [{ id: undefined, label: "All" }, ...layers];
const viewOptions = views.map((view) => ({
  value: view,
  label: view === "photo" ? "Photo" : "Thermal",
}));

const FilterBar: FC<FilterBarProps> = ({ state, count, children }) => {
  // Router
  const router = useRouter();

  // State
  const [isPending, startTransition] = useTransition();

  // Handlers
  const update = (next: Partial<ShopState>) =>
    startTransition(() =>
      router.replace(shopHref({ ...state, ...next }), { scroll: false }),
    );

  return (
    <>
      <div
        role="search"
        aria-label="Filter products"
        className="flex flex-col gap-3.5 border-b border-line pb-4 md:mx-8 md:border-t md:pt-4 lg:mx-12 lg:flex-row lg:items-center lg:gap-6"
      >
        <div
          role="group"
          aria-label="Layer"
          className="flex gap-2 overflow-x-auto px-4 md:flex-wrap md:overflow-visible md:px-0"
        >
          {layerChips.map((chip) => (
            <Chip
              key={chip.label}
              isPressed={state.layer === chip.id}
              onClick={() => update({ layer: chip.id })}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
        <div className="flex px-4 md:px-0">
          <MadeForSlider
            temp={state.temp}
            onCommit={(temp) => update({ temp })}
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 md:px-0 lg:ms-auto">
          <span role="status" className="font-data text-caption text-ink-2">
            {count === 1 ? "1 product" : `${count} products`}
          </span>
          <Segmented
            label="Image view"
            options={viewOptions}
            value={state.view}
            onChange={(view) => update({ view: view as View })}
          />
        </div>
      </div>
      <div
        aria-busy={isPending}
        className={cn("transition-opacity", isPending && "opacity-60")}
      >
        {children}
      </div>
    </>
  );
};

export default FilterBar;
