import { describe, expect, it } from "vitest";

import { defaultKitInput, type KitInput } from "@/lib/kit";
import {
  kitHref,
  parseKitParams,
  parseProductParams,
  parseShopParams,
  productHref,
  shopHref,
} from "@/lib/url";

const params = (href: string) =>
  Object.fromEntries(new URL(href, "http://localhost").searchParams);

describe("shop state", () => {
  it("round-trips", () => {
    const state = { layer: "mid", temp: 40, view: "thermal" } as const;
    expect(shopHref(state)).toBe("/shop?layer=mid&t=40&view=thermal");
    expect(parseShopParams(params(shopHref(state)))).toEqual(state);
  });

  it("drops defaults from the URL", () => {
    expect(shopHref({ view: "photo" })).toBe("/shop");
  });

  it("falls back on invalid values", () => {
    expect(parseShopParams({ layer: "hats", t: "41", view: "xray" })).toEqual({
      layer: undefined,
      temp: undefined,
      view: "photo",
    });
    expect(parseShopParams({ t: "85" }).temp).toBeUndefined();
    expect(parseShopParams({ t: "-10" }).temp).toBe(-10);
    expect(parseShopParams({ t: "4e1" }).temp).toBeUndefined();
  });

  it("takes the first of repeated params", () => {
    expect(parseShopParams({ layer: ["shell", "base"] }).layer).toBe("shell");
  });
});

describe("product state", () => {
  const colours = ["Moss", "Tide"];

  it("round-trips", () => {
    const href = productHref("scarp-shell", { colour: "Tide", size: "XL" });
    expect(href).toBe("/products/scarp-shell?colour=Tide&size=XL");
    expect(parseProductParams(params(href), colours)).toEqual({
      colour: "Tide",
      size: "XL",
    });
  });

  it("ignores colours the product doesn't have and unknown sizes", () => {
    expect(
      parseProductParams({ colour: "Neon", size: "XXXL" }, colours),
    ).toEqual({
      colour: undefined,
      size: undefined,
    });
  });
});

describe("kit state", () => {
  it("writes the documented URL", () => {
    expect(
      kitHref({
        ...defaultKitInput,
        pick: { mid: 2 },
        off: { insulation: true },
      }),
    ).toBe("/kit?a=hike&t=38&r=steady&w=breezy&s=M&pick=mid.2&off=insulation");
  });

  it("round-trips every field", () => {
    const input: KitInput = {
      activity: "alpine",
      temp: -5,
      rain: "showers",
      wind: "gusty",
      size: "XS",
      pick: { base: 1, shell: 3 },
      off: { mid: true },
      on: { insulation: true, shell: true },
    };
    expect(parseKitParams(params(kitHref(input)))).toEqual(input);
  });

  it("falls back to the defaults on invalid input", () => {
    expect(
      parseKitParams({
        a: "swim",
        t: "200",
        r: "snow",
        w: "storm",
        s: "XXXL",
        pick: "mid.x,hat.2,shell.1",
        off: "hat,base",
      }),
    ).toEqual({ ...defaultKitInput, pick: { shell: 1 }, off: { base: true } });
  });

  it("gives the default kit with no params", () => {
    expect(parseKitParams({})).toEqual(defaultKitInput);
  });
});
