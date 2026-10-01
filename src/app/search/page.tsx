import type { Metadata } from "next";

import SearchResults from "@/components/search/search-results";
import { searchProducts } from "@/lib/shopify/products";
import { parseShopParams } from "@/lib/url";

export async function generateMetadata({
  searchParams,
}: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  return { title: query ? `Search: ${query}` : "Search" };
}

export default async function Page({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const { view } = parseShopParams(params);
  return (
    <SearchResults
      query={query}
      view={view}
      products={await searchProducts(query)}
    />
  );
}
