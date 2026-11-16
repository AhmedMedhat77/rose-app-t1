import ProductOverviewContent from "../components/product-overview-content";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductOverviewContent productId={id} />;
}
