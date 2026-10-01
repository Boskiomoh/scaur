import {
  activities,
  defaultKitInput,
  rains,
  winds,
  type KitInput,
} from "@/lib/kit";
import { layers, type Layer } from "@/lib/layers";
import { sizes, type Size } from "@/types/product";

export type SearchParams = Record<string, string | string[] | undefined>;

const layerIds = layers.map((layer) => layer.id);

const first = (params: SearchParams, key: string) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const oneOf = <T extends string>(
  value: string | undefined,
  allowed: readonly T[],
) => allowed.find((item) => item === value);

const wholeNumber = (value: string | undefined, min: number, max: number) => {
  if (!value || !/^-?\d+$/.test(value)) return undefined;
  const number = Number(value);
  return number >= min && number <= max ? number : undefined;
};

const toQuery = (entries: [string, string | undefined][]) => {
  const query = new URLSearchParams(
    entries.filter((entry): entry is [string, string] => !!entry[1]),
  ).toString();
  return query ? `?${query}` : "";
};

// Shop: /shop?layer=mid&t=40&view=thermal

export const views = ["photo", "thermal"] as const;
export type View = (typeof views)[number];

export interface ShopState {
  layer?: Layer;
  temp?: number;
  view: View;
}

export const parseShopParams = (params: SearchParams): ShopState => {
  const temp = wholeNumber(first(params, "t"), -10, 80);
  return {
    layer: oneOf(first(params, "layer"), layerIds),
    temp: temp !== undefined && temp % 5 === 0 ? temp : undefined,
    view: oneOf(first(params, "view"), views) ?? "photo",
  };
};

export const shopHref = ({ layer, temp, view }: ShopState) =>
  `/shop${toQuery([
    ["layer", layer],
    ["t", temp?.toString()],
    ["view", view === "thermal" ? view : undefined],
  ])}`;

// Product: /products/scarp-shell?colour=Tide&size=XL

export interface ProductState {
  colour?: string;
  size?: Size;
}

export const parseProductParams = (
  params: SearchParams,
  colours: string[],
): ProductState => ({
  colour: oneOf(first(params, "colour"), colours),
  size: oneOf(first(params, "size"), sizes),
});

export const productHref = (handle: string, { colour, size }: ProductState) =>
  `/products/${handle}${toQuery([
    ["colour", colour],
    ["size", size],
  ])}`;

// Kit: /kit?a=hike&t=38&r=steady&w=breezy&s=M&pick=mid.2&off=insulation&on=shell

const parseLayerList = (value: string | undefined) =>
  Object.fromEntries(
    (value ?? "")
      .split(",")
      .filter((item): item is Layer => !!oneOf(item, layerIds))
      .map((layer) => [layer, true]),
  ) as KitInput["off"];

const parsePicks = (value: string | undefined) =>
  Object.fromEntries(
    (value ?? "").split(",").flatMap((item) => {
      const [layer, index] = item.split(".");
      const pick = wholeNumber(index, 0, 9);
      return oneOf(layer, layerIds) && pick !== undefined
        ? [[layer, pick]]
        : [];
    }),
  ) as KitInput["pick"];

const layerList = (flags: KitInput["off"]) =>
  layerIds.filter((layer) => flags[layer]).join(",") || undefined;

export const parseKitParams = (params: SearchParams): KitInput => ({
  activity: oneOf(first(params, "a"), activities) ?? defaultKitInput.activity,
  temp: wholeNumber(first(params, "t"), -10, 70) ?? defaultKitInput.temp,
  rain: oneOf(first(params, "r"), rains) ?? defaultKitInput.rain,
  wind: oneOf(first(params, "w"), winds) ?? defaultKitInput.wind,
  size: oneOf(first(params, "s"), sizes) ?? defaultKitInput.size,
  pick: parsePicks(first(params, "pick")),
  off: parseLayerList(first(params, "off")),
  on: parseLayerList(first(params, "on")),
});

export const kitHref = (input: KitInput) =>
  `/kit${toQuery([
    ["a", input.activity],
    ["t", input.temp.toString()],
    ["r", input.rain],
    ["w", input.wind],
    ["s", input.size],
    [
      "pick",
      layerIds
        .filter((layer) => input.pick[layer] !== undefined)
        .map((layer) => `${layer}.${input.pick[layer]}`)
        .join(",") || undefined,
    ],
    ["off", layerList(input.off)],
    ["on", layerList(input.on)],
  ])}`;
