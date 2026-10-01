"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from "react";

import { search } from "@/components/search/actions";
import SearchPanel from "@/components/search/search-panel";
import Logo from "@/components/ui/logo";
import { layers, type Layer } from "@/lib/layers";
import type { LayerSummary } from "@/lib/shopify/products";
import { useSearchStore } from "@/store/search-store";
import type { Product } from "@/types/product";

interface SearchOverlayProps {
  summaries: Record<Layer, LayerSummary>;
}

const debounce = 200;

const SearchOverlay: FC<SearchOverlayProps> = ({ summaries }) => {
  // Router
  const router = useRouter();

  // Stores
  const isOpen = useSearchStore((state) => state.isOpen);
  const close = useSearchStore((state) => state.close);

  // State
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [hasFailed, setHasFailed] = useState(false);
  const [active, setActive] = useState(-1);

  // Derived
  const term = query.trim();
  const shown = results.slice(0, 5);
  const allHref = `/search?q=${encodeURIComponent(term)}`;

  // Effects
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog?.open) {
      dialog?.showModal();
      inputRef.current?.focus();
    }
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  // Handlers
  const runSearch = (next: string) => {
    setQuery(next);
    setActive(-1);
    latest.current = next;
    clearTimeout(timer.current);
    setHasFailed(false);
    if (!next.trim()) return setResults([]);
    timer.current = setTimeout(async () => {
      const result = await search(next);
      if (latest.current !== next) return;
      setResults(result.ok ? result.products : []);
      setHasFailed(!result.ok);
    }, debounce);
  };

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) =>
        Math.min(shown.length - 1, Math.max(-1, index + step)),
      );
    }
    if (event.key === "Enter" && term) {
      event.preventDefault();
      go(active >= 0 ? `/products/${shown[active].handle}` : allHref);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the store"
      onClose={close}
      onClick={(event) => event.target === event.currentTarget && close()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-snow text-ink backdrop:bg-ink/50 open:flex open:flex-col lg:bottom-auto lg:h-auto"
    >
      <div className="flex h-18 shrink-0 items-center gap-2 border-b border-line ps-4 pe-2 lg:h-22 lg:gap-10 lg:px-12">
        <div className="max-lg:hidden">
          <Logo onClick={close} />
        </div>
        <div className="flex h-12 grow items-center gap-2.5 rounded-full border-control border-ink bg-white px-4 lg:h-14 lg:gap-3.5 lg:px-5">
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="size-5 lg:size-5.5"
          />
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            role="combobox"
            autoComplete="off"
            aria-expanded={shown.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={
              active >= 0 ? `search-option-${active}` : undefined
            }
            placeholder="Search layers, fabrics or a temperature"
            value={query}
            maxLength={80}
            onChange={(event) => runSearch(event.target.value)}
            onKeyDown={handleKeyDown}
            className="h-full min-w-0 grow bg-transparent text-base outline-none lg:text-blurb"
          />
          {term && (
            <button
              type="button"
              onClick={() => runSearch("")}
              className="text-sm text-ink-2 underline underline-offset-3"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={close}
          className="h-11 px-2 text-nav font-semibold lg:hidden"
        >
          Cancel
        </button>
        <button
          type="button"
          aria-label="Close search"
          onClick={close}
          className="flex size-11 items-center justify-center rounded-full max-lg:hidden"
        >
          <XIcon aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="grow overflow-y-auto py-5 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-8 lg:pb-10">
        <SearchPanel
          term={term}
          results={results}
          hasFailed={hasFailed}
          active={active}
          onSearch={runSearch}
          onClose={close}
        />

        <nav
          aria-label="Shop by layer"
          className="flex flex-col gap-3.5 max-lg:hidden lg:col-span-3 lg:col-start-10"
        >
          <span className="text-sm font-semibold">Shop by layer</span>
          {layers.map((layer) => (
            <Link
              key={layer.id}
              href={`/shop?layer=${layer.id}`}
              onClick={close}
              className="flex items-center gap-3.5 no-underline"
            >
              <div className="relative size-12 bg-mist">
                {summaries[layer.id].image && (
                  <Image
                    src={summaries[layer.id].image!.url}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <span className="font-display text-blurb">{layer.label}</span>
            </Link>
          ))}
          <Link
            href="/kit"
            onClick={close}
            className="mt-1.5 text-nav font-semibold"
          >
            Or let the kit builder choose
          </Link>
        </nav>
      </div>
    </dialog>
  );
};

export default SearchOverlay;
