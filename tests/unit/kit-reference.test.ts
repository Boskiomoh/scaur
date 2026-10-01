import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { activities, buildKit, defaultKitInput, rains, winds } from "@/lib/kit";

import { catalogProducts } from "./fixtures/catalog";

interface ReferenceVals {
  slots: { filled: boolean; name?: string }[];
  floorLabel: string;
  total: string;
  warmthSrc: string;
}

// Runs the kit rules embedded in the design artboard, the reference the app must match.
const loadReference = () => {
  const html = readFileSync("docs/design/Kit.dc.html", "utf8");
  const script = html
    .split("data-dc-script")[1]
    .split(">")
    .slice(1)
    .join(">")
    .split("</script>")[0];
  const Component = new Function("DCLogic", `${script}; return Component;`)(
    class {
      state: Record<string, unknown> = {};
      setState() {}
    },
  );
  return (state: Record<string, unknown>): ReferenceVals => {
    const component = new Component({});
    component.state = { ...component.state, ...state };
    return component.renderVals();
  };
};

describe("buildKit agrees with docs/design/Kit.dc.html", () => {
  const reference = loadReference();
  const products = catalogProducts();
  const levelSrcs: string[] = [];

  it("for every activity, rain and wind from -10°F to 70°F in size M", () => {
    let cases = 0;
    for (const [act, activity] of activities.entries()) {
      for (const [rainIndex, rain] of rains.entries()) {
        for (const [windIndex, wind] of winds.entries()) {
          for (let temp = -10; temp <= 70; temp++) {
            const expected = reference({
              act,
              temp,
              rain: rainIndex,
              wind: windIndex,
            });
            const actual = buildKit(
              { ...defaultKitInput, activity, temp, rain, wind },
              products,
            );
            const label = `${activity} ${temp} ${rain} ${wind}`;
            expect(
              actual.slots.map((slot) =>
                slot.status === "filled" ? slot.product.title : null,
              ),
              label,
            ).toEqual(
              expected.slots.map((slot) => (slot.filled ? slot.name : null)),
            );
            expect(`${actual.floor}°F`, label).toBe(expected.floorLabel);
            expect(`$${actual.total}`, label).toBe(expected.total);
            levelSrcs[actual.level] ??= expected.warmthSrc;
            expect(expected.warmthSrc, label).toBe(levelSrcs[actual.level]);
            cases++;
          }
        }
      }
    }
    expect(cases).toBe(3 * 3 * 3 * 81);
  });
});
