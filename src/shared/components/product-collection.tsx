import type { ComponentProps, ReactNode } from "react";
import { BrushCleaning, MoveLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { cn } from "cn";
import { Skeleton } from "../ui/skeleton";
import { ProductRow } from "./product-row";
import Image from "next/image";

type CollectionSkeletonProps = {
  label: string;
  rows?: number;
  variant?: "cart" | "wishlist";
};

function Root({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-6", className)} {...props} />;
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    />
  );
}

function Heading({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-end gap-2.5", className)} {...props} />;
}

function Title({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-text-plain text-5xl font-bold", className)}
      {...props}
    />
  );
}

function Count({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-text-muted text-base font-medium", className)}
      {...props}
    />
  );
}

type ClearButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
  label: string;
  pendingLabel?: string;
  isPending?: boolean;
};

function ClearButton({
  label,
  pendingLabel,
  isPending = false,
  variant = "secondary",
  disabled,
  ...props
}: ClearButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      disabled={disabled || isPending}
      className="text-text-maroon"
      {...props}
    >
      <BrushCleaning aria-hidden="true" size={20} />
      {isPending ? (pendingLabel ?? label) : label}
    </Button>
  );
}

function Body({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-border-muted max-h-270 overflow-y-auto rounded-xl border p-5 dark:border-zinc-700",
        "scrollbar-none [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function List({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-5", className)} {...props} />;
}

type EmptyProps = ComponentProps<"div"> & {
  imageSrc?: string;
};

function Empty({ imageSrc, className, children, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 py-8",
        className,
      )}
      {...props}
    >
      {imageSrc && <Image src={imageSrc} alt="" width={250} height={214} />}

      <p
        role="status"
        className="text-text-muted text-center text-lg font-bold"
      >
        {children}
      </p>
    </div>
  );
}

type ContinueShoppingProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

function ContinueShopping({
  href = "/products",
  children,
  className,
}: ContinueShoppingProps) {
  return (
    <Button
      render={<Link href={href} />}
      nativeButton={false}
      className={cn("bg-bg-maroon-secondary w-fit max-w-53.25", className)}
    >
      <MoveLeft aria-hidden="true" size={20} className="rtl:rotate-180" />
      {children}
    </Button>
  );
}

function CollectionSkeleton({
  label,
  rows = 3,
  variant = "cart",
}: CollectionSkeletonProps) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">{label}</span>

      <Header>
        <Heading>
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-5 w-24" />
        </Heading>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </Header>

      <Body>
        <List>
          {Array.from({ length: rows }, (_, index) => (
            <ProductRow.Skeleton key={index} variant={variant} />
          ))}
        </List>
      </Body>

      <Skeleton className="h-10 w-53.25 rounded-lg" />
    </div>
  );
}

export const ProductCollection = Object.assign(Root, {
  Header,
  Heading,
  Title,
  Count,
  ClearButton,
  Body,
  List,
  Empty,
  ContinueShopping,
  Skeleton: CollectionSkeleton,
});
