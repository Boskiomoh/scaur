import type { FC } from "react";

interface SegmentedProps {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const Segmented: FC<SegmentedProps> = ({ label, options, value, onChange }) => (
  <div
    role="group"
    aria-label={label}
    className="inline-flex self-start rounded-full bg-mist p-0.75"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
        className="h-8.5 rounded-full px-4 text-sm font-semibold text-ink aria-pressed:bg-ink aria-pressed:text-snow"
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default Segmented;
