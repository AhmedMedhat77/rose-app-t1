"use client";

import { useTranslations } from "next-intl";

import { ProductCollection } from "@/shared/components/product-collection";

import { useCart } from "../hooks/use-cart";
import { useClearCart } from "../hooks/use-clear-cart";
import { useRemoveCartItem } from "../hooks/use-remove-cart-item";
import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import { mapCartItems } from "../utils/cart-mapper";
import CartItem from "./cart-item";

export default function CartSide() {
  // Translation
  const t = useTranslations("Cart");

  // State
  const { data: cartData, isLoading, isError, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();

  // Variables
  const cartItems = cartData?.cartItems ?? [];
  const items = mapCartItems(cartItems);
  const productsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (isLoading) return <p>{t("loading")}</p>;

  if (isError) {
    return (
      <p role="alert" className="text-text-danger">
        {error instanceof Error ? error.message : t("error")}
      </p>
    );
  }

  return (
    <ProductCollection>
      <ProductCollection.Header>
        <ProductCollection.Heading>
          <ProductCollection.Title>{t("title")}</ProductCollection.Title>
          <ProductCollection.Count>
            {t("no-of-product", { count: productsCount })}
          </ProductCollection.Count>
        </ProductCollection.Heading>

        <ProductCollection.ClearButton
          label={t("clear-cart")}
          pendingLabel={t("clearing")}
          isPending={clearCart.isPending}
          disabled={productsCount === 0}
          onClick={() => clearCart.mutate()}
        />
      </ProductCollection.Header>

      <ProductCollection.Body>
        {items.length === 0 ? (
          <ProductCollection.Empty>{t("no-cart")}</ProductCollection.Empty>
        ) : (
          <ProductCollection.List>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) =>
                  updateCartItem.mutate({ cartItemId: item.id, quantity })
                }
                onRemove={() => removeCartItem.mutate(item.id)}
                isUpdating={updateCartItem.isPending}
                isRemoving={removeCartItem.isPending}
              />
            ))}
          </ProductCollection.List>
        )}
      </ProductCollection.Body>

      <ProductCollection.ContinueShopping href="/products">
        {t("continueShopping")}
      </ProductCollection.ContinueShopping>
    </ProductCollection>
  );
}
