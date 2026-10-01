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
  fabricFit: { value: string } | null;
  features: { value: string } | null;
  care: { value: string } | null;
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

export interface RawCartLine {
  id: string;
  quantity: number;
  attributes: { key: string; value: string | null }[];
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    availableForSale: boolean;
    quantityAvailable: number | null;
    selectedOptions: { name: string; value: string }[];
    image: Image | null;
    price: Money;
    product: { handle: string; title: string };
  };
}

export interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: { nodes: RawCartLine[] };
}

export interface CartMutationResult {
  cart: RawCart | null;
  userErrors: { message: string }[];
  warnings: { code: string; message: string }[];
}

export interface VariantStockResponse {
  nodes: ({
    id: string;
    availableForSale: boolean;
    quantityAvailable: number | null;
  } | null)[];
}
