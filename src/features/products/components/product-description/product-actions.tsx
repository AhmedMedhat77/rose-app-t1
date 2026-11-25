import { HeartPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import AddToCartButton from "@/shared/components/add-to-cart-button";

interface ProductActionsProps {
  productId: string;
  stock: number;
  quantity?: number;
  disabled?: boolean;
}

export function ProductActions({
  productId,
  stock,
  quantity = 1,
  disabled = false,
}: ProductActionsProps) {
  const t = useTranslations("Product");

  return (
    <div className="mt-auto flex gap-3 pt-3">
      <Button
        type="button"
        size="icon-lg"
        variant="ghost"
        className="bg-muted size-14"
        aria-label={t("addToWishlist")}
      >
        <HeartPlus aria-hidden="true" className="size-6.25" />
      </Button>

      <AddToCartButton
        productId={productId}
        stock={stock}
        quantity={quantity}
        disabled={disabled}
        variant="full"
        className="h-14 w-full"
      />
    </div>
  );
}
