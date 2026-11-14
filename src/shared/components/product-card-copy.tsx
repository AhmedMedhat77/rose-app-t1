import Image from "next/image";
import { connection } from "next/server";
import { ShoppingCart, Star, Eye, Heart, HeartPlus } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { getTranslations } from "next-intl/server";
import { IProduct } from "@/features/products/types/product";
import { isNewProduct } from "@/shared/lib/utils/time.util";
import { getRatingStarFills } from "@/shared/lib/utils/rating-stars.util";
import { Button } from "../ui/button";

export default async function ProductCard({ product }: { product: IProduct }) {
  const t = await getTranslations();

  const discountedPrice =
    product.discountValue &&
    Number(product.price) -
      (Number(product.price) * Number(product.discountValue)) / 100;

  await connection();
  const isNew = Boolean(product.createdAt) && isNewProduct(product.createdAt);
  const isHot = product.rating >= 4.5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group flex w-full flex-col gap-3">
      {/* Product Image */}
      <div className="relative h-68 w-full overflow-hidden rounded-xl">
        {product.cover && (
          <Image
            src={product.cover}
            alt={product.title}
            fill
            sizes="320px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Add to Wishlist button */}
        <button
          type="button"
          aria-label={t("Product.addToFavorites")}
          className="absolute inset-s-2.5 top-2.5 z-20 flex size-7.5 items-center justify-center rounded-full bg-white"
        >
          <HeartPlus className="text-text-maroon size-5" />
        </button>

        {/* Hover Actions */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#E7969F]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            aria-label="Quick view"
            className="text-text-maroon-700 flex size-7.5 items-center justify-center rounded-full bg-white"
          >
            <Eye className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Add to favorites"
            className="text-text-maroon-700 flex size-7.5 items-center justify-center rounded-full bg-white"
          >
            <Heart className="size-5" />
          </button>
        </div>

        {/* Product Badges */}
        <div className="absolute inset-e-2.5 top-2.5 z-20 flex flex-wrap justify-end gap-1.5">
          {isOutOfStock && (
            <Badge
              variant="primary"
              className="bg-bg-danger text-text-secondary-fade dark:text-text-plain"
            >
              <span>{t("Product.outOfStock")}</span>
            </Badge>
          )}
          {isNew && (
            <Badge
              variant="subtle"
              className="bg-bg-muted text-text-zinc-700 dark:bg-bg-inverse dark:text-text-inverse"
            >
              <span>{t("Product.new")}</span>
            </Badge>
          )}
          {isHot && (
            <Badge
              variant="secondary"
              className="bg-bg-primary-fade text-text-maroon dark:bg-bg-maroon-secondary dark:text-text-secondary"
            >
              <span>{t("Product.hot")}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2">
        <p className="font-primary text-text-primary truncate text-base leading-none font-semibold">
          {product.title}
        </p>

        {/* Rating & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {getRatingStarFills(product.rating).map((fill, index) => (
              <span key={index} className="relative inline-flex size-4">
                <Star
                  size={16}
                  strokeWidth={1.5}
                  className="text-text-rating"
                />
                <span
                  className="absolute inset-y-0 inset-s-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    size={16}
                    strokeWidth={1.5}
                    fill="currentColor"
                    className="text-text-rating"
                  />
                </span>
              </span>
            ))}
          </div>

          <Button
            type="button"
            aria-label="Add to cart"
            className="bg-bg-maroon-secondary hover:bg-bg-maroon size-10 shrink-0 rounded-full p-0 text-white"
          >
            <ShoppingCart className="size-5" />
          </Button>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-2">
          {discountedPrice && (
            <span className="text-text-maroon-700 align-bottom leading-none font-medium">
              {discountedPrice} {t("Product.currency")}
            </span>
          )}

          <span
            className={`align-bottom leading-none font-medium ${discountedPrice ? "text-text-muted line-through" : "text-text-maroon-700"}`}
          >
            {product.price} {t("Product.currency")}
          </span>
        </div>
      </div>
    </div>
  );
}
