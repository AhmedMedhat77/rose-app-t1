import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "@/auth";
import { getProductById } from "@/shared/lib/apis/products.api";
import ProductOverviewContent from "../components/product-overview-content";
import ReviewsSection from "../components/product-reviews/reviews-section";
import ReviewsListSkeleton from "../skeletons/reviews-list.skeleton";
import { notFound } from "next/navigation";
import type { IProductOverview } from "../types/product";

function parseGallery(value: unknown): string[] {
  const onlyStrings = (list: unknown[]) =>
    list.filter((item): item is string => typeof item === "string");

  if (Array.isArray(value)) return onlyStrings(value);
  if (typeof value !== "string" || !value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return onlyStrings(parsed);
  } catch {
    // not JSON: treat the string as a single image URL
  }
  return [value];
}

export default async function ProductOverViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Session
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.accessToken;

  // Params
  const { id } = await params;

  // Product
  let product = await getProductById<IProductOverview>(id);

  if (!product) notFound();
  product = { ...product, gallery: parseGallery(product.gallery) };

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
