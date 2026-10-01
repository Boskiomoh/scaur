import type { Layer } from "@/lib/layers";

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof sizes)[number];

export const shellRoles = ["storm", "rain", "showers", "wind"] as const;
export type ShellRole = (typeof shellRoles)[number];

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface Variant {
  id: string;
  colour: string;
  size: Size;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
}

export interface Colour {
  name: string;
  hex: string;
  image: Image | null;
  variants: Variant[];
}

export interface Product {
  handle: string;
  title: string;
  descriptionHtml: string;
  layer: Layer;
  range: { lo: number; hi: number };
  warmth: number;
  shellRole?: ShellRole;
  price: Money;
  colours: Colour[];
  images: Image[];
}
