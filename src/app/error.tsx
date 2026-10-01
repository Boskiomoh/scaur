"use client";

import StoreDown from "@/components/ui/store-down";

// Pages are prerendered, so this only shows when Shopify fails on a page that wasn't built yet.
export default function Error({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-notice px-4 py-16 md:px-8 lg:py-24">
      <StoreDown onRetry={retry} />
    </div>
  );
}
