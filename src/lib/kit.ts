import { layers, type Layer } from "@/lib/layers";
import type { Product, ShellRole, Size, Variant } from "@/types/product";

export const activities = ["run", "hike", "alpine"] as const;
export const rains = ["dry", "showers", "steady"] as const;
export const winds = ["calm", "breezy", "gusty"] as const;

export type Activity = (typeof activities)[number];
export type Rain = (typeof rains)[number];
export type Wind = (typeof winds)[number];

export interface KitInput {
  activity: Activity;
  temp: number;
  rain: Rain;
  wind: Wind;
  size: Size;
  pick: Partial<Record<Layer, number>>;
  off: Partial<Record<Layer, boolean>>;
  on: Partial<Record<Layer, boolean>>;
}

export type KitSlot =
  | {
      layer: Layer;
      status: "filled";
      index: number;
      product: Product;
      variant: Variant;
      isSubstitute: boolean;
    }
  | { layer: Layer; status: "empty"; reason: "not-needed" | "removed" }
  | { layer: Layer; status: "sold-out"; index: number };

export interface Kit {
  feels: number;
  output: number;
  slots: KitSlot[];
  pieces: number;
  warmth: number;
  floor: number;
  isCovered: boolean;
  level: number;
  total: number;
}

export const defaultKitInput: KitInput = {
  activity: "hike",
  temp: 38,
  rain: "steady",
  wind: "breezy",
  size: "M",
  pick: {},
  off: {},
  on: {},
};

const outputs: Record<Activity, number> = { run: 12, hike: 0, alpine: -10 };
const windChill: Record<Wind, number> = { calm: 0, breezy: 6, gusty: 14 };

export const layerLists = (products: Product[]) =>
  Object.fromEntries(
    layers.map(({ id }) => [
      id,
      products
        .filter((product) => product.layer === id)
        .sort(
          (a, b) =>
            a.warmth - b.warmth ||
            Number(a.price.amount) - Number(b.price.amount),
        ),
    ]),
  ) as Record<Layer, Product[]>;

const autoShellRole = (rain: Rain, feels: number): ShellRole => {
  if (rain === "steady") return feels < 32 ? "storm" : "rain";
  if (rain === "showers") return "showers";
  return feels < 20 ? "storm" : "wind";
};

const autoIndex = (
  layer: Layer,
  feels: number,
  rain: Rain,
  shells: Product[],
) => {
  if (layer === "base") return feels < 45 ? 1 : 0;
  if (layer === "mid") return feels < 22 ? 2 : feels < 42 ? 1 : 0;
  if (layer === "insulation") return feels < 8 ? 1 : 0;
  const role = autoShellRole(rain, feels);
  return Math.max(
    0,
    shells.findIndex((product) => product.shellRole === role),
  );
};

const variantInSize = (product: Product, size: Size) =>
  product.colours
    .flatMap((colour) => colour.variants)
    .find((variant) => variant.size === size && variant.availableForSale);

export const buildKit = (input: KitInput, products: Product[]): Kit => {
  const lists = layerLists(products);
  const output = outputs[input.activity];
  const feels =
    input.temp +
    output -
    windChill[input.wind] -
    (input.rain === "steady" ? 6 : 0);
  const isNeeded: Record<Layer, boolean> = {
    base: true,
    mid: feels < 58,
    insulation: feels < 30,
    shell: input.rain !== "dry" || input.wind === "gusty" || feels < 20,
  };

  const slots = layers.map(({ id: layer }): KitSlot => {
    const isInKit = (isNeeded[layer] && !input.off[layer]) || !!input.on[layer];
    const list = lists[layer];
    if (!isInKit || list.length === 0) {
      return {
        layer,
        status: "empty",
        reason: isNeeded[layer] ? "removed" : "not-needed",
      };
    }

    const index =
      (input.pick[layer] ?? autoIndex(layer, feels, input.rain, list)) %
      list.length;
    for (let step = 0; step < list.length; step++) {
      const product = list[(index + step) % list.length];
      const variant = variantInSize(product, input.size);
      if (variant)
        return {
          layer,
          status: "filled",
          index,
          product,
          variant,
          isSubstitute: step > 0,
        };
    }
    return { layer, status: "sold-out", index };
  });

  const filled = slots.filter((slot) => slot.status === "filled");
  const warmth = filled.reduce(
    (sum, slot) =>
      sum +
      slot.product.warmth +
      (slot.layer === "shell" && input.wind !== "calm" ? 1 : 0),
    0,
  );
  const floor = 70 - warmth * 6 - output;

  return {
    feels,
    output,
    slots,
    pieces: filled.length,
    warmth,
    floor,
    isCovered: floor <= feels - output,
    level: Math.min(4, Math.max(0, filled.length - 1 + (warmth >= 9 ? 1 : 0))),
    total: filled.reduce(
      (sum, slot) => sum + Number(slot.variant.price.amount),
      0,
    ),
  };
};
