import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { cn } from "cn";
import type { IProduct } from "@/features/products/types/product";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { Link } from "@/i18n/navigation";
import { RatingStars } from "@/shared/components/rating-stars";
import { getDiscountedPrice } from "@/shared/lib/utils/discounted-price.util";
import { Badge } from "@/shared/ui/badge";
import AddToCartButton from "./add-to-cart-button";
import { useTranslations } from "next-intl";
import { NewBadge } from "./new-badge";

function Root({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group relative isolate flex w-full flex-col gap-3",
        className,
      )}
      {...props}
    />
  );
}

// the image area, everything that floats over it is passed as children
function Media({
  product,
  children,
}: {
  product: IProduct;
  children?: ReactNode;
}) {
  return (
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
      {children}
    </div>
  );
}

// version WITHOUT hover: heart on the top corner
function WishlistCorner({ productId }: { productId: string }) {
  return (
    <WishlistButton
      productId={productId}
      className="absolute inset-s-2.5 top-2.5 z-30"
    />
  );
}

// version WITH hover: eye + heart appear when the card is hovered
function HoverActions({ productId }: { productId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 bg-[#E7969F]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
      <button
        type="button"
        aria-label="Quick view"
        className="bg-bg-plain text-text-primary pointer-events-auto flex size-7.5 items-center justify-center rounded-full"
      >
        <Eye className="size-5" />
      </button>

      <WishlistButton productId={productId} className="pointer-events-auto" />
    </div>
  );
}

function Badges({ product }: { product: IProduct }) {
  const t = useTranslations();

  const isHot = (product.rating ?? 0) >= 4.5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pointer-events-none absolute inset-e-2.5 top-2.5 z-20 flex flex-wrap justify-end gap-1.5">
      {isOutOfStock && (
        <Badge
          variant="primary"
          className="bg-bg-danger text-text-secondary-fade dark:text-text-plain"
        >
          <span>{t("Product.outOfStock")}</span>
        </Badge>
      )}
      <NewBadge createdAt={product.createdAt} />
      {isHot && (
        <Badge
          variant="secondary"
          className="bg-bg-primary-fade text-text-maroon dark:bg-bg-maroon-secondary dark:text-text-secondary"
        >
          <span>{t("Product.hot")}</span>
        </Badge>
      )}
    </div>
  );
}

// title, rating, add to cart and price (same in every version)
function Details({ product }: { product: IProduct }) {
  // const t = await getTranslations();
  const t = useTranslations();
  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < Number(product.price);

  return (
    <div className="space-y-2">
      <p className="font-primary text-text-primary truncate text-base leading-none font-semibold">
        <Link
          href={`/products/${product.id}`}
          className="focus-visible:after:outline-ring after:absolute after:inset-0 after:z-10 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2"
        >
          {product.title}
        </Link>
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <RatingStars rating={product.rating} />
        </div>

        <div className="relative z-20">
          <AddToCartButton
            productId={String(product.id)}
            variant="icon"
            stock={product.stock}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasDiscount && (
          <span className="text-text-maroon-700 align-bottom leading-none font-medium">
            {discountedPrice} {t("Product.currency")}
          </span>
        )}

        <span
          className={cn(
            "align-bottom leading-none font-medium",
            hasDiscount
              ? "text-text-muted line-through"
              : "text-text-maroon-700",
          )}
        >
          {product.price} {t("Product.currency")}
        </span>
      </div>
    </div>
  );
}

export const ProductCardCompound = Object.assign(Root, {
  Media,
  WishlistCorner,
  HoverActions,
  Badges,
  Details,
});
