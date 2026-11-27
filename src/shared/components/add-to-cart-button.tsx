"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCartContext } from "@/features/cart/context/cart-provider";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { addToast } from "@/shared/ui/toast";
import type { IProductOverviewResponse } from "@/features/products/types/product";
import type { IApiResponse } from "@/shared/lib/types/api";
import { cn } from "cn";

// types
interface IAddToCartButtonProps {
  productId: string;
  stock: number;
  quantity?: number;
  variant?: "icon" | "full";
  isPopular?: boolean;
  className?: string;
  disabled?: boolean;
  onError?: (error: unknown) => void;
}

export default function AddToCartButton({
  productId,
  quantity = 1,
  variant = "icon",
  isPopular = false,
  className,
  stock,
  disabled = false,
  onError,
}: IAddToCartButtonProps) {
  // transilation
  const t = useTranslations("Cart");
  // state
  const [isAdding, setIsAdding] = useState(false);
  // context
  const { addToCart, getProductQuantity } = useCartContext();
  // apis hook
  const productQuantity = getProductQuantity(productId);
  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isOutOfStock || isAdding;

  async function handleAddToCart() {
    if (isDisabled) return;

    setIsAdding(true);

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(productId)}`,
        { cache: "no-store" },
      );
      const result: IApiResponse<IProductOverviewResponse> =
        await response.json();

      if (!response.ok || !result.status) {
        throw new Error(
          "message" in result ? result.message : "Product request failed",
        );
      }

      const product = result.payload.product;

      if (product.stock <= 0) {
        throw new Error("Product is out of stock");
      }

      await addToCart({
        product,
        quantity,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);

      const message =
        error instanceof Error && error.message === "Product is out of stock"
          ? t("outOfStock")
          : t("addToCartFailed");

      addToast(TOAST_STATE.Unsuccessful, message);

      onError?.(error);
    } finally {
      setIsAdding(false);
    }
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="primary"
        size="default"
        disabled={isDisabled}
        loading={isAdding}
        onClick={handleAddToCart}
        className={cn("relative", className)}
      >
        <span className="relative flex items-center justify-center">
          <ShoppingCart size={20} />

          {productQuantity > 0 && (
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold">
              {productQuantity}
            </span>
          )}
        </span>

        {isAdding ? t("adding") : t("addToCart")}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="primary"
      disabled={isDisabled}
      loading={isAdding}
      onClick={handleAddToCart}
      aria-label={variant === "icon" ? t("addToCart") : undefined}
      className={cn(
        "bg-bg-maroon-secondary relative size-10.5 rounded-full",
        isPopular && "translate-y-[50%]",
        className,
      )}
    >
      <span className="relative flex items-center justify-center">
        <ShoppingCart size={20} />

        {productQuantity > 0 && (
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold">
            {productQuantity}
          </span>
        )}
      </span>
    </Button>
  );
}
