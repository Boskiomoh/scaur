import type { FC } from "react";

import { cn } from "@/lib/cn";
import { axisPosition, heat } from "@/lib/heat";

interface RangeBarProps {
  lo: number;
  hi: number;
  className?: string;
}

// The fill's position and gradient are data on the shared -10 to 80°F axis.
const RangeBar: FC<RangeBarProps> = ({ lo, hi, className }) => {
  const start = axisPosition(lo) * 100;
  const end = axisPosition(hi) * 100;

  return (
    <div aria-hidden="true" className={cn("relative bg-mist", className)}>
      <div
        className="absolute inset-y-0"
        style={{
          insetInlineStart: `${start}%`,
          width: `${end - start}%`,
          background: `linear-gradient(90deg, ${heat(lo)}, ${heat(hi)})`,
        }}
      />
    </div>
  );
};

export default RangeBar;
