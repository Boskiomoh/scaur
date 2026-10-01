import type { RawCart } from "@/lib/shopify/types";
import type { Cart, CartLine } from "@/types/cart";

// Attributes starting with "_" are hidden from the buyer at Shopify's checkout.
export const kitAttributes = {
  id: "_kitId",
  label: "_kit",
  url: "_kitUrl",
} as const;

export const toCart = (raw: RawCart): Cart => ({
  id: raw.id,
  checkoutUrl: raw.checkoutUrl,
  totalQuantity: raw.totalQuantity,
  subtotal: raw.cost.subtotalAmount,
  // Shopify lists the newest line first; the drawer shows them in the order they were added.
  lines: raw.lines.nodes.toReversed().map((line): CartLine => {
    const attribute = (key: string) =>
      line.attributes.find((item) => item.key === key)?.value ?? undefined;
    const kitId = attribute(kitAttributes.id);
    return {
      id: line.id,
      quantity: line.quantity,
      variantId: line.merchandise.id,
      handle: line.merchandise.product.handle,
      title: line.merchandise.product.title,
      options: line.merchandise.selectedOptions
        .map((option) => option.value)
        .join(", "),
      image: line.merchandise.image,
      price: line.merchandise.price,
      total: line.cost.totalAmount,
      quantityAvailable: line.merchandise.quantityAvailable,
      kit: kitId
        ? {
            id: kitId,
            label: attribute(kitAttributes.label) ?? "Kit",
            url: attribute(kitAttributes.url) ?? "/kit",
          }
        : undefined,
    };
  }),
});
