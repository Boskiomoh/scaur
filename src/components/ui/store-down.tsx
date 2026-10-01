import type { FC } from "react";

import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface StoreDownProps {
  onRetry: () => void;
  className?: string;
}

const StoreDown: FC<StoreDownProps> = ({ onRetry, className }) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-start gap-3.5 bg-snow p-6 md:p-8",
      className,
    )}
  >
    <h2 className="font-display text-2xl leading-tight">
      The store isn&apos;t responding right now.
    </h2>
    <p className="text-base leading-lead text-ink-2">
      Try again in a minute. Pages you have already opened keep working.
    </p>
    <Button variant="secondary" size="sm" onClick={onRetry}>
      Retry
    </Button>
  </div>
);

export default StoreDown;
