"use client";

import type { FC } from "react";

import {
  activityLabels,
  rainLabels,
  severity,
  tempWords,
  windLabels,
} from "@/components/kit/kit-copy";
import ChoiceGroup from "@/components/kit/choice-group";
import { cn } from "@/lib/cn";
import { heatStops } from "@/lib/heat";
import { activities, rains, winds, type KitInput } from "@/lib/kit";
import { kitHref } from "@/lib/url";
import { sizes, type Size } from "@/types/product";

interface KitFormProps {
  input: KitInput;
  onChange: (next: Partial<KitInput>) => void;
}

const tempSizes = [
  "text-wordmark",
  "text-temp-2",
  "text-temp-3",
  "text-temp-4",
];

const KitForm: FC<KitFormProps> = ({ input, onChange }) => (
  <form
    action="/kit"
    method="get"
    aria-labelledby="kit-heading"
    onSubmit={(event) => event.preventDefault()}
    className="flex flex-col gap-7 md:grid md:grid-cols-2 md:gap-x-6 lg:flex lg:gap-8"
  >
    <div className="flex flex-col gap-3 md:col-span-2">
      <h1
        id="kit-heading"
        className="font-display text-collection-phone leading-product md:text-product"
      >
        Build your kit
      </h1>
      <p className="text-base leading-lead text-ink-2 lg:text-blurb">
        Tell us the day. We pick one piece per layer, skip what you won&apos;t
        need, and you swap anything you like.
      </p>
    </div>

    <ChoiceGroup
      legend="Activity"
      name="a"
      className="md:col-start-1 md:row-start-2"
      options={activities}
      labels={activityLabels}
      value={input.activity}
      onPick={(activity) => onChange({ activity })}
    />

    <div className="flex flex-col gap-2.5 md:col-span-2 md:row-start-3">
      <label htmlFor="kit-temp" className="text-sm font-semibold">
        Temperature at the start
      </label>
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "font-data leading-none font-semibold",
            tempSizes[severity(input.temp)],
          )}
        >
          {input.temp}°F
        </span>
        <span className="text-sm text-ink-2">
          {tempWords[severity(input.temp)]}
        </span>
      </div>
      <input
        id="kit-temp"
        name="t"
        type="range"
        min={-10}
        max={70}
        step={1}
        value={input.temp}
        aria-valuetext={`${input.temp} degrees Fahrenheit`}
        onChange={(event) => onChange({ temp: Number(event.target.value) })}
        className="-my-3.5 h-11 w-full accent-ember"
      />
      <div
        aria-hidden="true"
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, ${heatStops.map((stop) => stop.hex).join(", ")})`,
        }}
      />
    </div>

    <ChoiceGroup
      legend="Rain"
      name="r"
      className="md:col-start-1 md:row-start-4"
      options={rains}
      labels={rainLabels}
      value={input.rain}
      onPick={(rain) => onChange({ rain })}
    />
    <ChoiceGroup
      legend="Wind"
      name="w"
      className="md:col-start-2 md:row-start-4"
      options={winds}
      labels={windLabels}
      value={input.wind}
      onPick={(wind) => onChange({ wind })}
    />

    <div className="flex flex-col gap-2.5 md:col-start-2 md:row-start-2">
      <label htmlFor="kit-size" className="text-sm font-semibold">
        Your size
      </label>
      <select
        id="kit-size"
        name="s"
        value={input.size}
        onChange={(event) => onChange({ size: event.target.value as Size })}
        className="h-11 min-w-30 self-start rounded-full border-control border-field bg-snow px-3 text-base lg:h-10 lg:text-sm"
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>

    {["pick", "off", "on"].map((key) => {
      const value = new URLSearchParams(kitHref(input).split("?")[1]).get(key);
      return (
        value && <input key={key} type="hidden" name={key} value={value} />
      );
    })}

    <noscript>
      <button
        type="submit"
        className="h-12 rounded-full border-control border-ink px-6 font-semibold"
      >
        Update kit
      </button>
    </noscript>
  </form>
);

export default KitForm;
