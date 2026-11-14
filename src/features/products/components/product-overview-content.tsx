"use client";

import { useTranslations } from "next-intl";

import { ProductCarousel } from "@/shared/components/product-carousel";
import { useProductById, useRelatedProducts } from "../hooks/use-product-id";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";
import SectionsTitle from "@/shared/components/SectionsTitle";

interface ProductOverviewContentProps {
  productId: string;
}

export default function ProductOverviewContent({
  productId,
}: ProductOverviewContentProps) {
  // Translation
  const t = useTranslations("Product");

  // Query
  const { data, isLoading, isError } = useProductById(productId);
  const product = data?.status ? data.payload.product : undefined;
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.categoryId ?? "",
  );

  if (isLoading) {
    return (
      <div className="bg-bg-soft container mx-auto mt-12 h-128 animate-pulse rounded-2xl" />
    );
  }

  if (isError || !product) {
    return (
      <p className="text-text-muted mx-auto mt-16 max-w-7xl px-6">
        {t("loadError")}
      </p>
    );
  }

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
