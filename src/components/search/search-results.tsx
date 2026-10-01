import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { FC } from "react";

import Button from "@/components/ui/button";
import ProductTile from "@/components/ui/product-tile";
import type { View } from "@/lib/url";
import type { Product } from "@/types/product";

interface SearchResultsProps {
  query: string;
  view: View;
  products: Product[];
}

const viewHref = (query: string, view: View) =>
  `/search?q=${encodeURIComponent(query)}${view === "thermal" ? "&view=thermal" : ""}`;

const SearchResults: FC<SearchResultsProps> = ({ query, view, products }) => {
  // Derived
  const countLine = !query
    ? "Type a layer, a fabric or a temperature."
    : products.length === 1
      ? `1 result for “${query}”`
      : `${products.length} results for “${query}”`;

  return (
    <div className="mx-auto max-w-page">
      <div className="flex flex-col gap-5 px-4 pt-7 pb-5 md:px-8 md:pt-10 lg:px-12 lg:pt-12 lg:pb-6">
        <h1 className="font-display text-collection-phone md:text-h2 lg:text-collection">
          Search
        </h1>
        <form
          action="/search"
          role="search"
          aria-label="Search the store"
          className="flex gap-3"
        >
          <label htmlFor="search-page-input" className="sr-only">
            Search
          </label>
          <div className="flex h-13 min-w-0 grow items-center gap-3 rounded-full border-control border-field bg-white px-5 md:max-w-140">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="size-5 shrink-0"
            />
            <input
              id="search-page-input"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={80}
              className="h-full min-w-0 grow bg-transparent text-blurb outline-none"
            />
          </div>
          <Button type="submit" variant="secondary" size="lg">
            Search
          </Button>
        </form>
      </div>

      <div className="mx-4 flex items-center gap-4 border-y border-line py-4 md:mx-8 lg:mx-12">
        <span role="status" className="text-base">
          {countLine}
        </span>
        {products.length > 0 && (
          <div
            role="group"
            aria-label="Image view"
            className="ms-auto inline-flex rounded-full bg-mist p-0.75"
          >
            {(["photo", "thermal"] as const).map((option) => (
              <Link
                key={option}
                href={viewHref(query, option)}
                aria-current={view === option ? "true" : undefined}
                scroll={false}
                className="flex h-9.5 items-center rounded-full px-3.5 text-sm font-semibold text-ink no-underline aria-[current=true]:bg-ink aria-[current=true]:text-snow lg:h-8.5"
              >
                {option === "photo" ? "Photo" : "Thermal"}
              </Link>
            ))}
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 px-4 pt-6 pb-14 md:grid-cols-3 md:gap-x-5 md:gap-y-10 md:px-8 md:pt-8 md:pb-20 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:px-12 lg:pb-24">
          {products.map((product) => (
            <li key={product.handle} className="min-w-0">
              <ProductTile product={product} view={view} />
            </li>
          ))}
        </ul>
      ) : (
        query && (
          <div className="mx-4 my-6 flex flex-col items-start gap-4 bg-snow px-5 py-7 md:m-8 md:p-12 lg:m-12 lg:p-16">
            <h2 className="font-display text-2xl leading-tight md:text-h2-phone">
              No layers match “{query}”
            </h2>
            <p className="text-base text-ink-2 md:text-blurb">
              Try “down” or “insulation”, or search for a temperature like
              “20°F”.
            </p>
            <div className="flex gap-2">
              {["down", "insulation"].map((word) => (
                <Button
                  key={word}
                  href={`/search?q=${word}`}
                  variant="secondary"
                  size="sm"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;
