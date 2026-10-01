import { toProduct, toProducts } from "@/lib/catalog";
import { storefrontFetch } from "@/lib/shopify/client";
import { productQuery, productsQuery } from "@/lib/shopify/queries";
import type { ProductResponse, ProductsResponse } from "@/lib/shopify/types";

const revalidate = 300;

export const getProducts = async () => {
  const data = await storefrontFetch<ProductsResponse>(
    productsQuery,
    {},
    { tags: ["products"], revalidate },
  );
  return toProducts(data.products.nodes);
};

export const getProduct = async (handle: string) => {
  const data = await storefrontFetch<ProductResponse>(
    productQuery,
    { handle },
    { tags: ["products", `product:${handle}`], revalidate },
  );
  return data.product ? toProduct(data.product) : null;
};
