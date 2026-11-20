import type { ComponentProps } from "react";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { getDiscountedPrice } from "@/shared/lib/utils/price";
import { Button } from "@/shared/ui/button";
import { cn } from "cn";
import { Skeleton } from "../ui/skeleton";

type RowSkeletonProps = {
  variant?: "cart" | "wishlist";
};

function Root({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "border-border-muted flex items-stretch gap-4 border-b pb-5 last:border-b-0 dark:border-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

type ImageProps = {
  src: string;
  alt: string;
  dimmed?: boolean;
  className?: string;
};

function ProductImage({ src, alt, dimmed = false, className }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={117}
      height={140}
      className={cn(
        "h-24 w-20 shrink-0 rounded-lg object-cover sm:h-28 sm:w-24 lg:h-35 lg:w-29.25",
        dimmed && "opacity-50",
        className,
      )}
    />
  );
}

function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-1 flex-col gap-2.5", className)} {...props} />
  );
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
}

function Info({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

function Title({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-text-maroon-700 text-lg font-semibold", className)}
      {...props}
    />
  );
}

type RatingProps = {
  rating: number;
  ratings: number;
  variant?: "default" | "badge";
};

function Rating({ rating, ratings, variant = "default" }: RatingProps) {
  const t = useTranslations("ProductRow");

  return (
    <div className="flex items-center gap-1.5">
      {variant === "badge" ? (
        <span className="bg-bg-warning flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium text-zinc-900">
          <Star aria-hidden="true" size={16} className="fill-current" />
          {rating}/5
        </span>
      ) : (
        <>
          <Star
            aria-hidden="true"
            size={20}
            className="fill-amber-500 text-amber-500"
          />
          <p className="text-base font-normal">
            {t("rating")} <span className="font-medium">{rating}/5</span>
          </p>
        </>
      )}
      <p className="text-text-info text-base font-medium">
        ({t("ratingsCount", { count: ratings })})
      </p>
    </div>
  );
}

function StockStatus({ inStock }: { inStock: boolean }) {
  const t = useTranslations("ProductRow");

  return (
    <p
      className={cn(
        "text-xs font-medium",
        inStock ? "text-emerald-500" : "text-red-600",
      )}
    >
      {inStock ? t("inStock") : t("outOfStock")}
    </p>
  );
}

type PriceProps = {
  price: number;
  discountType?: string | null;
  discountValue?: number | null;
  quantity?: number;
  showOriginal?: boolean;
};

function Price({
  price,
  discountType,
  discountValue,
  quantity,
  showOriginal = false,
}: PriceProps) {
  const t = useTranslations("ProductRow");

  const multiplier = quantity ?? 1;
  const unitPrice = getDiscountedPrice({ price, discountType, discountValue });
  const hasDiscount = unitPrice < price;

  return (
    <div className="flex items-end gap-1.5">
      {quantity !== undefined && (
        <p className="text-text-maroon text-sm font-medium">(×{quantity})</p>
      )}
      <span className="text-text-plain text-2xl font-bold">
        {(unitPrice * multiplier).toFixed(2)}
      </span>
      <p className="text-text-plain text-base font-medium">{t("currency")}</p>

      {showOriginal && hasDiscount && (
        <del className="text-text-muted text-sm">
          <span className="sr-only">{t("originalPrice")}</span>
          {(price * multiplier).toFixed(2)} {t("currency")}
        </del>
      )}
    </div>
  );
}

function Actions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props} />
  );
}

function Footer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex items-end justify-between gap-4", className)}
      {...props}
    />
  );
}

type RemoveButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "variant"
> & {
  label: string;
  iconOnly?: boolean;
};

function RemoveButton({
  label,
  iconOnly = false,
  className,
  ...props
}: RemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="destructive"
      size={iconOnly ? "icon" : "default"}
      aria-label={iconOnly ? label : undefined}
      className={cn(
        !iconOnly && "gap-1.5 p-2.5 text-sm font-medium",
        className,
      )}
      {...props}
    >
      <Trash2 aria-hidden="true" size={20} />
      {!iconOnly && label}
    </Button>
  );
}

function RowSkeleton({ variant = "cart" }: RowSkeletonProps) {
  const isCart = variant === "cart";

  return (
    <li className="border-border-muted flex items-stretch gap-4 border-b pb-5">
      <Skeleton className="h-35 w-29.25 shrink-0 rounded-lg" />

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            {!isCart && <Skeleton className="h-3 w-16" />}
            <Skeleton className="h-6 w-56 max-w-full" />
            <Skeleton className="h-5 w-44 max-w-full" />
          </div>

          <Skeleton
            className={cn("rounded-lg", isCart ? "h-10 w-28" : "size-10")}
          />
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton
            className={cn("rounded-lg", isCart ? "h-12 w-44" : "h-10 w-36")}
          />
        </div>
      </div>
    </li>
  );
}

export const ProductRow = Object.assign(Root, {
  Image: ProductImage,
  Content,
  Header,
  Info,
  Title,
  Rating,
  StockStatus,
  Price,
  Actions,
  Footer,
  RemoveButton,
  Skeleton: RowSkeleton,
});
