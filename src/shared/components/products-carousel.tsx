import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { IProduct } from "@/features/products/types/product";
import SectionsTitle from "@/shared/components/SectionsTitle";
import ProductCard from "@/shared/components/product-card-copy";
import { ProductsCarouselErrorBoundary } from "@/shared/components/products-carousel-error-boundary";
import { ProductsCarouselSkeleton } from "@/shared/skeletons/products-carousel.skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import Link from "next/link";

export default function ProductsCarousel({
  title,
  productsList,
}: {
  title: string;
  productsList: Promise<IProduct[]>;
}) {
  return (
    <ProductsCarouselErrorBoundary>
      <Suspense fallback={<ProductsCarouselSkeleton />}>
        <div className="flex justify-start">
          <SectionsTitle mainTitle={title} />
        </div>
        <ProductsCarouselSlides productsList={productsList} />
      </Suspense>
    </ProductsCarouselErrorBoundary>
  );
}

async function ProductsCarouselSlides({
  productsList,
}: {
  productsList: Promise<IProduct[]>;
}) {
  const products = await productsList;

  const t = await getTranslations("ProductsCarousel");
  if (products.length === 0) {
    return <p>{t("empty")}</p>;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-80">
            <Link href={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="bg-bg-maroon-secondary text-text-inverse hover:bg-bg-maroon hover:text-text-inverse dark:bg-bg-maroon dark:hover:dark:bg-bg-maroon absolute z-20 border-0 dark:text-white dark:hover:text-white" />
      <CarouselNext className="bg-bg-maroon-secondary text-text-inverse hover:bg-bg-maroon hover:text-text-inverse dark:bg-bg-maroon dark:hover:dark:bg-bg-maroon absolute z-20 border-0 dark:text-white dark:hover:text-white" />
    </Carousel>
  );
}
