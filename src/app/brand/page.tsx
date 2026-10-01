import type { Metadata } from "next";

import Brand from "@/components/brand";

export const metadata: Metadata = { title: "Brand and controls" };

export default function Page() {
  return <Brand />;
}
