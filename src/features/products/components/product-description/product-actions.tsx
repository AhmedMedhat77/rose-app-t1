import { HeartPlus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

interface ProductActionsProps {
  disabled: boolean;
  onAddToCart: () => void;
}

export function ProductActions({ disabled, onAddToCart }: ProductActionsProps) {
  const t = useTranslations("Product");

  return (
    <div className="mt-auto flex gap-3 pt-3">
      <Button
        type="button"
        size="icon-lg"
        variant="ghost"
        className="bg-muted size-14 dark:border-zinc-500 dark:bg-transparent"
        aria-label={t("addToWishlist")}
      >
        <HeartPlus className="size-6.25" />
      </Button>
      <Button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        className="h-14 w-full"
      >
        <ShoppingCart />
        {t("addToCart")}
      </Button>
    </div>
  );
}
