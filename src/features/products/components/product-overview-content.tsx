"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ProductCarousel } from "@/shared/components/product-carousel";
import { Button } from "@/shared/ui/button";
import { useProductById, useRelatedProducts } from "../hooks/use-product-id";
import ProductGallery from "./product-gallery/product-gallery";

interface ProductOverviewContentProps {
  productId: string;
}

const quantity = 10;

export default function ProductOverviewContent({
  productId,
}: ProductOverviewContentProps) {
  // Translation
  const t = useTranslations("Product");
  const locale = useLocale();

  // Query
  const { data, isLoading, isError } = useProductById(productId);
  const product = data?.status ? data.payload.product : undefined;
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.categoryId ?? "",
  );

  if (isLoading) {
    return (
      <div className="bg-bg-soft mx-auto mt-12 h-128 max-w-7xl animate-pulse rounded-2xl" />
    );
  }

  if (isError || !product) {
    return (
      <p className="text-text-muted mx-auto mt-16 max-w-7xl px-6">
        {t("loadError")}
      </p>
    );
  }

  const basePrice = Number(product.price);
  const discount = Number(product.discountValue ?? 0);
  const hasDiscount = product.discountType === "PERCENT" && discount > 0;
  const currentPrice = hasDiscount
    ? basePrice * (1 - discount / 100)
    : basePrice;
  const oldPrice = hasDiscount ? basePrice : null;

  const inCart = quantity > 0;
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  function handleAddToCart() {}

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.gallery.length ? product.gallery : [product.cover]}
        />

        <div className="flex min-h-0 flex-col">
          <div className="border-border-soft border-b pb-5">
            <h1 className="text-text-primary text-3xl font-semibold">
              {product.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              {oldPrice !== null && (
                <span className="text-text-muted text-lg line-through">
                  {formatPrice(oldPrice)} {t("currency")}
                </span>
              )}
              <span className="text-text-primary text-2xl font-bold">
                {formatPrice(currentPrice)} {t("currency")}
              </span>
              <span className="bg-bg-soft text-text-primary rounded-full px-3 py-2 text-sm">
                {product.stock > 0
                  ? t("stockLeft", { count: product.stock })
                  : t("outOfStock")}
              </span>
            </div>
          </div>

          <div className="border-border-soft text-text-primary flex items-center gap-2 border-b py-4">
            <Star className="size-5 fill-amber-500 text-amber-500" />
            <span>
              {t("rating", { rating: product.rating, count: product.ratings })}
            </span>
          </div>

          <div className="min-h-0 flex-1 py-5">
            <div className="text-text-muted max-h-48 overflow-y-auto pe-3 text-start leading-relaxed lg:max-h-56">
              {product.description}
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-3">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= quantity || quantity >= 6}
              className={`h-14 flex-1 text-base ${inCart ? "bg-text-primary text-text-inverse hover:bg-text-primary" : "bg-bg-primary text-text-inverse"}`}
            >
              <ShoppingCart />
              {t("addToCart")}
              {inCart && (
                <span className="rounded-full bg-white/20 px-2 py-0.5">
                  {quantity}
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label={t("addToWishlist")}
            >
              <Heart />
            </Button>
          </div>
        </div>
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
