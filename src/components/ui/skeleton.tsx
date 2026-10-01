import type { FC } from "react";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

const Skeleton: FC<SkeletonProps> = ({ className }) => (
  <div aria-hidden="true" className={cn("bg-mist", className)} />
);

export default Skeleton;
