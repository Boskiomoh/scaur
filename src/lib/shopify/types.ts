import type { Image, Money } from "@/types/product";

export interface RawVariant {
  id: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  image: Image | null;
}

export interface RawProduct {
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: Money };
  images: { nodes: Image[] };
  variants: { nodes: RawVariant[] };
}

export interface ProductsResponse {
  products: { nodes: RawProduct[] };
}

export interface ProductResponse {
  product: RawProduct | null;
}
