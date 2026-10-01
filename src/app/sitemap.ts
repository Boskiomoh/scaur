import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/shopify/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getProducts().catch(() => []);
  return [
    ...["", "/shop", "/kit", "/search", "/about", "/credits"].map((path) => ({
      url: `${base}${path}`,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.handle}`,
    })),
  ];
}
