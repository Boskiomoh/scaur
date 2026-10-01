"use client";

import { useState, type FC } from "react";

import SizePill from "@/components/product/size-pill";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import Segmented from "@/components/ui/segmented";

const activities = ["Day hike", "Trail run", "Alpine climb"];
const sizes = [
  { size: "XS", isSoldOut: true },
  { size: "S", isSoldOut: false },
  { size: "M", isSoldOut: false },
  { size: "L", isSoldOut: false },
];
const views = [
  { value: "photo", label: "Photo" },
  { value: "thermal", label: "Thermal" },
];

const BrandControls: FC = () => {
  // State
  const [activity, setActivity] = useState("Day hike");
  const [size, setSize] = useState("M");
  const [view, setView] = useState("thermal");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3">
        <Button>Add to cart</Button>
        <Button variant="secondary" href="/shop">
          Shop layers
        </Button>
      </div>
      <div className="flex gap-2">
        {activities.map((label) => (
          <Chip
            key={label}
            isPressed={label === activity}
            onClick={() => setActivity(label)}
          >
            {label}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2">
        {sizes.map((item) => (
          <SizePill
            key={item.size}
            size={item.size}
            isSoldOut={item.isSoldOut}
            isSelected={item.size === size}
            onSelect={() => setSize(item.size)}
          />
        ))}
      </div>
      <Segmented
        label="Image view"
        options={views}
        value={view}
        onChange={setView}
      />
    </div>
  );
};

export default BrandControls;
