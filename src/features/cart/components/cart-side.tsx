"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ProductCollection } from "@/shared/components/product-collection";
import { useCartContext } from "../context/cart-provider";

import CartItem from "./cart-item";
import ClearCartDialog from "./clear-cart-dialog";

export default function CartSide() {
  const t = useTranslations("Cart");

  const {
    viewItems,
    isReady,
    isAuthenticated,
    isCartLoading,
    isCartError,
    cartError,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartContext();

  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isLoading = !isReady || isCartLoading;

  const handleUpdateQuantity = async (
    productId: string,
    cartItemId: string,
    quantity: number,
  ) => {
    try {
      setActionError(null);
      setPendingItemId(cartItemId);

      await updateQuantity(
        productId,
        quantity,
        isAuthenticated ? cartItemId : undefined,
      );
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      setActionError(t("error"));
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemoveItem = async (productId: string, cartItemId: string) => {
    try {
      setActionError(null);
      setPendingItemId(cartItemId);

      await removeItem(productId, isAuthenticated ? cartItemId : undefined);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      setActionError(t("error"));
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setActionError(null);
      setIsClearing(true);

      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      setActionError(t("error"));
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return <ProductCollection.Skeleton label={t("loading")} />;
  }

  if (isCartError) {
    console.error("Failed to load cart:", cartError);

    return (
      <p role="alert" className="text-text-danger">
        {t("error")}
      </p>
    );
  }

  return (
    <ProductCollection>
      <ProductCollection.Header>
        <ProductCollection.Heading>
          <ProductCollection.Title>{t("title")}</ProductCollection.Title>

          <ProductCollection.Count>
            {t("no-of-product", { count: viewItems.length })}
          </ProductCollection.Count>
        </ProductCollection.Heading>

        <ClearCartDialog
          onConfirm={handleClearCart}
          isPending={isClearing}
          disabled={viewItems.length === 0}
        />
      </ProductCollection.Header>

      <ProductCollection.Body>
        {actionError && (
          <p role="alert" className="text-text-danger">
            {actionError}
          </p>
        )}

        {viewItems.length === 0 ? (
          <ProductCollection.Empty imageSrc="/images/no-cart.png">
            {t("no-cart")}
          </ProductCollection.Empty>
        ) : (
          <ProductCollection.List>
            {viewItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) =>
                  handleUpdateQuantity(item.productId, item.id, quantity)
                }
                onRemove={() => handleRemoveItem(item.productId, item.id)}
                isUpdating={pendingItemId === item.id}
                isRemoving={pendingItemId === item.id}
              />
            ))}
          </ProductCollection.List>
        )}
      </ProductCollection.Body>

      <ProductCollection.ContinueShopping href="/products">
        {viewItems.length > 0 ? t("continueShopping") : t("startShopping")}
      </ProductCollection.ContinueShopping>
    </ProductCollection>
  );
}
