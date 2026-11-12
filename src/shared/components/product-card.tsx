import Image from "next/image";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "cn";
import { useTranslations } from "next-intl";

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

  const discountedPrice =
    product.discountValue &&
    Number(product.price) -
      (Number(product.price) * Number(product.discountValue)) / 100;

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
            isPopular ? "end-1 justify-end" : "right-2",
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
                  className="bg-bg-primary-fade text-text-maron dark:bg-bg-maron-secondary dark:text-text-secondary"
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
              ? "text-text-maron-700 text-lg"
              : "text-text-primary text-base",
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
            aria-label="Add to cart"
            className={cn(
              "bg-bg-maron-secondary flex items-center justify-center rounded-full text-white",
              isPopular ? "translate-y-[50%] p-2" : "size-10",
            )}
          >
            <ShoppingCart className="size-5" />
          </button>
        </div>

        {/* Price */}
        <div
          className={cn(
            "flex items-center gap-2",
            isPopular && "flex-wrap gap-1",
          )}
        >
          <span
            className={cn(
              "font-primary align-bottom text-[14px] leading-none font-medium",
              isPopular ? "text-text-maron-700 text-[16px]" : "text-bg-primary",
            )}
          >
            {product.price} {t("Product.currency")}
          </span>

          {discountedPrice && (
            <span className="font-primary text-text-muted align-bottom text-base leading-none font-medium tracking-normal line-through">
              {discountedPrice} {t("Product.currency")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
