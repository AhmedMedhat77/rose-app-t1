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

import type { IGuestCartItem, IAddToCartPayload } from "../types/cart.types";

import {
  addGuestCartItem,
  clearGuestCart,
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
  isReady: boolean;
  isMerging: boolean;
  mergeError: string | null;
  cartLength: number;

  getProductQuantity: (productId: string) => number;

  addToCart: (payload: IAddToCartPayload) => Promise<void>;

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
  const { data: cartData, isLoading: isCartLoading } = useCart(
    status === "authenticated",
  );

  // Merge state
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);

  const mergeLockRef = useRef(false);
  const mergeAttemptRef = useRef<string | null>(null);

  // Promise wrappers using mutate
  const addGuestItemToServer = useCallback(
    (item: IGuestCartItem): Promise<void> => {
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
    async (payload: IAddToCartPayload) => {
      if (status === "loading") {
        throw new Error("Authentication is still loading.");
      }

      if (!payload.productId || payload.quantity < 1) {
        throw new Error("Invalid cart item.");
      }

      if (status === "authenticated") {
        await addGuestItemToServer(payload as IGuestCartItem);

        return;
      }

      addGuestCartItem(payload);
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

      // If the cart belongs to another account,
      // do not merge it automatically.
      if (currentOwner && currentOwner !== userId) {
        throw new Error("Guest cart belongs to another account.");
      }

      setGuestCartOwner(userId);

      for (const item of guestItems) {
        await addGuestItemToServer(item);

        // Remove the local item only after
        // successful server response.
        removeGuestCartItem(item.productId);
      }

      clearGuestCart();

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
      // Error is already stored in mergeError.
    });
  }, [status, userId, guestCart, syncGuestCart]);

  // Derived values
  const isAuthenticated = status === "authenticated";

  const cartLength = isAuthenticated
    ? (cartData?.cartItems?.length ?? 0)
    : guestCart.length;

  const isReady = status !== "loading" && (!isAuthenticated || !isCartLoading);

  // Context value
  const value: ICartContext = {
    guestCart,
    isReady,
    isMerging,
    mergeError,
    cartLength,

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
