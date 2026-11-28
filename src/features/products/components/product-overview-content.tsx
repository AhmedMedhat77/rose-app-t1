"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { useProductOverview } from "../hooks/use-product-overview";
import { ProductOverviewSkeleton } from "../skeletons/product-overview.skeleton";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";
import { ProductOverviewError } from "./product-overview-error";
import ProductReview from "./product-reviews/product-review";
import { RelatedProducts } from "./related-products";

function isImageSource(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.startsWith("/")) return !value.startsWith("//");

  return /^https?:\/\//i.test(value) && URL.canParse(value);
}

function getGalleryImages(gallery: unknown, cover: string): string[] {
  let images = gallery;

  if (typeof gallery === "string") {
    try {
      images = JSON.parse(gallery);
    } catch {
      images = gallery;
    }
  }

  const sources = (Array.isArray(images) ? images : [images]).filter(
    isImageSource,
  );

  return sources.length ? sources : [cover].filter(isImageSource);
}

interface ProductOverviewContentProps {
  productId: string;
  reviewsSlot: ReactNode;
}

export default function ProductOverviewContent({
  productId,
  reviewsSlot,
}: ProductOverviewContentProps) {
  // Translation
  const t = useTranslations("Product");

  // Query
  const {
    data: product,
    error,
    isPending,
    refetch,
    isRefetching,
  } = useProductOverview(productId);

  if (isPending) return <ProductOverviewSkeleton />;

  if (product === undefined) {
    return (
      <ProductOverviewError
        error={error}
        retry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (product === null) {
    return (
      <p className="text-text-muted container mx-auto px-4 py-16 text-center">
        {t("notFound")}
      </p>
    );
  }

  // Variables
  const images = getGalleryImages(product.gallery, product.cover);

  return (
    <div className="container mx-auto flex flex-col justify-between px-4 py-8 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        <ProductGallery title={product.title} images={images} />

        <ProductDetails product={product} />
      </section>

      <ProductReview productId={product.id} reviewsSlot={reviewsSlot} />

      <RelatedProducts productId={product.id} categoryId={product.categoryId} />
    </div>
  );
}
