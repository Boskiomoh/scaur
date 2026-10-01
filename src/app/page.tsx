import Home from "@/components/home";
import { getProducts } from "@/lib/shopify/products";

export default async function Page() {
  return <Home products={await getProducts()} />;
}
