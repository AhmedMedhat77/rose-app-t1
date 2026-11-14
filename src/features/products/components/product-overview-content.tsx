"use client";

import { useTranslations } from "next-intl";

import { ProductCarousel } from "@/shared/components/product-carousel";
import { useProductById, useRelatedProducts } from "../hooks/use-product-id";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";

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
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        <ProductGallery
          images={product.gallery.length ? product.gallery : [product.cover]}
        />

        <ProductDetails product={product} />
      </section>

      <ProductCarousel
        title={t("relatedProducts")}
        products={relatedProducts
          .filter((item) => String(item.id) !== productId)
          .map((item) => ({
            id: item.id,
            title: item.title,
            cover: item.cover,
            stock: item.stock,
            rating: item.rating,
            price: item.price,
            discountValue: item.discountValue,
          }))}
      />
    </div>
  );
}
