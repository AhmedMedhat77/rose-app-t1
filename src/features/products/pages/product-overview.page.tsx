import { notFound } from "next/navigation";
import { getProductById } from "../lib/apis/products.api";
import ProductOverviewContent from "../components/product-overview-content";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductById(id);
  if (!result.status) notFound();
  return <ProductOverviewContent product={result.payload.product} />;
}
