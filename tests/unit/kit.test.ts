import { describe, expect, it } from "vitest";

import {
  buildKit,
  defaultKitInput,
  layerLists,
  type KitInput,
} from "@/lib/kit";
import type { Layer } from "@/lib/layers";

import { catalogProducts } from "./fixtures/catalog";

const products = catalogProducts();

// Hike, dry and calm make feels equal the temperature, so thresholds are easy to hit.
const kit = (overrides: Partial<KitInput> = {}) =>
  buildKit(
    { ...defaultKitInput, rain: "dry", wind: "calm", ...overrides },
    products,
  );

const slot = (overrides: Partial<KitInput>, layer: Layer) =>
  kit(overrides).slots.find((item) => item.layer === layer)!;

const picked = (overrides: Partial<KitInput>, layer: Layer) => {
  const item = slot(overrides, layer);
  return item.status === "filled" ? item.product.handle : item.status;
};

describe("buildKit: the worked example", () => {
  const result = buildKit(defaultKitInput, products);

  it("picks the four products from ARCHITECTURE section 5", () => {
    expect(
      result.slots.map((item) =>
        item.status === "filled" ? item.product.handle : item.status,
      ),
    ).toEqual([
      "tarn-merino-quarter-zip",
      "knoll-grid-fleece",
      "belay-hoody",
      "scarp-shell",
    ]);
  });

  it("adds up to $782, 10°F, level 4", () => {
    expect(result.feels).toBe(26);
    expect(result.warmth).toBe(10);
    expect(result.total).toBe(782);
    expect(result.floor).toBe(10);
    expect(result.isCovered).toBe(true);
    expect(result.level).toBe(4);
    expect(result.pieces).toBe(4);
  });
});

describe("buildKit: feels", () => {
  it("adds activity output and subtracts wind and steady rain", () => {
    expect(kit({ activity: "run", temp: 40 }).feels).toBe(52);
    expect(kit({ activity: "alpine", temp: 40 }).feels).toBe(30);
    expect(kit({ temp: 40, wind: "breezy" }).feels).toBe(34);
    expect(kit({ temp: 40, wind: "gusty" }).feels).toBe(26);
    expect(kit({ temp: 40, rain: "showers" }).feels).toBe(40);
    expect(kit({ temp: 40, rain: "steady" }).feels).toBe(34);
  });
});

describe("buildKit: needed layers", () => {
  it("always includes a base", () => {
    expect(slot({ temp: 70 }, "base").status).toBe("filled");
  });

  it("adds a mid below 58", () => {
    expect(slot({ temp: 58 }, "mid")).toMatchObject({
      status: "empty",
      reason: "not-needed",
    });
    expect(slot({ temp: 57 }, "mid").status).toBe("filled");
  });

  it("adds insulation below 30", () => {
    expect(slot({ temp: 30 }, "insulation").status).toBe("empty");
    expect(slot({ temp: 29 }, "insulation").status).toBe("filled");
  });

  it("adds a shell for rain, gusts or below 20", () => {
    expect(slot({ temp: 20 }, "shell").status).toBe("empty");
    expect(slot({ temp: 19 }, "shell").status).toBe("filled");
    expect(slot({ temp: 60, rain: "showers" }, "shell").status).toBe("filled");
    expect(slot({ temp: 60, rain: "steady" }, "shell").status).toBe("filled");
    expect(slot({ temp: 60, wind: "gusty" }, "shell").status).toBe("filled");
    expect(slot({ temp: 60, wind: "breezy" }, "shell").status).toBe("empty");
  });
});

describe("buildKit: automatic picks", () => {
  it("base: quarter-zip below 45", () => {
    expect(picked({ temp: 45 }, "base")).toBe("tarn-merino-crew");
    expect(picked({ temp: 44 }, "base")).toBe("tarn-merino-quarter-zip");
  });

  it("mid: grid below 42, pile below 22", () => {
    expect(picked({ temp: 42 }, "mid")).toBe("knoll-quarter-zip");
    expect(picked({ temp: 41 }, "mid")).toBe("knoll-grid-fleece");
    expect(picked({ temp: 22 }, "mid")).toBe("knoll-grid-fleece");
    expect(picked({ temp: 21 }, "mid")).toBe("bothy-pile-jacket");
  });

  it("insulation: down below 8", () => {
    expect(picked({ temp: 8 }, "insulation")).toBe("belay-hoody");
    expect(picked({ temp: 7 }, "insulation")).toBe("cornice-down-jacket");
  });

  it("shell: by role from rain and feels", () => {
    // Steady rain takes 6 off, so temp 38 is feels 32 and temp 37 is feels 31.
    expect(picked({ temp: 38, rain: "steady" }, "shell")).toBe(
      "downpour-jacket",
    );
    expect(picked({ temp: 37, rain: "steady" }, "shell")).toBe("scarp-shell");
    expect(picked({ temp: 10, rain: "showers" }, "shell")).toBe(
      "squall-jacket",
    );
    expect(picked({ temp: 19 }, "shell")).toBe("scarp-shell");
    expect(picked({ temp: 40, wind: "gusty" }, "shell")).toBe(
      "ridgeback-softshell",
    );
  });

  it("orders each layer by warmth then price", () => {
    const lists = layerLists(products);
    expect(lists.mid.map((product) => product.handle)).toEqual([
      "knoll-quarter-zip",
      "knoll-grid-fleece",
      "bothy-pile-jacket",
    ]);
    expect(lists.shell.map((product) => product.handle)).toEqual([
      "squall-jacket",
      "ridgeback-softshell",
      "downpour-jacket",
      "scarp-shell",
    ]);
  });
});

describe("buildKit: shopper overrides", () => {
  it("swaps cycle through the layer's list", () => {
    expect(picked({ temp: 30, pick: { mid: 2 } }, "mid")).toBe(
      "bothy-pile-jacket",
    );
    expect(picked({ temp: 30, pick: { mid: 3 } }, "mid")).toBe(
      "knoll-quarter-zip",
    );
  });

  it("removes a needed layer and says it was removed", () => {
    expect(
      slot({ temp: 20, off: { insulation: true } }, "insulation"),
    ).toMatchObject({
      status: "empty",
      reason: "removed",
    });
  });

  it("adds a layer that isn't needed back in", () => {
    expect(picked({ temp: 60, on: { shell: true } }, "shell")).toBe(
      "ridgeback-softshell",
    );
  });

  it("puts a removed layer back when it is turned on again", () => {
    expect(
      slot(
        { temp: 20, off: { insulation: true }, on: { insulation: true } },
        "insulation",
      ).status,
    ).toBe("filled");
  });
});

describe("buildKit: warmth, floor and level", () => {
  it("adds one warmth for a shell in wind", () => {
    expect(kit({ temp: 19 }).warmth).toBe(
      kit({ temp: 19, wind: "breezy" }).warmth - 1,
    );
  });

  it("reports when the kit doesn't cover the start", () => {
    const result = kit({ temp: 25, off: { mid: true, insulation: true } });
    expect(result.floor).toBe(58);
    expect(result.isCovered).toBe(false);
  });

  it("clamps the figure level to 0 with nothing in the kit", () => {
    const result = kit({ temp: 70, off: { base: true } });
    expect(result.pieces).toBe(0);
    expect(result.level).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe("buildKit: size availability", () => {
  it("falls back to the next product with the size in stock", () => {
    // Knoll Grid Fleece has no XS; Bothy is next in the mid list.
    const item = slot({ temp: 30, size: "XS" }, "mid");
    expect(item).toMatchObject({
      status: "filled",
      isSubstitute: true,
      index: 1,
    });
    expect(item.status === "filled" && item.product.handle).toBe(
      "bothy-pile-jacket",
    );
  });

  it("wraps around the list", () => {
    // Scarp Shell is sold out in XS in both colours; the list wraps to Squall.
    expect(picked({ temp: 19, size: "XS" }, "shell")).toBe("squall-jacket");
  });

  it("reports sold out when no product in the layer has the size", () => {
    const soldOut = products.map((product) =>
      product.layer !== "insulation"
        ? product
        : {
            ...product,
            colours: product.colours.map((colour) => ({
              ...colour,
              variants: colour.variants.map((variant) => ({
                ...variant,
                availableForSale: false,
              })),
            })),
          },
    );
    const result = buildKit(
      { ...defaultKitInput, rain: "dry", wind: "calm", temp: 10 },
      soldOut,
    );
    expect(result.slots[2]).toMatchObject({
      layer: "insulation",
      status: "sold-out",
    });
  });
});
