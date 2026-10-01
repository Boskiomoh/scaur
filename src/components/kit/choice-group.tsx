interface ChoiceGroupProps<T extends string> {
  legend: string;
  name: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onPick: (value: T) => void;
}

// Radios styled as chips, so the form also works as a plain GET form without JavaScript.
const ChoiceGroup = <T extends string>({
  legend,
  name,
  options,
  labels,
  value,
  onPick,
}: ChoiceGroupProps<T>) => (
  <fieldset className="flex flex-col gap-2.5">
    <legend className="mb-2.5 text-sm font-semibold">{legend}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option} className="relative">
          <input
            type="radio"
            name={name}
            value={option}
            checked={option === value}
            onChange={() => onPick(option)}
            className="peer absolute inset-0 cursor-pointer appearance-none rounded-full"
          />
          <span className="pointer-events-none flex h-11 items-center lg:h-10 rounded-full border-control border-line bg-snow px-4 text-sm font-medium whitespace-nowrap peer-checked:border-ink peer-checked:bg-ink peer-checked:text-snow peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
            {labels[option]}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default ChoiceGroup;
