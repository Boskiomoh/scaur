import type { FC } from "react";

import EmptyResults from "@/components/shop/empty-results";
import FilterBar from "@/components/shop/filter-bar";
import { shopCopy } from "@/components/shop/shop-copy";
import ProductTile from "@/components/ui/product-tile";
import type { ShopState } from "@/lib/url";
import type { Product } from "@/types/product";

interface ShopProps {
  state: ShopState;
  products: Product[];
}

const Shop: FC<ShopProps> = ({ state, products }) => {
  // Derived
  const copy = shopCopy[state.layer ?? "all"];

  return (
    <div className="mx-auto max-w-page">
      <div className="flex flex-col gap-2.5 px-4 pt-7 pb-5 md:gap-3 md:px-8 md:pt-10 md:pb-6 lg:px-12 lg:pt-12">
        <h1 className="font-display text-collection-phone md:text-h2 lg:text-collection">
          {copy.title}
        </h1>
        <p className="max-w-copy text-base leading-normal text-ink-2 md:text-blurb lg:leading-ui">
          {copy.blurb}
        </p>
      </div>

      <FilterBar state={state} count={products.length}>
        {products.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 px-4 pt-6 pb-14 md:grid-cols-3 md:gap-x-6 md:gap-y-12 md:px-8 md:pt-8 md:pb-24 lg:grid-cols-4 lg:px-12">
            {products.map((product, index) => (
              <li key={product.handle} className="min-w-0">
                <ProductTile
                  product={product}
                  view={state.view}
                  isPriority={index < 4}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyResults temp={state.temp} />
        )}
      </FilterBar>
    </div>
  );
};

export default Shop;
