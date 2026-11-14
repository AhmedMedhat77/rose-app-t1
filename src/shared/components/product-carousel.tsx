"use client";

import { useLocale, useTranslations } from "next-intl";

import ProductCard, {
  type ProductCardProduct,
} from "@/shared/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";

interface ProductCarouselProps {
  title: string;
  products: ProductCardProduct[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const t = useTranslations("Product");
  const locale = useLocale();

  if (!products.length) return null;

  return (
    <section className="mt-16" aria-label={title}>
      <h2 className="text-text-primary mb-6 text-2xl font-semibold">{title}</h2>
      <Carousel
        opts={{ align: "start", direction: locale === "ar" ? "rtl" : "ltr" }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="inset-s-0"
          aria-label={t("previousProducts")}
        />
        <CarouselNext className="inset-e-0" aria-label={t("nextProducts")} />
      </Carousel>
    </section>
  );
}
