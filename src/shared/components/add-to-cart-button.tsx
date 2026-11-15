"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useCartContext } from "@/features/cart/context/cart-provider";
import { cn } from "cn";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface IAddToCartButtonProps {
  productId: string;
  stock: number;
  quantity?: number;
  variant?: "icon" | "full";
  isPopular?: boolean;
  className?: string;
  disabled?: boolean;
  onAdded?: () => void;
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
  onAdded,
  onError,
}: IAddToCartButtonProps) {
  const t = useTranslations("Cart");
  const { addToCart, getProductQuantity } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const productQuantity = getProductQuantity(productId);

  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isOutOfStock || isAdding;

  const handleAddToCart = async () => {
    if (isDisabled) return;
    try {
      setIsAdding(true);

      await addToCart({
        productId,
        quantity,
      });

      onAdded?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setIsAdding(false);
    }
  };

  // Full button
  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="primary"
        size="default"
        disabled={isDisabled}
        loading={isAdding}
        onClick={handleAddToCart}
        className="relative"
      >
        <ShoppingCart size={20} />
        {t("addToCart")}
        {productQuantity > 0 && (
          <span className="absolute inset-s-5 -top-0.5 text-sm">
            {productQuantity}
          </span>
        )}
      </Button>
    );
  }

  // Icon button
  return (
    <Button
      type="button"
      variant="primary"
      disabled={isDisabled}
      loading={isAdding}
      onClick={handleAddToCart}
      className={cn(
        "bg-bg-maroon-secondary relative size-10.5 rounded-full",
        isPopular && "translate-y-[50%]",
        className,
      )}
    >
      <ShoppingCart size={24} />

      {productQuantity > 0 && (
        <span className="absolute -top-0.5 right-3 text-sm text-white dark:text-black">
          {productQuantity}
        </span>
      )}
    </Button>
  );
}
