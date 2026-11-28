import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getProductById } from "@/shared/lib/apis/products.api";

import ProductOverviewContent from "../components/product-overview-content";
import ReviewsSection from "../components/product-reviews/reviews-section";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";
import type { IProductOverview } from "../types/product";

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, session] = await Promise.all([
    getProductById<IProductOverview>(id),
    getServerSession(authOptions),
  ]);
  if (!product) notFound();

  return (
    <ProductOverviewContent
      product={product}
      isAuthenticated={!!session?.accessToken}
      reviewsSlot={
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      }
    />
  );
}
