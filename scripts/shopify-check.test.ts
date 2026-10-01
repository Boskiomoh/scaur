// npm run shopify:check: lists the live catalog as the app parses it (WORKFLOW step F).
import { expect, test } from "vitest";

import { getProducts } from "@/lib/shopify/products";

test("the store's catalog parses", async () => {
  process.loadEnvFile(".env.local");
  const products = await getProducts();
  const rows = products.map((product) => ({
    handle: product.handle,
    layer: product.layer,
    range: `${product.range.lo} to ${product.range.hi}°F`,
    warmth: product.warmth,
    role: product.shellRole ?? "",
    price: product.price.amount,
    colours: product.colours
      .map(
        (colour) =>
          `${colour.name}: ${colour.variants
            .map(
              (variant) =>
                `${variant.size} ${variant.quantityAvailable ?? "?"}`,
            )
            .join(" ")}`,
      )
      .join(" | "),
  }));
  console.table(rows);
  expect(products).toHaveLength(11);
});
