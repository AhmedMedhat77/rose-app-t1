import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "@/auth";
import { getProductByIdAndGallery } from "@/shared/lib/apis/products.api";
import ProductOverviewContent from "../components/product-overview-content";
import ReviewsSection from "../components/product-reviews/reviews-section";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Session
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.accessToken;

  // Product

  const product = await getProductByIdAndGallery(id);

  return (
    <ProductOverviewContent
      product={product}
      isAuthenticated={isAuthenticated}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
