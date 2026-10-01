import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Product from "@/components/product";
import { getProduct, getProducts } from "@/lib/shopify/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  const image = product.colours[0]?.image;
  return {
    title: product.title,
    description: product.descriptionHtml.replace(/<[^>]+>/g, " ").trim(),
    openGraph: image
      ? { images: [{ url: image.url, alt: image.altText ?? product.title }] }
      : {},
  };
}

export default async function Page({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const [product, catalog] = await Promise.all([
    getProduct(handle),
    getProducts(),
  ]);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.descriptionHtml.replace(/<[^>]+>/g, " ").trim(),
    brand: { "@type": "Brand", name: "Scaur" },
    image: product.images.map((image) => image.url),
    offers: product.colours.flatMap((colour) =>
      colour.variants.map((variant) => ({
        "@type": "Offer",
        name: `${colour.name}, ${variant.size}`,
        price: variant.price.amount,
        priceCurrency: variant.price.currencyCode,
        availability: variant.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Product product={product} catalog={catalog} />
    </>
  );
}
