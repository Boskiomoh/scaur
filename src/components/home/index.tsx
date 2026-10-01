import type { FC } from "react";

import FabricBand from "@/components/home/fabric-band";
import Hero from "@/components/home/hero";
import KitTeaser from "@/components/home/kit-teaser";
import LayerAxis from "@/components/home/layer-axis";
import FeaturedProduct from "@/components/product/featured-product";
import { thermalSrc } from "@/lib/thermal";
import type { Layer } from "@/lib/layers";
import type { Product } from "@/types/product";

interface HomeProps {
  products: Product[];
}

const featuredHandle = "scarp-shell";
// The product photographed for each layer row, as the home artboard shows them.
const axisHandles: Record<Layer, string> = {
  base: "tarn-merino-crew",
  mid: "knoll-grid-fleece",
  insulation: "cornice-down-jacket",
  shell: "scarp-shell",
};

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
    Object.entries(axisHandles).map(([layer, handle]) => [
      layer,
      byHandle(handle)?.colours[0]?.image ?? null,
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
