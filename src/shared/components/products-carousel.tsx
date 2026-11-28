import { Suspense, use } from "react";
import { useTranslations } from "next-intl";
import type { IProduct } from "@/features/products/types/product";
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

const CAROUSEL_NAV_BUTTONS_CLASS =
  "bg-bg-maroon-secondary text-text-inverse hover:bg-bg-primary-saturated dark:bg-bg-maroon dark:text-white dark:hover:text-text-inverse absolute z-20 border-0";

export default function ProductsCarousel({
  title,
  productsList,
}: {
  title?: string;
  productsList: IProduct[] | Promise<IProduct[]>;
}) {
  return (
    <ProductsCarouselErrorBoundary>
      {title && (
        <div className="mb-4 flex justify-start">
          <SectionsTitle mainTitle={title} />
        </div>
      )}
      <Suspense fallback={<ProductsCarouselSkeleton />}>
        <ProductsCarouselSlides productsList={productsList} />
      </Suspense>
    </ProductsCarouselErrorBoundary>
  );
}

function ProductsCarouselSlides({
  productsList,
}: {
  productsList: IProduct[] | Promise<IProduct[]>;
}) {
  const t = useTranslations("ProductsCarousel");

  const products = Array.isArray(productsList)
    ? productsList
    : use(productsList);
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
          <CarouselItem key={product.id} className="basis-79.5">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className={CAROUSEL_NAV_BUTTONS_CLASS} />
      <CarouselNext className={CAROUSEL_NAV_BUTTONS_CLASS} />
    </Carousel>
  );
}
