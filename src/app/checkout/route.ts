import { redirect } from "next/navigation";

import { getCart } from "@/components/cart/actions";

// After the dev-store password, Shopify's theme sends visitors to /?checkout=resume
// (redirected here in next.config.ts), so they carry on to checkout, not the cart.
const isShopifyCheckout = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === process.env.SHOPIFY_STORE_DOMAIN
    );
  } catch {
    return false;
  }
};

export async function GET() {
  const { cart } = await getCart();
  if (cart?.lines.length && isShopifyCheckout(cart.checkoutUrl)) {
    redirect(cart.checkoutUrl);
  }
  redirect("/");
}
