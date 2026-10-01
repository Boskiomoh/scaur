import { describe, expect, it } from "vitest";

import { axisPosition, heat } from "@/lib/heat";

describe("heat", () => {
  it("returns the end stops at and beyond the axis", () => {
    expect(heat(-10)).toBe("rgb(20 12 46)");
    expect(heat(-40)).toBe("rgb(20 12 46)");
    expect(heat(80)).toBe("rgb(255 224 138)");
    expect(heat(120)).toBe("rgb(255 224 138)");
  });

  it("hits each stop exactly at its position", () => {
    // 0.45 along -10 to 80 is 30.5°F, the magenta stop.
    expect(heat(30.5)).toBe("rgb(163 32 111)");
  });

  it("interpolates between stops", () => {
    // Halfway between 0.66 (#e0452b) and 0.84 (#f79a2e) is 57.5°F.
    expect(heat(57.5)).toBe("rgb(236 112 45)");
  });

  it("places temperatures on the shared axis", () => {
    expect(axisPosition(35)).toBe(0.5);
  });
});
