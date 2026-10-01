import type { FC } from "react";

import FabricBand from "@/components/home/fabric-band";
import Hero from "@/components/home/hero";
import KitTeaser from "@/components/home/kit-teaser";
import LayerAxis from "@/components/home/layer-axis";
import FeaturedProduct from "@/components/product/featured-product";
import { layerSummaries } from "@/lib/shopify/products";
import { thermalSrc } from "@/lib/thermal";
import type { Product } from "@/types/product";

interface HomeProps {
  products: Product[];
}

const featuredHandle = "scarp-shell";

const Home: FC<HomeProps> = ({ products }) => {
  // Derived
  const byHandle = (handle: string) =>
    products.find((product) => product.handle === handle);
  const featured = byHandle(featuredHandle);
  const colour = featured?.colours[0];
  const thermal =
    featured && colour ? thermalSrc(featured.handle, colour.name) : null;
  const colourImages = new Set(
    featured?.colours.map((item) => item.image?.url.split("?")[0]),
  );
  const fabric =
    featured?.images.find(
      (image) => !colourImages.has(image.url.split("?")[0]),
    ) ?? null;
  const lead =
    featured?.descriptionHtml
      .split("</p>")[0]
      .replace(/<[^>]+>/g, "")
      .trim() ?? "";
  const images = Object.fromEntries(
    Object.entries(layerSummaries(products)).map(([layer, summary]) => [
      layer,
      summary.image,
    ]),
  );

  return (
    <>
      {featured && colour?.image && thermal && (
        <Hero
          photo={colour.image}
          thermal={thermal}
          title={featured.title}
          colour={colour.name}
          price={featured.price}
          href={`/products/${featured.handle}`}
        />
      )}
      <LayerAxis products={products} images={images} />
      {featured && <FeaturedProduct product={featured} lead={lead} />}
      <KitTeaser products={products} />
      <FabricBand image={fabric} />
    </>
  );
};

export default Home;
