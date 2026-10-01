"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps, FC } from "react";

import ProductView from "@/components/product/product-view";
import { resolveSelection } from "@/components/product/selection";
import { sizes, type Size } from "@/types/product";

type ProductFromUrlProps = Omit<
  ComponentProps<typeof ProductView>,
  "colour" | "size"
>;

const ProductFromUrl: FC<ProductFromUrlProps> = (props) => {
  // Router
  const searchParams = useSearchParams();

  // Derived
  const sizeParam = searchParams.get("size");
  const { colour, size } = resolveSelection(props.product, {
    colour: searchParams.get("colour") ?? undefined,
    size: sizes.find((item) => item === sizeParam) as Size | undefined,
    hasSize: searchParams.has("size") || searchParams.has("colour"),
  });

  if (!colour) return null;
  return <ProductView {...props} colour={colour} size={size} />;
};

export default ProductFromUrl;
