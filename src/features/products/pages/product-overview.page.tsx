import { authOptions } from "@/auth";
import ProductOverviewContent from "../components/product-overview-content";
import { getServerSession } from "next-auth";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";
import { Suspense } from "react";
import ReviewsSection from "../components/product-reviews/reviews-section";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Get the current user session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  const isAuthenticated = !!session?.accessToken;

  return (
    <ProductOverviewContent
      productId={id}
      isAuthenticated={isAuthenticated}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
