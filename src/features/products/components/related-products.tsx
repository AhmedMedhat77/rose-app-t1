"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import SectionsTitle from "@/shared/components/SectionsTitle";
import ProductsCarousel from "@/shared/components/products-carousel";
import { ProductsCarouselSkeleton } from "@/shared/skeletons/products-carousel.skeleton";

import { getAllProducts } from "../lib/apis/api-allProducts";

const RELATED_PRODUCTS_LIMIT = 9;

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

export function RelatedProducts({
  productId,
  categoryId,
}: RelatedProductsProps) {
  // Translation
  const t = useTranslations();

  // Query
  const { data, isPending } = useQuery({
    queryKey: ["products", "related", categoryId],
    queryFn: ({ signal }) =>
      getAllProducts(
        { category: categoryId, limit: RELATED_PRODUCTS_LIMIT },
        signal,
      ),
  });

  return (
    <section className="mt-42 mb-72 flex flex-col">
      <div className="mb-4 flex justify-start">
        <SectionsTitle mainTitle={t("Product.relatedProducts")} />
      </div>
      {isPending && <ProductsCarouselSkeleton />}
      {!isPending && !data && <p>{t("ProductsCarousel.error")}</p>}
      {data && (
        <ProductsCarousel
          productsList={data.payload.data.filter(
            (product) => product.id !== productId,
          )}
        />
      )}
    </section>
  );
}
