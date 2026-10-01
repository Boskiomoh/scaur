import Skeleton from "@/components/ui/skeleton";

const titleWidths = ["w-3/5", "w-4/5", "w-1/2", "w-2/3"];

export default function Loading() {
  return (
    <div className="mx-auto max-w-page">
      <div className="flex flex-col gap-3 px-4 pt-7 pb-5 md:px-8 md:pt-10 md:pb-6 lg:px-12 lg:pt-12">
        <Skeleton className="h-10 w-56 md:h-12 md:w-80" />
        <Skeleton className="h-4 w-full max-w-copy" />
      </div>
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading products"
        className="grid grid-cols-2 gap-x-3 gap-y-8 border-t border-line px-4 pt-6 pb-14 md:mx-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 md:px-0 md:pt-8 lg:mx-12 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-4/5" />
            <div className="flex justify-between gap-3">
              <Skeleton
                className={`h-4 ${titleWidths[index % titleWidths.length]}`}
              />
              <Skeleton className="h-4 w-11" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-1.5" />
            <Skeleton className="h-2.5 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
