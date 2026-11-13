"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addCartItemAction } from "../actions/cart.actions";
import type { IGuestCartItem } from "../types/cart.types";

import {
  addGuestCartItem,
  clearGuestCart,
  clearGuestCartOwner,
  getGuestCart,
  getGuestCartOwner,
  getGuestCartServerSnapshot,
  getGuestCartSnapshot,
  removeGuestCartItem,
  setGuestCartOwner,
  subscribeGuestCart,
} from "../utils/guest-cart";

interface CartContextType {
  guestCart: IGuestCartItem[];
  isReady: boolean;
  isMerging: boolean;
  mergeError: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  syncGuestCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [isMerging, setIsMerging] = useState(false);
  const [mergeApiError, setMergeApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mergeLockRef = useRef(false);
  const mergeAttemptRef = useRef<string | null>(null);

  const guestCart = useSyncExternalStore(
    subscribeGuestCart,
    getGuestCartSnapshot,
    getGuestCartServerSnapshot,
  );

  const userId = (session?.user as { id?: string } | undefined)?.id;

  const isReady = status !== "loading";

  const guestCartOwner = getGuestCartOwner();

  const ownerMismatch =
    status === "authenticated" &&
    Boolean(userId) &&
    guestCart.length > 0 &&
    Boolean(guestCartOwner) &&
    guestCartOwner !== userId;

  const mergeError = ownerMismatch
    ? "This guest cart belongs to another account."
    : mergeApiError;

  const addMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
      expectedUserId,
    }: {
      productId: string;
      quantity: number;
      expectedUserId: string;
    }) => addCartItemAction({ productId, quantity }, expectedUserId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!productId || quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      if (status === "loading") {
        throw new Error("Authentication is still loading");
      }

      // Logged-in user: add directly to backend.
      if (status === "authenticated") {
        if (!userId) {
          throw new Error("User ID is missing");
        }

        await addMutation.mutateAsync({
          productId,
          quantity,
          expectedUserId: userId,
        });

        return;
      }

      // Guest user: save in localStorage.
      addGuestCartItem(productId, quantity);
    },
    [status, userId, addMutation],
  );

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;
    if (guestCart.length === 0) return;
    if (mergeLockRef.current) return;

    const attemptKey = `${userId}:${retryCount}`;

    // Prevent repeating the same attempt.
    if (mergeAttemptRef.current === attemptKey) return;

    const ownerId = getGuestCartOwner();

    // Never transfer another account's guest cart.
    if (ownerId && ownerId !== userId) return;

    mergeAttemptRef.current = attemptKey;
    mergeLockRef.current = true;

    const mergeCart = async () => {
      setIsMerging(true);
      setMergeApiError(null);

      try {
        setGuestCartOwner(userId);

        while (true) {
          const currentCart = getGuestCart();

          if (currentCart.length === 0) break;

          const item = currentCart[0];

          await addCartItemAction(
            {
              productId: item.productId,
              quantity: item.quantity,
            },
            userId,
          );

          // Remove item only after successful API response.
          removeGuestCartItem(item.productId);
        }

        clearGuestCart();
        clearGuestCartOwner();

        await queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      } catch (error) {
        console.error("Guest cart merge failed:", error);

        setMergeApiError(
          error instanceof Error ? error.message : "Failed to sync guest cart.",
        );
      } finally {
        mergeLockRef.current = false;
        setIsMerging(false);
      }
    };

    void mergeCart();
  }, [status, userId, guestCart.length, retryCount, queryClient]);

  const syncGuestCart = useCallback(() => {
    mergeAttemptRef.current = null;
    setMergeApiError(null);
    setRetryCount((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      guestCart,
      isReady,
      isMerging,
      mergeError,
      addToCart,
      syncGuestCart,
    }),
    [guestCart, isReady, isMerging, mergeError, addToCart, syncGuestCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
