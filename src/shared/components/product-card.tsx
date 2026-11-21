"use client";

import { Link } from "@/i18n/navigation";
import { getDiscountedPrice } from "@/shared/lib/utils/discounted-price.util";
import { Badge } from "@/shared/ui/badge";
import { cn } from "cn";
import { Eye, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AddToCartButton from "./add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

export interface ProductCardProduct {
  id: string | number;
  title: string;
  cover?: string | null;
  stock: number;
  rating?: number | null;
  price: number | string;
  discountType?: string | null;
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

  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < Number(product.price);

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
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 bg-[#E7969F]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Quick view"
              className="text-text-maroon-700 pointer-events-auto flex size-7 items-center justify-center rounded-full bg-white"
            >
              <Eye size={15} />
            </button>

            <WishlistButton productId={String(product.id)} />
          </div>
        )}

        {/* Product Badges */}
        <div
          className={cn(
            "pointer-events-none absolute top-2 z-20 flex flex-wrap gap-1",
            isPopular ? "inset-e-1 justify-end" : "right-2",
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
            isPopular &&
            product.stock && (
              <>
                <Badge
                  variant="subtle"
                  className="bg-bg-muted text-text-zinc-700 dark:bg-bg-inverse dark:text-text-inverse"
                >
                  <span>{t("Product.new")}</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="bg-bg-primary-fade text-text-maroon dark:bg-bg-maroon-secondary dark:text-text-secondary"
                >
                  <span>{t("Product.hot")}</span>
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
