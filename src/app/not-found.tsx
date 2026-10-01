import NotFound from "@/components/not-found";
import { getProduct } from "@/lib/shopify/products";

export default async function Page() {
  const product = await getProduct("scarp-shell").catch(() => null);
  const image =
    product?.colours.find((colour) => colour.name === "Tide")?.image ?? null;
  return <NotFound image={image} />;
}
