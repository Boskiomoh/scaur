import type { Activity, KitInput, Rain, Wind } from "@/lib/kit";
import type { Layer } from "@/lib/layers";

export const activityLabels: Record<Activity, string> = {
  run: "Trail run",
  hike: "Day hike",
  alpine: "Alpine climb",
};

export const rainLabels: Record<Rain, string> = {
  dry: "Dry",
  showers: "Showers",
  steady: "Steady rain",
};

export const windLabels: Record<Wind, string> = {
  calm: "Calm",
  breezy: "Breezy",
  gusty: "Gusty",
};

export const severity = (temp: number) =>
  temp < 15 ? 3 : temp < 32 ? 2 : temp < 50 ? 1 : 0;

export const tempWords = ["Mild", "Cool", "Cold", "Bitter"];

// The cart groups a kit under this label: "Kit: day hike, 38°F, steady rain".
export const kitLabel = (input: KitInput) =>
  `${activityLabels[input.activity].toLowerCase()}, ${input.temp}°F, ${rainLabels[input.rain].toLowerCase()}`;

export const emptyReason = (layer: Layer, temp: number) =>
  ({
    base: "Removed from this kit",
    mid: `Warm enough to skip a mid layer at ${temp}°F`,
    insulation: `No insulation needed at ${temp}°F`,
    shell: "Dry and not too windy: no shell needed",
  })[layer];
