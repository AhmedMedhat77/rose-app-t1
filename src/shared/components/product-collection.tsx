import type { ComponentProps, ReactNode } from "react";
import { BrushCleaning, MoveLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { cn } from "cn";

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
      {...props}
    >
      <BrushCleaning aria-hidden="true" size={20} />
      {isPending ? (pendingLabel ?? label) : label}
    </Button>
  );
}

// الإطار اللي فيه القايمة (أو رسالة الفراغ)
function Body({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-border-muted max-h-301.75 overflow-y-auto rounded-xl border p-5",
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

function Empty({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-text-muted py-8 text-center text-lg font-bold",
        className,
      )}
      {...props}
    />
  );
}

type ContinueShoppingProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

// الزرار نفسه هو اللينك، بدل Button جوه Link (عنصرين تفاعليين جوه بعض)
function ContinueShopping({
  href = "/products",
  children,
  className,
}: ContinueShoppingProps) {
  return (
    <Button
      render={<Link href={href} />}
      nativeButton={false}
      className={cn("w-fit max-w-53.25", className)}
    >
      <MoveLeft aria-hidden="true" size={20} className="rtl:rotate-180" />
      {children}
    </Button>
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
});
