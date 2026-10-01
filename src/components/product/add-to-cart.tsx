"use client";

import type { FC } from "react";

import Button from "@/components/ui/button";
import type { Variant } from "@/types/product";

interface AddToCartProps {
  variant?: Variant;
}

const AddToCart: FC<AddToCartProps> = ({ variant }) => {
  // Derived
  const canAdd = !!variant?.availableForSale;

  return (
    <Button size="lg" aria-describedby="demo-note" aria-disabled={!canAdd}>
      {canAdd ? "Add to cart" : "Choose a size"}
    </Button>
  );
};

export default AddToCart;
