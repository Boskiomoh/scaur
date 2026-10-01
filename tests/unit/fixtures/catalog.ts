import type { Layer } from "@/lib/layers";
import { sizes, type Product, type ShellRole } from "@/types/product";

import catalog from "../../../content/catalog.json";

// The seed catalog in the shape src/lib/catalog.ts produces from Shopify.
export const catalogProducts = (): Product[] =>
  catalog.products.map((item) => ({
    handle: item.handle,
    title: item.title,
    descriptionHtml: `<p>${item.desc}</p>`,
    layer: item.layer.toLowerCase() as Layer,
    range: { lo: item.lo, hi: item.hi },
    warmth: item.warmth,
    shellRole: "role" in item ? (item.role as ShellRole) : undefined,
    price: { amount: `${item.price}.0`, currencyCode: "USD" },
    images: [],
    details: [],
    colours: item.colours.map((colour) => ({
      name: colour.name,
      hex: colour.hex,
      image: null,
      variants: sizes.map((size) => {
        const stock = colour.stock[size];
        return {
          id: `gid://shopify/ProductVariant/${item.handle}-${colour.name}-${size}`,
          colour: colour.name,
          size,
          availableForSale: stock > 0,
          quantityAvailable: stock,
          price: { amount: `${item.price}.0`, currencyCode: "USD" },
        };
      }),
    })),
  }));
