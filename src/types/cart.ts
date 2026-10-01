import type { Image, Money } from "@/types/product";

export interface CartKit {
  id: string;
  label: string;
  url: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  variantId: string;
  handle: string;
  title: string;
  options: string;
  image: Image | null;
  price: Money;
  total: Money;
  quantityAvailable: number | null;
  kit?: CartKit;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
}

export type CartResult =
  | { ok: true; cart: Cart | null }
  | { ok: false; error: string; cart: Cart | null };
