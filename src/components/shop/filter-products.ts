import type { Layer } from "@/lib/layers";
import type { ShopState } from "@/lib/url";
import { shellRoles, type Product } from "@/types/product";

// The collection artboard's order: outer layers first, warmest first, shells by role.
const layerOrder: Layer[] = ["shell", "insulation", "mid", "base"];
const roleRank = (product: Product) =>
  product.shellRole ? shellRoles.indexOf(product.shellRole) : 0;

export const filterProducts = (
  products: Product[],
  { layer, temp }: ShopState,
) =>
  products
    .filter((product) => !layer || product.layer === layer)
    .filter(
      (product) =>
        temp === undefined ||
        (temp >= product.range.lo && temp <= product.range.hi),
    )
    .sort(
      (a, b) =>
        layerOrder.indexOf(a.layer) - layerOrder.indexOf(b.layer) ||
        b.warmth - a.warmth ||
        roleRank(a) - roleRank(b) ||
        Number(b.price.amount) - Number(a.price.amount),
    );
