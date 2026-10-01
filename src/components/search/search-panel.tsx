import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { FC } from "react";

import SearchOption from "@/components/search/search-option";
import Chip from "@/components/ui/chip";
import type { Product } from "@/types/product";

interface SearchPanelProps {
  term: string;
  results: Product[];
  active: number;
  onSearch: (query: string) => void;
  onClose: () => void;
}

const popular = ["shell", "merino", "down", "fleece", "20°F"];

const SearchPanel: FC<SearchPanelProps> = ({
  term,
  results,
  active,
  onSearch,
  onClose,
}) => (
  <div className="flex flex-col gap-3.5 lg:col-span-8 lg:gap-4">
    {results.length > 0 && (
      <>
        <div className="flex items-baseline justify-between px-4 lg:px-0">
          <span className="text-sm font-semibold">Products</span>
          <span
            role="status"
            className="font-data text-xs text-ink-2 lg:text-caption"
          >
            {results.length === 1 ? "1 product" : `${results.length} products`}
          </span>
        </div>
        <div
          id="search-results"
          role="listbox"
          aria-label="Products"
          className="border-b border-line"
        >
          {results.slice(0, 5).map((product, index) => (
            <SearchOption
              key={product.handle}
              id={`search-option-${index}`}
              product={product}
              isActive={index === active}
              onNavigate={onClose}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-6 px-4 lg:px-0">
          <Link
            href={`/search?q=${encodeURIComponent(term)}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 font-semibold"
          >
            See all {results.length} results for &ldquo;{term}&rdquo;
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 max-lg:hidden rtl:-scale-x-100"
            />
          </Link>
          <span className="text-caption text-ink-2 max-lg:hidden">
            Arrow keys to move, Enter to open, Esc to close
          </span>
        </div>
      </>
    )}

    {term && results.length === 0 && (
      <div className="mx-4 flex flex-col items-start gap-3 bg-frost p-6 lg:mx-0 lg:gap-4 lg:p-10">
        <h2 className="font-display text-2xl leading-tight lg:text-sheet-title">
          No layers match &ldquo;{term}&rdquo;
        </h2>
        <p role="status" className="text-base text-ink-2 lg:text-blurb">
          Try &ldquo;down&rdquo; or &ldquo;insulation&rdquo;, or search for a
          temperature like &ldquo;20°F&rdquo;.
        </p>
        <div className="flex gap-2">
          {["down", "insulation"].map((word) => (
            <Chip key={word} isPressed={false} onClick={() => onSearch(word)}>
              {word}
            </Chip>
          ))}
        </div>
      </div>
    )}

    {!term && (
      <div className="flex flex-col gap-3.5 px-4 lg:px-0">
        <span className="text-sm font-semibold">Popular searches</span>
        <div className="flex flex-wrap gap-2">
          {popular.map((word) => (
            <Chip key={word} isPressed={false} onClick={() => onSearch(word)}>
              {word}
            </Chip>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default SearchPanel;
