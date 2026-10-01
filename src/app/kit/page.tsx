import type { Metadata } from "next";

import Kit from "@/components/kit";
import { getProducts } from "@/lib/shopify/products";
import { kitHref, parseKitParams } from "@/lib/url";

export const metadata: Metadata = {
  title: "Kit builder",
  description:
    "Tell us the day and get one piece per layer, rated on one temperature scale.",
};

export default async function Page({ searchParams }: PageProps<"/kit">) {
  const input = parseKitParams(await searchParams);
  const products = await getProducts();
  return <Kit key={kitHref(input)} initialInput={input} products={products} />;
}
