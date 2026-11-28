import { Suspense } from "react";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

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

  const session = await getServerSession(authOptions);

  return (
    <ProductOverviewContent
      productId={id}
      isAuthenticated={!!session?.accessToken}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
