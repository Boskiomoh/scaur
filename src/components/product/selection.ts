import type { Colour, Product, Size } from "@/types/product";

const defaultSize: Size = "M";

export const variantIn = (colour: Colour, size: Size | undefined) =>
  colour.variants.find((variant) => variant.size === size);

export const isAvailable = (colour: Colour, size: Size | undefined) =>
  !!variantIn(colour, size)?.availableForSale;

// The URL wins; without it the page opens on the first colour in M, as the design does.
export const resolveSelection = (
  product: Product,
  params: { colour?: string; size?: Size; hasSize: boolean },
) => {
  const colour =
    product.colours.find((item) => item.name === params.colour) ??
    product.colours[0];
  const wanted = params.hasSize ? params.size : defaultSize;
  const size = colour && isAvailable(colour, wanted) ? wanted : undefined;
  return { colour, size };
};
