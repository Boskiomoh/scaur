import type { FC } from "react";

import { axisPosition, heat } from "@/lib/heat";
import type { Kit } from "@/lib/kit";

interface KitReadoutProps {
  kit: Kit;
  temp: number;
}

const KitReadout: FC<KitReadoutProps> = ({ kit, temp }) => {
  // Derived
  const summary = kit.isCovered
    ? `That covers a ${temp}°F start with room to spare.`
    : "Colder than your kit is rated for. Add a layer or swap to a warmer one.";

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div role="status" className="flex flex-col gap-1.5 lg:gap-2">
        <span className="text-sm text-ink-2">
          Your kit is comfortable down to
        </span>
        <span className="font-data text-readout-phone font-semibold lg:text-readout">
          {kit.floor}°F
        </span>
        <span className="text-nav text-ink-2">{summary}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div aria-hidden="true" className="relative h-3 bg-mist">
          <div
            className="absolute inset-y-0 end-0"
            style={{
              insetInlineStart: `${axisPosition(kit.floor) * 100}%`,
              background: `linear-gradient(90deg, ${heat(kit.floor)}, ${heat(80)})`,
            }}
          />
          <div
            className="absolute -inset-y-1.5 w-0.5 bg-ink"
            style={{ insetInlineStart: `${axisPosition(temp) * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-data text-2xs text-ink-2">
          <span>-10°F</span>
          <span>35°F</span>
          <span>80°F</span>
        </div>
        <span className="text-caption text-ink-2">
          The black line is today&apos;s start temperature; the bar is what the
          kit covers. Ratings are illustrative.
        </span>
      </div>
    </div>
  );
};

export default KitReadout;
