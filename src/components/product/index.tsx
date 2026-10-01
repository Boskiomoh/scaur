import Link from "next/link";
import { Suspense, type FC } from "react";

import FinishTheKit from "@/components/product/finish-the-kit";
import ProductFromUrl from "@/components/product/product-from-url";
import ProductView from "@/components/product/product-view";
import { resolveSelection } from "@/components/product/selection";
import { buildKit, defaultKitInput, type KitSlot } from "@/lib/kit";
import { layers } from "@/lib/layers";
import { thermalSrc } from "@/lib/thermal";
import type { Product as ProductData } from "@/types/product";

interface ProductProps {
  product: ProductData;
  catalog: ProductData[];
}

const textOf = (html: string) =>
  html
    .split("</p>")
    .map((part) => part.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

const Product: FC<ProductProps> = ({ product, catalog }) => {
  // Derived
  const layer = layers.find((item) => item.id === product.layer)!;
  const lead = textOf(product.descriptionHtml)[0] ?? "";
  const colourImages = new Set(
    product.colours.map((colour) => colour.image?.url.split("?")[0]),
  );
  const details = product.images.filter(
    (image) => !colourImages.has(image.url.split("?")[0]),
  );
  const defaults = resolveSelection(product, { hasSize: false });
  const thermals = Object.fromEntries(
    product.colours.map((colour) => [
      colour.name,
      thermalSrc(product.handle, colour.name),
    ]),
  );
  const viewProps = { product, lead, details, thermals };
  const kit = buildKit(
    {
      ...defaultKitInput,
      on: { base: true, mid: true, insulation: true, shell: true },
    },
    catalog,
  );
  const pairs = kit.slots.filter(
    (slot): slot is Extract<KitSlot, { status: "filled" }> =>
      slot.status === "filled" && slot.layer !== product.layer,
  );

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-page gap-1.5 px-4 pt-3.5 text-caption text-ink-2 md:px-8 lg:gap-2 lg:px-12 lg:pt-5 lg:text-sm"
      >
        <Link href="/shop" className="text-ink-2">
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/shop?layer=${product.layer}`} className="text-ink-2">
          {layer.label}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-ink">
          {product.title}
        </span>
      </nav>

      <div className="mx-auto max-w-page pt-3 lg:px-12 lg:pt-5">
        {defaults.colour && (
          <Suspense
            fallback={
              <ProductView
                {...viewProps}
                colour={defaults.colour}
                size={defaults.size}
              />
            }
          >
            <ProductFromUrl {...viewProps} />
          </Suspense>
        )}
      </div>

      {pairs.length > 0 && (
        <FinishTheKit slots={pairs} size={defaultKitInput.size} />
      )}
    </>
  );
};

export default Product;
