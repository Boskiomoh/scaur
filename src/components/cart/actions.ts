"use server";

import { cookies } from "next/headers";

import { kitAttributes, toCart } from "@/lib/shopify/cart";
import { storefrontFetch } from "@/lib/shopify/client";
import {
  cartCreateMutation,
  cartLinesAddMutation,
  cartLinesRemoveMutation,
  cartLinesUpdateMutation,
  cartQuery,
  variantStockQuery,
} from "@/lib/shopify/queries";
import type {
  CartMutationResult,
  RawCart,
  VariantStockResponse,
} from "@/lib/shopify/types";
import type { Cart, CartResult } from "@/types/cart";

const cookieName = "scaur_cart";
const maxQuantity = 10;
const addFailed = "Couldn't add that. Try again.";
const updateFailed = "Couldn't update your cart. Try again.";

interface LineInput {
  variantId: string;
  quantity: number;
}

const isVariantId = (value: unknown): value is string =>
  typeof value === "string" &&
  /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value);

const isLineId = (value: unknown): value is string =>
  typeof value === "string" &&
  value.startsWith("gid://shopify/CartLine/") &&
  value.length < 200;

const isQuantity = (value: unknown, min: number): value is number =>
  Number.isInteger(value) &&
  (value as number) >= min &&
  (value as number) <= maxQuantity;

const loadCart = async (): Promise<Cart | null> => {
  const id = (await cookies()).get(cookieName)?.value;
  if (!id) return null;
  const data = await storefrontFetch<{ cart: RawCart | null }>(
    cartQuery,
    { id },
    { cache: "no-store" },
  );
  return data.cart ? toCart(data.cart) : null;
};

const saveCartId = async (id: string) =>
  (await cookies()).set(cookieName, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

// Shopify caps quantities at stock silently, so the server checks first and says so.
const checkStock = async (cart: Cart | null, lines: LineInput[]) => {
  const { nodes } = await storefrontFetch<VariantStockResponse>(
    variantStockQuery,
    { ids: lines.map((line) => line.variantId) },
    { cache: "no-store" },
  );
  for (const line of lines) {
    const variant = nodes.find((node) => node?.id === line.variantId);
    if (!variant?.availableForSale) return "That size just sold out.";
    const inCart =
      cart?.lines
        .filter((item) => item.variantId === line.variantId)
        .reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    const available = variant.quantityAvailable;
    if (available !== null && inCart + line.quantity > available) {
      return `Only ${available} left in this size.`;
    }
  }
  return null;
};

const mutationResult = async (
  result: CartMutationResult,
  previous: Cart | null,
  error: string,
): Promise<CartResult> => {
  if (!result.cart || result.userErrors.length > 0) {
    console.error("Shopify refused the cart change:", result.userErrors);
    return { ok: false, error, cart: previous };
  }
  await saveCartId(result.cart.id);
  return { ok: true, cart: toCart(result.cart) };
};

const addLines = async (
  lines: LineInput[],
  attributes: { key: string; value: string }[] = [],
): Promise<CartResult> => {
  let cart: Cart | null = null;
  try {
    cart = await loadCart();
    const stockError = await checkStock(cart, lines);
    if (stockError) return { ok: false, error: stockError, cart };

    const input = lines.map((line) => ({
      merchandiseId: line.variantId,
      quantity: line.quantity,
      attributes,
    }));
    const data = cart
      ? await storefrontFetch<{ cartLinesAdd: CartMutationResult }>(
          cartLinesAddMutation,
          { cartId: cart.id, lines: input },
          { cache: "no-store" },
        ).then((response) => response.cartLinesAdd)
      : await storefrontFetch<{ cartCreate: CartMutationResult }>(
          cartCreateMutation,
          { lines: input },
          { cache: "no-store" },
        ).then((response) => response.cartCreate);
    return mutationResult(data, cart, addFailed);
  } catch (error) {
    console.error("Cart add failed:", error);
    return { ok: false, error: addFailed, cart };
  }
};

export const getCart = async (): Promise<CartResult> => {
  try {
    return { ok: true, cart: await loadCart() };
  } catch (error) {
    console.error("Cart load failed:", error);
    return {
      ok: false,
      error: "The store isn't responding right now.",
      cart: null,
    };
  }
};

export const addLine = async (
  variantId: unknown,
  quantity: unknown,
): Promise<CartResult> => {
  if (!isVariantId(variantId) || !isQuantity(quantity, 1)) {
    return { ok: false, error: addFailed, cart: null };
  }
  return addLines([{ variantId, quantity }]);
};

export const addKit = async (
  variantIds: unknown,
  kit: { label: unknown; url: unknown },
): Promise<CartResult> => {
  const isValid =
    Array.isArray(variantIds) &&
    variantIds.length > 0 &&
    variantIds.length <= 4 &&
    variantIds.every(isVariantId) &&
    typeof kit.label === "string" &&
    kit.label.length <= 80 &&
    typeof kit.url === "string" &&
    kit.url.startsWith("/kit") &&
    kit.url.length <= 300;
  if (!isValid) return { ok: false, error: addFailed, cart: null };

  return addLines(
    variantIds.map((variantId: string) => ({ variantId, quantity: 1 })),
    [
      { key: kitAttributes.id, value: crypto.randomUUID().slice(0, 8) },
      { key: kitAttributes.label, value: kit.label as string },
      { key: kitAttributes.url, value: kit.url as string },
    ],
  );
};

export const addPlainLines = async (
  variantIds: unknown,
): Promise<CartResult> => {
  if (
    !Array.isArray(variantIds) ||
    variantIds.length > 4 ||
    !variantIds.every(isVariantId)
  ) {
    return { ok: false, error: addFailed, cart: null };
  }
  return addLines(
    variantIds.map((variantId: string) => ({ variantId, quantity: 1 })),
  );
};

export const updateLine = async (
  lineId: unknown,
  quantity: unknown,
): Promise<CartResult> => {
  if (!isLineId(lineId) || !isQuantity(quantity, 0)) {
    return { ok: false, error: updateFailed, cart: null };
  }
  if (quantity === 0) return removeLine(lineId);

  let cart: Cart | null = null;
  try {
    cart = await loadCart();
    const line = cart?.lines.find((item) => item.id === lineId);
    if (!cart || !line) return { ok: false, error: updateFailed, cart };
    if (line.quantityAvailable !== null && quantity > line.quantityAvailable) {
      return {
        ok: false,
        error: `Only ${line.quantityAvailable} left in this size.`,
        cart,
      };
    }
    const { cartLinesUpdate } = await storefrontFetch<{
      cartLinesUpdate: CartMutationResult;
    }>(
      cartLinesUpdateMutation,
      { cartId: cart.id, lines: [{ id: lineId, quantity }] },
      { cache: "no-store" },
    );
    return mutationResult(cartLinesUpdate, cart, updateFailed);
  } catch (error) {
    console.error("Cart update failed:", error);
    return { ok: false, error: updateFailed, cart };
  }
};

export const removeLine = async (lineId: unknown): Promise<CartResult> => {
  if (!isLineId(lineId)) return { ok: false, error: updateFailed, cart: null };

  let cart: Cart | null = null;
  try {
    cart = await loadCart();
    if (!cart) return { ok: false, error: updateFailed, cart };
    const { cartLinesRemove } = await storefrontFetch<{
      cartLinesRemove: CartMutationResult;
    }>(
      cartLinesRemoveMutation,
      { cartId: cart.id, lineIds: [lineId] },
      { cache: "no-store" },
    );
    return mutationResult(cartLinesRemove, cart, updateFailed);
  } catch (error) {
    console.error("Cart remove failed:", error);
    return { ok: false, error: updateFailed, cart };
  }
};
