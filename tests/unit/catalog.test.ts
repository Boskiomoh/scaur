import { afterEach, describe, expect, it, vi } from "vitest";

import { fallbackHex, toProduct, toProducts } from "@/lib/catalog";
import type { RawProduct, RawVariant } from "@/lib/shopify/types";

const money = (amount: string) => ({ amount, currencyCode: "USD" });

const variant = (colour: string, size: string, stock: number): RawVariant => ({
  id: `gid://shopify/ProductVariant/${colour}-${size}`,
  availableForSale: stock > 0,
  quantityAvailable: stock,
  price: money("348.0"),
  selectedOptions: [
    { name: "Colour", value: colour },
    { name: "Size", value: size },
  ],
  image: {
    url: `https://cdn.shopify.com/${colour}.jpg`,
    altText: colour,
    width: 1200,
    height: 1500,
  },
});

const raw = (overrides: Partial<RawProduct> = {}): RawProduct => ({
  handle: "scarp-shell",
  title: "Scarp Shell",
  descriptionHtml: "<p>The stormproof one.</p>",
  productType: "Shell",
  tags: [
    "layer-shell",
    "temp-lo:-10",
    "temp-hi:60",
    "warmth:1",
    "demo",
    "shell-role:storm",
  ],
  priceRange: { minVariantPrice: money("348.0") },
  images: { nodes: [] },
  variants: {
    nodes: [
      variant("Tide", "XL", 1),
      variant("Moss", "M", 3),
      variant("Tide", "XS", 0),
      variant("Moss", "XS", 0),
    ],
  },
  ...overrides,
});

afterEach(() => vi.restoreAllMocks());

describe("toProduct", () => {
  it("reads the layer from the product type and the ratings from tags", () => {
    expect(toProduct(raw())).toMatchObject({
      handle: "scarp-shell",
      layer: "shell",
      range: { lo: -10, hi: 60 },
      warmth: 1,
      shellRole: "storm",
      price: money("348.0"),
    });
  });

  it("groups variants by colour in first-seen order, sizes in size order", () => {
    const product = toProduct(raw())!;
    expect(product.colours.map((colour) => colour.name)).toEqual([
      "Tide",
      "Moss",
    ]);
    expect(product.colours[0].variants.map((item) => item.size)).toEqual([
      "XS",
      "XL",
    ]);
    expect(product.colours[0].variants[1]).toMatchObject({
      quantityAvailable: 1,
      availableForSale: true,
    });
  });

  it("takes each colour's image from its first variant with one", () => {
    expect(toProduct(raw())!.colours[1].image?.url).toBe(
      "https://cdn.shopify.com/Moss.jpg",
    );
  });

  it("maps colour names to swatch hex, with a neutral fallback", () => {
    const colours = toProduct(
      raw({
        variants: { nodes: [variant("Moss", "M", 3), variant("Neon", "M", 3)] },
      }),
    )!.colours;
    expect(colours[0].hex).toBe("#3f5a45");
    expect(colours[1].hex).toBe(fallbackHex);
  });

  it("leaves shellRole off non-shell layers", () => {
    const product = toProduct(
      raw({
        productType: "Base",
        tags: ["temp-lo:40", "temp-hi:75", "warmth:1"],
      }),
    )!;
    expect(product.layer).toBe("base");
    expect(product.shellRole).toBeUndefined();
  });

  it("skips sizes outside the size run", () => {
    const product = toProduct(
      raw({ variants: { nodes: [variant("Moss", "XXXL", 2)] } }),
    )!;
    expect(product.colours).toEqual([]);
  });
});

describe("toProduct: malformed products are excluded, not fatal", () => {
  const cases: [string, Partial<RawProduct>][] = [
    ["an unknown product type", { productType: "Hat" }],
    [
      "a missing warmth tag",
      { tags: ["temp-lo:-10", "temp-hi:60", "shell-role:storm"] },
    ],
    [
      "a non-numeric range",
      { tags: ["temp-lo:cold", "temp-hi:60", "warmth:1", "shell-role:storm"] },
    ],
    [
      "a reversed range",
      { tags: ["temp-lo:60", "temp-hi:-10", "warmth:1", "shell-role:storm"] },
    ],
    [
      "a shell without a role",
      { tags: ["temp-lo:-10", "temp-hi:60", "warmth:1"] },
    ],
    [
      "a shell with an unknown role",
      { tags: ["temp-lo:-10", "temp-hi:60", "warmth:1", "shell-role:sun"] },
    ],
  ];

  it.each(cases)("skips %s and logs it", (_, overrides) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(toProduct(raw(overrides))).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("skipped scarp-shell"),
    );
  });

  it("drops only the bad products from a list", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const products = toProducts([
      raw(),
      raw({ handle: "broken", productType: "Hat" }),
    ]);
    expect(products.map((product) => product.handle)).toEqual(["scarp-shell"]);
  });
});
