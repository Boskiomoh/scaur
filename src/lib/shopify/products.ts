import { toProduct, toProducts } from "@/lib/catalog";
import { layerPhotoHandles, layers, type Layer } from "@/lib/layers";
import { storefrontFetch } from "@/lib/shopify/client";
import {
  predictiveSearchQuery,
  productQuery,
  productsQuery,
} from "@/lib/shopify/queries";
import type {
  PredictiveSearchResponse,
  ProductResponse,
  ProductsResponse,
} from "@/lib/shopify/types";
import type { Image, Product } from "@/types/product";

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

export interface LayerSummary {
  image: Image | null;
  range: { lo: number; hi: number } | null;
}

export const layerSummaries = (products: Product[]) =>
  Object.fromEntries(
    layers.map(({ id }) => {
      const items = products.filter((product) => product.layer === id);
      const photo = items.find(
        (product) => product.handle === layerPhotoHandles[id],
      );
      return [
        id,
        {
          image: photo?.colours[0]?.image ?? null,
          range: items.length
            ? {
                lo: Math.min(...items.map((product) => product.range.lo)),
                hi: Math.max(...items.map((product) => product.range.hi)),
              }
            : null,
        },
      ];
    }),
  ) as Record<Layer, LayerSummary>;

// The layout uses these on every page, so a store outage shows the shell without photos.
export const getLayerSummaries = async () => {
  try {
    return layerSummaries(await getProducts());
  } catch {
    return layerSummaries([]);
  }
};

const temperature = /^(-?\d{1,2})\s*(°|deg|degrees)?\s*f?$/i;

export const searchProducts = async (query: string) => {
  const term = query.trim().slice(0, 80);
  if (!term) return [];
  const products = await getProducts();
  const degrees = term.match(temperature);
  if (degrees) {
    const temp = Number(degrees[1]);
    return products.filter(
      (product) => temp >= product.range.lo && temp <= product.range.hi,
    );
  }
  const data = await storefrontFetch<PredictiveSearchResponse>(
    predictiveSearchQuery,
    { query: term },
    { tags: ["products"], revalidate },
  );
  const handles =
    data.predictiveSearch?.products.map((product) => product.handle) ?? [];
  // Predictive search is typo-tolerant ("parka" finds jackets); keep only real matches.
  // Whole-word matches ("Down Jacket") rank above prefixes ("Downpour").
  const needle = term.toLowerCase();
  const words = (product: Product) =>
    `${product.title} ${product.layer}`.toLowerCase();
  return handles
    .flatMap((handle) => {
      const product = products.find((item) => item.handle === handle);
      return product && words(product).includes(needle) ? [product] : [];
    })
    .sort(
      (a, b) =>
        Number(!words(a).split(/\W+/).includes(needle)) -
        Number(!words(b).split(/\W+/).includes(needle)),
    );
};
