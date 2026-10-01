import type { ComponentProps, FC } from "react";

import { cn } from "@/lib/cn";

interface ChipProps extends Omit<ComponentProps<"button">, "aria-pressed"> {
  isPressed: boolean;
}

const Chip: FC<ChipProps> = ({ isPressed, className, ...props }) => (
  <button
    type="button"
    aria-pressed={isPressed}
    {...props}
    className={cn(
      "h-10 shrink-0 rounded-full border-control border-line bg-snow px-4 text-sm font-medium whitespace-nowrap text-ink",
      "aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-snow",
      className,
    )}
  />
);

export default Chip;
