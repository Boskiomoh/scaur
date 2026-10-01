import type { FC } from "react";

interface SizePillProps {
  size: string;
  isSelected: boolean;
  isSoldOut: boolean;
  onSelect: () => void;
}

const SizePill: FC<SizePillProps> = ({
  size,
  isSelected,
  isSoldOut,
  onSelect,
}) => (
  <button
    type="button"
    aria-pressed={isSelected}
    aria-disabled={isSoldOut}
    aria-label={isSoldOut ? `${size}, sold out` : size}
    onClick={isSoldOut ? undefined : onSelect}
    className="h-11 min-w-13 rounded-full border-control border-line bg-snow px-2.5 lg:min-w-13.5 lg:px-3 font-data text-caption text-ink aria-disabled:cursor-not-allowed aria-disabled:border-dashed aria-disabled:border-ghost-line aria-disabled:bg-transparent aria-disabled:text-ghost aria-disabled:line-through aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-snow"
  >
    {size}
  </button>
);

export default SizePill;
