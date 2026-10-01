"use client";

import type { ImageLoaderProps } from "next/image";

// Shopify's CDN resizes on request, so product photos never use Vercel's optimiser.
// Local images (the 1200px thermal WebPs) are already sized and are served as they are.
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!src.startsWith("https://cdn.shopify.com/")) return `${src}?w=${width}`;
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
