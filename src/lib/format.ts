import type { Money, Size, Variant } from "@/types/product";

export const formatMoney = ({ amount, currencyCode }: Money) => {
  const value = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
};

export const formatTemp = (temp: number) => `${temp}°F`;

export const formatRange = ({ lo, hi }: { lo: number; hi: number }) =>
  `${lo} to ${hi}°F`;

export const lowStock = 3;

export const stockLine = (
  size: Size | undefined,
  variant: Variant | undefined,
) => {
  if (!size) return "Pick a size";
  if (!variant || !variant.availableForSale) return `Sold out in ${size}`;
  const quantity = variant.quantityAvailable;
  if (quantity !== null && quantity <= lowStock)
    return `Only ${quantity} left in ${size}`;
  return `${size} in stock`;
};
