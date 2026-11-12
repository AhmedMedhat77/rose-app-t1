"use client";

import { Badge } from "@/shared/ui/badge";
import { cn } from "cn";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
const quantity = 10;
export interface ProductCardProduct {
  id: string | number;
  title: string;
  cover?: string | null;
  stock: number;
  rating?: number | null;
  price: number | string;
  discountValue?: number | string | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  variant?: "bestSelling" | "mostPopular";
}

export default function ProductCard({
  product,
  variant = "bestSelling",
}: ProductCardProps) {
  const t = useTranslations();
  const isPopular = variant === "mostPopular";

  const starsCount = isPopular ? 5 : 4;

  const hasDiscount = Number(product.discountValue ?? 0) > 0;
  const discountedPrice = hasDiscount
    ? Number(product.price) * (1 - Number(product.discountValue) / 100)
    : Number(product.price);

  return (
    <div
      className={cn(
        "w-full space-y-2",
        isPopular &&
          "group flex h-91 w-full max-w-75.5 flex-col gap-4 overflow-hidden rounded-t-2xl",
      )}
    >
      {/* Product Image */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl",
          isPopular ? "min-h-0 flex-1 rounded-2xl" : "h-55",
        )}
      >
        {product.cover && (
          <Image
            src={product.cover}
            alt={product.title}
            fill
            sizes={
              isPopular
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                : "302px"
            }
            className={cn(
              "object-cover",
              isPopular &&
                "transition-transform duration-300 group-hover:scale-105",
            )}
          />
        )}

        {/* Popular Hover Actions */}
        {isPopular && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#E7969F]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Quick view"
              className="text-text-maron-700 flex size-7 items-center justify-center rounded-full bg-white"
            >
              <Eye size={15} />
            </button>

            <button
              type="button"
              aria-label="Add to favorites"
              className="text-text-maron-700 flex size-7 items-center justify-center rounded-full bg-white"
            >
              <Heart size={15} />
            </button>
          </div>
        )}

        {/* Product Badges */}
        <div
          className={cn(
            "absolute top-2 z-20 flex flex-wrap gap-1",
            isPopular ? "inset-e-1 justify-end" : "right-2",
          )}
        >
          {product.stock <= 0 ? (
            <Badge variant="primary" className="bg-red-500 text-white">
              <span className="translate-y-[5%]">
                {t("Product.outOfStock")}
              </span>
            </Badge>
          ) : (
            isPopular &&
            product.stock && (
              <>
                <Badge variant="secondary" className="text-text-zinc-700">
                  <span className="translate-y-[5%]">{t("Product.new")}</span>
                </Badge>

                <Badge variant="secondary" className="text-text-maron">
                  <span className="translate-y-[5%]">{t("Product.hot")}</span>
                </Badge>
              </>
            )
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className={isPopular ? "space-y-2" : "space-y-1"}>
        <p
          className={cn(
            "font-primary truncate leading-none font-semibold",
            isPopular
              ? "text-text-maron-700 text-[18px]"
              : "text-text-primary text-[16px]",
          )}
        >
          {product.title}
        </p>

        {/* Rating & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: starsCount }, (_, i) => (
              <Star
                key={i}
                size={isPopular ? 20 : 17}
                strokeWidth={1.5}
                fill={i < Math.round(product.rating ?? 0) ? "#F9A825" : "none"}
                className="text-[#F9A825]"
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={t("Product.addToCart")}

            onClick={() => {}}
            className={cn(
              "flex items-center justify-center rounded-full text-white disabled:cursor-not-allowed disabled:opacity-50",
              quantity > 0 ? "bg-text-primary" : "bg-bg-maron",
              isPopular ? "translate-y-[50%] p-2" : "size-9",
            )}
          >
            {quantity > 0 ? (
              <span className="text-xs font-bold">{quantity}</span>
            ) : (
              <ShoppingCart size={isPopular ? "1.625rem" : 19} />
            )}
          </button>
        </div>

        {/* Price */}
        <div
          className={cn(
            "flex items-center gap-2",
            isPopular && "flex-wrap gap-1",
          )}
        >
          {hasDiscount && (
            <span
              className={cn(
                "font-primary text-text-muted align-bottom text-base leading-none font-medium tracking-normal line-through",
              )}
            >
              {product.price} {t("Product.currency")}
            </span>
          )}
          <span
            className={cn(
              "font-primary align-bottom text-[14px] leading-none font-medium",
              isPopular ? "text-text-maron-700 text-[16px]" : "text-bg-primary",
            )}
          >
            {discountedPrice} {t("Product.currency")}
          </span>
        </div>
      </div>
    </div>
  );
}
