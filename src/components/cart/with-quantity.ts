import type { Cart } from "@/types/cart";

const times = (amount: string, quantity: number) =>
  (Number(amount) * quantity).toFixed(2);

// The optimistic cart shown while Shopify confirms a quantity change.
export const withQuantity = (
  cart: Cart,
  lineId: string,
  quantity: number,
): Cart => {
  const lines = cart.lines
    .map((line) =>
      line.id === lineId
        ? {
            ...line,
            quantity,
            total: {
              ...line.total,
              amount: times(line.price.amount, quantity),
            },
          }
        : line,
    )
    .filter((line) => line.quantity > 0);
  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: {
      ...cart.subtotal,
      amount: lines
        .reduce((sum, line) => sum + Number(line.total.amount), 0)
        .toFixed(2),
    },
  };
};
