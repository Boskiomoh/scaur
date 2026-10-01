"use client";

import { useState, type FC } from "react";

import { isAvailable, variantIn } from "@/components/product/selection";
import SizeGuide from "@/components/product/size-guide";
import SizePill from "@/components/product/size-pill";
import { stockLine } from "@/lib/format";
import { sizes, type Colour, type Size } from "@/types/product";

interface VariantPickerProps {
  colours: Colour[];
  colour: Colour;
  size?: Size;
  onSelect: (colour: Colour, size?: Size) => void;
}

const VariantPicker: FC<VariantPickerProps> = ({
  colours,
  colour,
  size,
  onSelect,
}) => {
  // State
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Handlers
  const handleColour = (next: Colour) =>
    onSelect(next, isAvailable(next, size) ? size : undefined);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-semibold">Colour: {colour.name}</span>
        <div className="flex gap-3 lg:gap-2.5">
          {colours.map((item) => (
            <button
              key={item.name}
              type="button"
              aria-label={item.name}
              aria-pressed={item.name === colour.name}
              onClick={() => handleColour(item)}
              className="size-11 rounded-full border-2 border-frost outline-2 outline-transparent aria-pressed:outline-ink lg:size-10"
              style={{ backgroundColor: item.hex }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Size</span>
          <button
            type="button"
            aria-expanded={isGuideOpen}
            aria-controls="size-guide"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="h-11 text-sm underline underline-offset-3 lg:h-auto"
          >
            Size guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => (
            <SizePill
              key={item}
              size={item}
              isSelected={item === size}
              isSoldOut={!isAvailable(colour, item)}
              onSelect={() => onSelect(colour, item)}
            />
          ))}
        </div>
        <span role="status" className="min-h-4.5 font-data text-caption">
          {stockLine(size, variantIn(colour, size))}
        </span>
        {isGuideOpen && <SizeGuide id="size-guide" />}
      </div>
    </>
  );
};

export default VariantPicker;
