"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getDiscountedPrice } from "@/shared/lib/utils/discounted-price.util";
import { Badge } from "@/shared/ui/badge";
import { cn } from "cn";
import { Eye, Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AddToCartButton from "./add-to-cart-button";

export interface ProductCardProduct {
  id: string | number;
  title: string;
  cover?: string | null;
  stock: number;
  rating?: number | null;
  price: number | string;
  discountType?: string | null;
  discountValue?: number | string | null;
  createdAt?: string | Date | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  variant?: "bestSelling" | "mostPopular" | "displayAllProduct";
}

// Checks whether the product was created within the last 7 days.
function isNewProduct(createdAt?: string | Date | null) {
  if (!createdAt) return false;

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return false;

  const daysDifference = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  return daysDifference >= 0 && daysDifference <= 7;
}

export default function ProductCard({
  product,
  variant = "bestSelling",
}: ProductCardProps) {
  const t = useTranslations();
  const isPopular = variant === "mostPopular";

  const [isWishlisted, setIsWishlisted] = useState(false);

  const starsCount = isPopular ? 5 : 4;

  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < Number(product.price);

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "relative isolate w-full space-y-2",
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
        <Link href={`/products/${product.id}`}>
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
        </Link>

        {/* Wishlist Button */}
        {variant === "displayAllProduct" && (
          <button
            type="button"
            aria-label={
              isWishlisted
                ? t("Product.removeFromWishlist")
                : t("Product.addToWishlist")
            }
            aria-pressed={isWishlisted}
            onClick={toggleWishlist}
            className={cn(
              "group/wishlist absolute start-2 top-2 z-30 cursor-pointer",
              "flex h-8 w-8 items-center justify-start gap-2",
              "rounded-full px-[8px]",
              "transition-all duration-300 ease-in-out",
              "hover:w-[180px]",
              isWishlisted
                ? "bg-bg-inverse text-text-inverse"
                : "bg-bg-plain text-text-maron-700",
            )}
          >
            <Heart
              size={16}
              className="shrink-0"
              fill={isWishlisted ? "currentColor" : "none"}
            />

            <span
              className={cn(
                "max-w-0 overflow-hidden text-xs font-medium whitespace-nowrap opacity-0",
                "transition-all duration-300",
                "group-hover/wishlist:max-w-[150px]",
                "group-hover/wishlist:opacity-100",
              )}
            >
              {isWishlisted
                ? t("WishList.removeFromWishlist")
                : t("WishList.addToWishlist")}
            </span>
          </button>
        )}

        {/* Popular Hover Actions */}
        {isPopular && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 bg-[#E7969F]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Toggle wishlist"
              aria-pressed={isWishlisted}
              onClick={toggleWishlist}
              className="text-text-maroon-700 pointer-events-auto flex size-7 items-center justify-center rounded-full bg-white"
            >
              <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              aria-label="Quick view"
              className="text-text-maroon-700 pointer-events-auto flex size-7 items-center justify-center rounded-full bg-white"
            >
              <Eye size={15} />
            </button>
          </div>
        )}

        {/* Product Badges */}
        <div
          className={cn(
            "pointer-events-none absolute top-2 z-20 flex flex-wrap gap-1",
            isPopular ? "inset-e-1 justify-end" : "end-2",
          )}
        >
          {product.stock <= 0 ? (
            <Badge
              variant="primary"
              className="bg-bg-danger text-text-secondary-fade dark:text-text-plain"
            >
              <span>{t("Product.outOfStock")}</span>
            </Badge>
          ) : (
            <>
              {isNewProduct(product.createdAt) && (
                <Badge
                  variant="subtle"
                  className="bg-bg-muted text-text-zinc-700 dark:bg-bg-inverse dark:text-text-inverse"
                >
                  <span>{t("Product.new")}</span>
                </Badge>
              )}

              {(product.rating ?? 0) >= 4 && (
                <Badge
                  variant="secondary"
                  className="bg-bg-primary-fade text-text-maroon dark:bg-bg-maroon-secondary dark:text-text-secondary"
                >
                  <span>{t("Product.hot")}</span>
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className={isPopular ? "space-y-2" : "space-y-1"}>
        <p
          className={cn(
            "font-primary truncate leading-none font-semibold",
            isPopular
              ? "text-text-maroon-700 text-lg"
              : "text-text-primary text-base",
          )}
        >
          <Link
            href={`/products/${product.id}`}
            className="focus-visible:after:outline-ring after:absolute after:inset-0 after:z-10 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2"
          >
            {product.title}
          </Link>
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

          <div className="relative z-20">
            <AddToCartButton
              productId={String(product.id)}
              variant="icon"
              stock={product.stock}
            />
          </div>
        </div>

        {/* Price */}
        <div
          className={cn(
            "flex items-center gap-2",
            isPopular && "flex-wrap gap-1",
          )}
        >
          {hasDiscount && (
            <span className="font-primary text-text-muted align-bottom text-base leading-none font-medium tracking-normal line-through">
              {product.price} {t("Product.currency")}
            </span>
          )}

          <span
            className={cn(
              "font-primary align-bottom text-[14px] leading-none font-medium",
              isPopular
                ? "text-text-maroon-700 text-[16px]"
                : "text-bg-primary",
            )}
          >
            {discountedPrice} {t("Product.currency")}
          </span>
        </div>
      </div>
    </div>
  );
}
