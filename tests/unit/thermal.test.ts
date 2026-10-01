import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { kitThermalSrc, thermalSrc } from "@/lib/thermal";

import catalog from "../../content/catalog.json";

const exists = (src: string) => existsSync(path.join("public", src));

describe("thermal", () => {
  it("resolves every catalog colour to a thermal image that exists", () => {
    for (const product of catalog.products) {
      for (const colour of product.colours) {
        const src = thermalSrc(product.handle, colour.name);
        expect(src, `${product.handle} ${colour.name}`).not.toBeNull();
        expect(exists(src!), src!).toBe(true);
      }
    }
  });

  it("returns null for a colour it doesn't know, so the switch hides", () => {
    expect(thermalSrc("scarp-shell", "Neon")).toBeNull();
  });

  it("has all five kit levels", () => {
    for (const level of [0, 1, 2, 3, 4])
      expect(exists(kitThermalSrc(level))).toBe(true);
  });
});
