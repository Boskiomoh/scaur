import type { Metadata } from "next";

import Credits from "@/components/credits";
import { photoCredits } from "@/data/credits";
import { getProducts } from "@/lib/shopify/products";
import { kitThermalSrc } from "@/lib/thermal";
import type { Image } from "@/types/product";

export const metadata: Metadata = {
  title: "Credits",
  description: "Photo, type and icon credits for the Scaur demo store.",
};

export default async function Page() {
  const products = await getProducts().catch(() => []);
  const all = products.flatMap((product) => [
    ...product.images,
    ...product.colours.flatMap((colour) =>
      colour.image ? [colour.image] : [],
    ),
  ]);
  // Shopify keeps the original file name, so each credit finds its photo by name.
  const images: Record<string, Image | string> = Object.fromEntries(
    photoCredits.flatMap((credit): [string, Image | string][] => {
      if (credit.photo === "shell-fog-ridge")
        return [[credit.photo, kitThermalSrc(4)]];
      const image = all.find((item) =>
        new URL(item.url).pathname.endsWith(`/${credit.photo}.jpg`),
      );
      return image ? [[credit.photo, image]] : [];
    }),
  );
  return <Credits images={images} />;
}
