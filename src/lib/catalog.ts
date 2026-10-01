import type { Layer } from "@/lib/layers";
import type { RawProduct } from "@/lib/shopify/types";
import {
  shellRoles,
  sizes,
  type Colour,
  type Product,
  type ShellRole,
  type Size,
  type Variant,
} from "@/types/product";

import catalog from "../../content/catalog.json";

const layerByType: Record<string, Layer> = {
  Base: "base",
  Mid: "mid",
  Insulation: "insulation",
  Shell: "shell",
};

// Swatch colours come from the seed catalog; Shopify only stores the colour name.
const hexByColour = new Map(
  catalog.products.flatMap((product) =>
    product.colours.map((colour) => [colour.name, colour.hex] as const),
  ),
);
export const fallbackHex = "#8a929a";

const tagNumber = (tags: string[], key: string) => {
  const tag = tags.find((item) => item.startsWith(`${key}:`));
  if (!tag) return null;
  const value = Number(tag.slice(key.length + 1));
  return Number.isInteger(value) ? value : null;
};

const isSize = (value: string): value is Size =>
  (sizes as readonly string[]).includes(value);
const isShellRole = (value: string): value is ShellRole =>
  (shellRoles as readonly string[]).includes(value);

const option = (
  variant: RawProduct["variants"]["nodes"][number],
  name: string,
) => variant.selectedOptions.find((item) => item.name === name)?.value;

export const toProduct = (raw: RawProduct): Product | null => {
  const layer = layerByType[raw.productType];
  const lo = tagNumber(raw.tags, "temp-lo");
  const hi = tagNumber(raw.tags, "temp-hi");
  const warmth = tagNumber(raw.tags, "warmth");
  const role = raw.tags
    .find((tag) => tag.startsWith("shell-role:"))
    ?.slice("shell-role:".length);

  const problems = [
    !layer && `product type "${raw.productType}"`,
    (lo === null || hi === null || lo >= hi) && "temp-lo/temp-hi tags",
    warmth === null && "warmth tag",
    layer === "shell" && !(role && isShellRole(role)) && "shell-role tag",
  ].filter(Boolean);
  if (problems.length > 0) {
    console.warn(`catalog: skipped ${raw.handle}: bad ${problems.join(", ")}`);
    return null;
  }

  const colours = new Map<string, Colour>();
  for (const rawVariant of raw.variants.nodes) {
    const colourName =
      option(rawVariant, "Colour") ?? option(rawVariant, "Color") ?? "Default";
    const size = option(rawVariant, "Size");
    if (!size || !isSize(size)) continue;

    const variant: Variant = {
      id: rawVariant.id,
      colour: colourName,
      size,
      availableForSale: rawVariant.availableForSale,
      quantityAvailable: rawVariant.quantityAvailable,
      price: rawVariant.price,
    };
    const colour = colours.get(colourName);
    if (colour) {
      colour.variants.push(variant);
      colour.image ??= rawVariant.image;
    } else {
      colours.set(colourName, {
        name: colourName,
        hex: hexByColour.get(colourName) ?? fallbackHex,
        image: rawVariant.image,
        variants: [variant],
      });
    }
  }
  for (const colour of colours.values()) {
    colour.variants.sort(
      (a, b) => sizes.indexOf(a.size) - sizes.indexOf(b.size),
    );
  }

  return {
    handle: raw.handle,
    title: raw.title,
    descriptionHtml: raw.descriptionHtml,
    layer,
    range: { lo: lo!, hi: hi! },
    warmth: warmth!,
    shellRole: layer === "shell" ? (role as ShellRole) : undefined,
    price: raw.priceRange.minVariantPrice,
    colours: [...colours.values()],
    images: raw.images.nodes,
  };
};

export const toProducts = (raws: RawProduct[]) =>
  raws.map(toProduct).filter((product): product is Product => product !== null);
