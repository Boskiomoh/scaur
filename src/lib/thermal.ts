import catalog from "../../content/catalog.json";

const photoByColour = new Map(
  catalog.products.flatMap((product) =>
    product.colours.map(
      (colour) => [`${product.handle}/${colour.name}`, colour.photo] as const,
    ),
  ),
);

export const thermalSrc = (handle: string, colour: string) => {
  const photo = photoByColour.get(`${handle}/${colour}`);
  return photo ? `/thermal/${photo}.webp` : null;
};

export const kitThermalSrc = (level: number) => `/thermal/kit-${level}.webp`;
