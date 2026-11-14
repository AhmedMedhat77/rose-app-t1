import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { IProduct } from "@/features/products/types/product";
import ProductCard from "@/shared/components/product-card-copy";
import { ProductsCarouselSkeleton } from "@/shared/skeletons/products-carousel.skeleton";
import { ProductsCarouselErrorBoundary } from "@/shared/components/products-carousel-error-boundary";

export default function ProductsCarousel({
  productsList,
}: {
  productsList: Promise<IProduct[]>;
}) {
  return (
    <ProductsCarouselErrorBoundary>
      <Suspense fallback={<ProductsCarouselSkeleton />}>
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

  // const locale = await getLocale();
  // const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Carousel
      // dir={dir}
      opts={{
        align: "start",
        loop: true,
        // direction: dir,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-80">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="bg-bg-maroon-secondary text-text-inverse hover:bg-bg-maroon hover:text-text-inverse dark:bg-bg-maroon dark:hover:dark:bg-bg-maroon absolute z-20 border-0 dark:text-white dark:hover:text-white" />
      <CarouselNext className="bg-bg-maroon-secondary text-text-inverse hover:bg-bg-maroon hover:text-text-inverse dark:bg-bg-maroon dark:hover:dark:bg-bg-maroon absolute z-20 border-0 dark:text-white dark:hover:text-white" />
    </Carousel>
  );
}
