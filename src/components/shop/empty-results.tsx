import type { FC } from "react";

import Button from "@/components/ui/button";
import { formatTemp } from "@/lib/format";

interface EmptyResultsProps {
  temp?: number;
}

const EmptyResults: FC<EmptyResultsProps> = ({ temp }) => {
  // Derived
  const label = temp === undefined ? "Any" : formatTemp(temp);
  const help =
    temp !== undefined && temp > 60
      ? `At ${label} a base layer or a light shell is usually enough. Try a lower temperature or clear the filter.`
      : "Try another layer or clear the temperature filter.";

  return (
    <div className="mx-4 my-6 flex flex-col items-start gap-3.5 bg-snow px-5 py-7 md:m-8 md:p-12 lg:m-12 lg:gap-4 lg:p-16">
      <h2 className="font-display text-2xl leading-tight md:text-h2-phone">
        Nothing here is made for {label}
      </h2>
      <p className="max-w-copy text-base leading-normal text-ink-2 md:text-blurb">
        {help}
      </p>
      <Button href="/shop" variant="secondary" size="sm" scroll={false}>
        Clear filters
      </Button>
    </div>
  );
};

export default EmptyResults;
