import { getProductByIdAndGallery } from "@/shared/lib/apis/products.api";
import ProductOverviewContent from "../components/product-overview-content";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdAndGallery(id);
  return <ProductOverviewContent product={product} />;
}
