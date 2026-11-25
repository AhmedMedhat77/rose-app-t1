import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import ProductOverviewContent from "../components/product-overview-content";
import ReviewsSection from "../components/product-reviews/reviews-section";
import { getProductById } from "../lib/apis/products.api";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [result, session] = await Promise.all([
    getProductById(id),
    getServerSession(authOptions),
  ]);
  if (!result.status) notFound();

  return (
    <ProductOverviewContent
      product={result.payload.product}
      isAuthenticated={!!session?.accessToken}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
