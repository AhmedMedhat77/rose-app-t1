"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";

import { useAddCartItem } from "../hooks/use-add-cart-item";
import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import { useRemoveCartItem } from "../hooks/use-remove-cart-item";
import { useClearCart } from "../hooks/use-clear-cart";
import { useCart, cartQueryKey } from "../hooks/use-cart";

import type { IAddToCartInput, ICartViewItem } from "../types/cart.types";

import { mapCartItems, mapGuestCartItems } from "../utils/cart-mapper";

import {
  addGuestCartItem,
  clearGuestCart,
  clearGuestCartOwner,
  getGuestCartOwner,
  getGuestCartServerSnapshot,
  getGuestCartSnapshot,
  removeGuestCartItem,
  setGuestCartOwner,
  subscribeGuestCart,
  updateGuestCartItem,
} from "../utils/guest-cart";

interface ICartContext {
  viewItems: ICartViewItem[];

  isReady: boolean;
  cartLength: number;

  isAuthenticated: boolean;
  isCartLoading: boolean;
  isCartError: boolean;
  cartError: unknown;

  getProductQuantity: (productId: string) => number;
  addToCart: (payload: IAddToCartInput) => Promise<void>;

  updateQuantity: (
    productId: string,
    quantity: number,
    cartItemId?: string,
  ) => Promise<void>;

  removeItem: (productId: string, cartItemId?: string) => Promise<void>;

  clearCart: () => Promise<void>;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const t = useTranslations("Cart");

  // Variables
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated";

  // Guest cart subscription
  const guestCart = useSyncExternalStore(
    subscribeGuestCart,
    getGuestCartSnapshot,
    getGuestCartServerSnapshot,
  );

  // Mutations
  const { mutateAsync: addGuestItemToServer } = useAddCartItem();
  const { mutateAsync: updateServerCartItem } = useUpdateCartItem();
  const { mutateAsync: removeServerCartItem } = useRemoveCartItem();
  const { mutateAsync: clearServerCart } = useClearCart();

  // Authenticated cart query
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useCart(isAuthenticated);

  // Refs
  const mergeLockRef = useRef(false);
  const mergeAttemptRef = useRef<string | null>(null);

  // Add to cart
  const addToCart = useCallback(
    async (payload: IAddToCartInput) => {
      if (status === "loading") {
        throw new Error("Authentication is still loading.");
      }

      const { product, quantity } = payload;

      if (!product?.id || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid cart item.");
      }

      if (product.stock <= 0) {
        throw new Error("Product is out of stock.");
      }

      if (isAuthenticated) {
        await addGuestItemToServer({
          productId: product.id,
          quantity,
        });

        return;
      }

      addGuestCartItem(product, quantity);
    },
    [status, isAuthenticated, addGuestItemToServer],
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (productId: string, quantity: number, cartItemId?: string) => {
      if (status === "loading") {
        throw new Error("Authentication is still loading.");
      }

      if (!productId) {
        throw new Error("Product ID is required.");
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be a positive integer.");
      }

      if (isAuthenticated) {
        if (!cartItemId) {
          throw new Error("Cart item ID is required.");
        }

        await updateServerCartItem({
          cartItemId,
          quantity,
        });

        return;
      }

      updateGuestCartItem(productId, quantity);
    },
    [status, isAuthenticated, updateServerCartItem],
  );

  // Remove item
  const removeItem = useCallback(
    async (productId: string, cartItemId?: string) => {
      if (status === "loading") {
        throw new Error("Authentication is still loading.");
      }

      if (!productId) {
        throw new Error("Product ID is required.");
      }

      if (isAuthenticated) {
        if (!cartItemId) {
          throw new Error("Cart item ID is required.");
        }

        await removeServerCartItem(cartItemId);

        return;
      }

      removeGuestCartItem(productId);
    },
    [status, isAuthenticated, removeServerCartItem],
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (status === "loading") {
      throw new Error("Authentication is still loading.");
    }

    if (isAuthenticated) {
      await clearServerCart();
      return;
    }

    clearGuestCart();
  }, [status, isAuthenticated, clearServerCart]);

  // Get product quantity
  const getProductQuantity = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        return (
          cartData?.cartItems?.find((item) => item.productId === productId)
            ?.quantity ?? 0
        );
      }

      return (
        guestCart.find((item) => item.productId === productId)?.quantity ?? 0
      );
    },
    [isAuthenticated, cartData, guestCart],
  );

  // Sync guest cart with backend
  const syncGuestCart = useCallback(async () => {
    if (!isAuthenticated || !userId || mergeLockRef.current) {
      return;
    }

    const guestItems = [...getGuestCartSnapshot()];

    if (guestItems.length === 0) {
      clearGuestCartOwner();
      return;
    }

    mergeLockRef.current = true;

    try {
      const currentOwner = getGuestCartOwner();

      // Prevent merging another account's cart.
      if (currentOwner && currentOwner !== userId) {
        throw new Error("Guest cart belongs to another account.");
      }

      setGuestCartOwner(userId);

      for (const item of guestItems) {
        await addGuestItemToServer({
          productId: item.productId,
          quantity: item.quantity,
        });

        // Remove an item only after the backend accepts it.
        removeGuestCartItem(item.productId);
      }

      clearGuestCartOwner();

      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    } catch (error) {
      console.error("Failed to sync guest cart:", error);
      addToast(TOAST_STATE.Unsuccessful, t("syncGuestCartFailed"));

      throw error;
    } finally {
      mergeLockRef.current = false;
    }
  }, [isAuthenticated, userId, addGuestItemToServer, queryClient, t]);

  // Automatically sync guest cart once per authenticated user.
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      mergeAttemptRef.current = null;
      return;
    }

    if (guestCart.length === 0) {
      return;
    }

    if (mergeAttemptRef.current === userId) {
      return;
    }

    mergeAttemptRef.current = userId;

    void syncGuestCart().catch(() => {
      // The error is already handled with a toast inside syncGuestCart.
    });
  }, [isAuthenticated, userId, guestCart, syncGuestCart]);

  // Variables
  const viewItems = isAuthenticated
    ? mapCartItems(cartData?.cartItems ?? [])
    : mapGuestCartItems(guestCart);

  const cartLength = isAuthenticated
    ? (cartData?.cartItems?.length ?? 0)
    : guestCart.length;

  const isReady = status !== "loading" && (!isAuthenticated || !isCartLoading);

  // Context value
  const value: ICartContext = {
    viewItems,

    isReady,
    cartLength,

    isAuthenticated,
    isCartLoading,
    isCartError,
    cartError,

    getProductQuantity,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within CartProvider.");
  }

  return context;
}
