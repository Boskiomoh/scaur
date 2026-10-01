import type { MetadataRoute } from "next";

// Scaur is fictional and must not appear in search results as a real shop.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
