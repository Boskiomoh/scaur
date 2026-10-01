"use client";

import { useRef, useState, type FC } from "react";

import { formatTemp } from "@/lib/format";

interface MadeForSliderProps {
  temp?: number;
  onCommit: (temp?: number) => void;
}

// One notch past 80°F means "Any", so 80°F itself stays selectable.
const anyValue = 85;
const commitDelay = 250;

const MadeForSlider: FC<MadeForSliderProps> = ({ temp, onCommit }) => {
  // State
  const [value, setValue] = useState(temp ?? anyValue);
  const [lastTemp, setLastTemp] = useState(temp);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Derived
  if (temp !== lastTemp) {
    setLastTemp(temp);
    setValue(temp ?? anyValue);
  }
  const isAny = value === anyValue;
  const label = isAny ? "Any" : formatTemp(value);

  // Handlers
  const handleChange = (next: number) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => onCommit(next === anyValue ? undefined : next),
      commitDelay,
    );
  };

  return (
    <div className="flex min-w-0 grow items-center gap-3 lg:grow-0 lg:border-s lg:border-line lg:ps-6">
      <label
        htmlFor="made-for"
        className="text-sm font-semibold whitespace-nowrap"
      >
        Made for
      </label>
      <input
        id="made-for"
        type="range"
        min={-10}
        max={anyValue}
        step={5}
        value={value}
        aria-valuetext={
          isAny ? "Any temperature" : `${value} degrees Fahrenheit`
        }
        onChange={(event) => handleChange(Number(event.target.value))}
        className="min-w-0 grow accent-ember lg:w-50 lg:grow-0"
      />
      <span className="min-w-11 text-end font-data text-caption lg:min-w-16 lg:text-start">
        {label}
      </span>
    </div>
  );
};

export default MadeForSlider;
