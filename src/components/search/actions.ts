"use server";

import { searchProducts } from "@/lib/shopify/products";
import type { Product } from "@/types/product";

export const search = async (
  query: unknown,
): Promise<{ ok: true; products: Product[] } | { ok: false }> => {
  if (typeof query !== "string" || query.length > 80) return { ok: false };
  try {
    return { ok: true, products: await searchProducts(query) };
  } catch {
    return { ok: false };
  }
};
