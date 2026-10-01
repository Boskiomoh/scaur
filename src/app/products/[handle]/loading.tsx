import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading product"
      className="mx-auto grid max-w-page gap-7 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-12"
    >
      <div className="flex flex-col gap-3 px-4 md:px-8 lg:col-span-7 lg:gap-4 lg:px-0">
        <Skeleton className="h-110 md:h-140 lg:h-190" />
        <div className="flex gap-2 lg:gap-2.5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-15 w-12 lg:h-22 lg:w-18" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-snow p-7 max-lg:mx-4 md:max-lg:mx-8 lg:col-span-4 lg:col-start-9 lg:self-start">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3" />
          <Skeleton className="h-3" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-1.5" />
        <div className="flex gap-2.5">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="size-9 rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-12 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-13 rounded-full" />
      </div>
    </div>
  );
}
