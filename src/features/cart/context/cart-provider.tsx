"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

import { useAddCartItem } from "../hooks/use-add-cart-item";
import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import { useRemoveCartItem } from "../hooks/use-remove-cart-item";
import { useClearCart } from "../hooks/use-clear-cart";
import { useCart, cartQueryKey } from "../hooks/use-cart";

import type {
  IGuestCartItem,
  IAddToCartPayload,
  IAddToCartInput,
  ICartViewItem,
} from "../types/cart.types";
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

// Types
interface ICartContext {
  guestCart: IGuestCartItem[];
  viewItems: ICartViewItem[];

  isReady: boolean;
  isMerging: boolean;
  mergeError: string | null;
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
  syncGuestCart: () => Promise<void>;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const queryClient = useQueryClient();

  const userId = session?.user?.id;

  // Guest cart subscription
  const guestCart = useSyncExternalStore(
    subscribeGuestCart,
    getGuestCartSnapshot,
    getGuestCartServerSnapshot,
  );

  // Mutations
  const { mutate: addMutation } = useAddCartItem();
  const { mutate: updateMutation } = useUpdateCartItem();
  const { mutate: removeMutation } = useRemoveCartItem();
  const { mutate: clearMutation } = useClearCart();

  // Authenticated cart query
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useCart(status === "authenticated");

  // Merge state
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);

  const mergeLockRef = useRef(false);
  const mergeAttemptRef = useRef<string | null>(null);

  // Promise wrappers using mutate

  const addGuestItemToServer = useCallback(
    (item: IAddToCartPayload): Promise<void> => {
      return new Promise((resolve, reject) => {
        addMutation(item, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [addMutation],
  );

  const updateServerCartItem = useCallback(
    (variables: { cartItemId: string; quantity: number }): Promise<void> => {
      return new Promise((resolve, reject) => {
        updateMutation(variables, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [updateMutation],
  );

  const removeServerCartItem = useCallback(
    (cartItemId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        removeMutation(cartItemId, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [removeMutation],
  );

  const clearServerCart = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      clearMutation(undefined, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  }, [clearMutation]);

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

      if (status === "authenticated") {
        await addGuestItemToServer({
          productId: product.id,
          quantity,
        });

        return;
      }

      // Save complete product in localStorage
      addGuestCartItem(product, quantity);
    },
    [status, addGuestItemToServer],
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

      if (status === "authenticated") {
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
    [status, updateServerCartItem],
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

      if (status === "authenticated") {
        if (!cartItemId) {
          throw new Error("Cart item ID is required.");
        }

        await removeServerCartItem(cartItemId);

        return;
      }

      removeGuestCartItem(productId);
    },
    [status, removeServerCartItem],
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (status === "loading") {
      throw new Error("Authentication is still loading.");
    }

    if (status === "authenticated") {
      await clearServerCart();
      return;
    }

    clearGuestCart();
  }, [status, clearServerCart]);

  // Get product quantity
  const getProductQuantity = useCallback(
    (productId: string) => {
      if (status === "authenticated") {
        return (
          cartData?.cartItems?.find((item) => item.productId === productId)
            ?.quantity ?? 0
        );
      }

      return (
        guestCart.find((item) => item.productId === productId)?.quantity ?? 0
      );
    },
    [status, cartData, guestCart],
  );

  // Sync guest cart with backend
  const syncGuestCart = useCallback(async () => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    if (mergeLockRef.current) {
      return;
    }

    const guestItems = [...getGuestCartSnapshot()];

    if (guestItems.length === 0) {
      return;
    }

    mergeLockRef.current = true;
    setIsMerging(true);
    setMergeError(null);

    try {
      const currentOwner = getGuestCartOwner();

      // Prevent merging another account's cart
      if (currentOwner && currentOwner !== userId) {
        throw new Error("Guest cart belongs to another account.");
      }

      setGuestCartOwner(userId);

      for (const item of guestItems) {
        // Backend receives only productId and quantity
        await addGuestItemToServer({
          productId: item.productId,
          quantity: item.quantity,
        });

        // Remove local item after successful response
        removeGuestCartItem(item.productId);
      }

      // All items have been synced successfully
      clearGuestCartOwner();

      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync guest cart.";

      setMergeError(message);

      throw error;
    } finally {
      mergeLockRef.current = false;
      setIsMerging(false);
    }
  }, [status, userId, addGuestItemToServer, queryClient]);

  // Auto sync after login
  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    if (guestCart.length === 0) {
      return;
    }

    const attemptKey = [
      userId,
      ...guestCart.map((item) => `${item.productId}:${item.quantity}`),
    ].join("|");

    if (mergeAttemptRef.current === attemptKey) {
      return;
    }

    mergeAttemptRef.current = attemptKey;

    syncGuestCart().catch(() => {
      // Error is already stored in mergeError
    });
  }, [status, userId, guestCart, syncGuestCart]);

  // Derived values
  const isAuthenticated = status === "authenticated";

  const viewItems = isAuthenticated
    ? mapCartItems(cartData?.cartItems ?? [])
    : mapGuestCartItems(guestCart);

  const cartLength = isAuthenticated
    ? (cartData?.cartItems?.length ?? 0)
    : guestCart.length;

  const isReady = status !== "loading" && (!isAuthenticated || !isCartLoading);

  // Context value
  const value: ICartContext = {
    guestCart,
    viewItems,

    isReady,
    isMerging,
    mergeError,
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
    syncGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within CartProvider.");
  }

  return context;
}
