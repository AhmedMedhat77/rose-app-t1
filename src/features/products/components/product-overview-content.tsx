"use client";

import { useTranslations } from "next-intl";

import { ProductCarousel } from "@/shared/components/product-carousel";
import { useProductById, useRelatedProducts } from "../hooks/use-product-id";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";
import SectionsTitle from "@/shared/components/SectionsTitle";
import { ProductOverviewSkeleton } from "../skeletons/product-overview.skeleton";

interface ProductOverviewContentProps {
  productId: string;
}

export default function ProductOverviewContent({
  productId,
}: ProductOverviewContentProps) {
  // Translation
  const t = useTranslations("Product");

  // Query
  const { data, isLoading, error } = useProductById(productId);
  const product = data?.status ? data.payload.product : undefined;
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.categoryId ?? "",
  );

  if (isLoading) return <ProductOverviewSkeleton />;

  // Delegate failures to the route error.tsx boundary
  if (error) throw error;
  if (!product) throw new Error(t("loadError"));

  return (
    <div className="container mx-auto flex flex-col justify-between px-4 py-8 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        <ProductGallery
          images={product.gallery.length ? product.gallery : [product.cover]}
        />

        <ProductDetails product={product} />
      </section>

      <section className="flex flex-col">
        <div className="mr-auto -mb-10 w-fit">
          <SectionsTitle mainTitle={"Related products"} />
        </div>
        <ProductCarousel title="" products={relatedProducts || []} />
      </section>
    </div>
  );
}
