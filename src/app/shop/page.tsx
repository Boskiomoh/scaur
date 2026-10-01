import type { Metadata } from "next";

import Shop from "@/components/shop";
import { filterProducts } from "@/components/shop/filter-products";
import { shopCopy } from "@/components/shop/shop-copy";
import { getProducts } from "@/lib/shopify/products";
import { parseShopParams } from "@/lib/url";

export async function generateMetadata({
  searchParams,
}: PageProps<"/shop">): Promise<Metadata> {
  const { layer } = parseShopParams(await searchParams);
  return { title: shopCopy[layer ?? "all"].title };
}

export default async function Page({ searchParams }: PageProps<"/shop">) {
  const state = parseShopParams(await searchParams);
  const products = filterProducts(await getProducts(), state);
  return <Shop state={state} products={products} />;
}
