import { describe, expect, it } from "vitest";

import { formatMoney, formatRange, formatTemp, stockLine } from "@/lib/format";
import type { Variant } from "@/types/product";

const variant = (
  quantityAvailable: number | null,
  availableForSale = true,
): Variant => ({
  id: "gid://shopify/ProductVariant/1",
  colour: "Moss",
  size: "M",
  availableForSale,
  quantityAvailable,
  price: { amount: "348.0", currencyCode: "USD" },
});

describe("format", () => {
  it("prints whole dollars without cents and keeps cents otherwise", () => {
    expect(formatMoney({ amount: "348.0", currencyCode: "USD" })).toBe("$348");
    expect(formatMoney({ amount: "782.5", currencyCode: "USD" })).toBe(
      "$782.50",
    );
    expect(formatMoney({ amount: "1204.0", currencyCode: "USD" })).toBe(
      "$1,204",
    );
  });

  it("prints temperatures and ranges without dashes", () => {
    expect(formatTemp(-10)).toBe("-10°F");
    expect(formatRange({ lo: 25, hi: 60 })).toBe("25 to 60°F");
  });

  it("writes the stock line", () => {
    expect(stockLine(undefined, undefined)).toBe("Pick a size");
    expect(stockLine("M", variant(3))).toBe("Only 3 left in M");
    expect(stockLine("M", variant(1))).toBe("Only 1 left in M");
    expect(stockLine("M", variant(4))).toBe("M in stock");
    expect(stockLine("M", variant(null))).toBe("M in stock");
    expect(stockLine("XS", variant(0, false))).toBe("Sold out in XS");
  });
});
