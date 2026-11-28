import { Suspense } from "react";

import ProductOverviewContent from "../components/product-overview-content";
import ReviewsSection from "../components/product-reviews/reviews-section";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";

interface ProductOverviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductOverViewPage({
  params,
}: ProductOverviewPageProps) {
  const { id } = await params;

  return (
    <ProductOverviewContent
      productId={id}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
