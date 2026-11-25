"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useGuestWishlist } from "./use-guest-wishlist";
import { WISHLIST_QUERY_KEY } from "../lib/constants/wishlist-constants";
import {
  clearGuestWishlistOwner,
  getGuestWishlistOwner,
  getGuestWishlistSnapshot,
  removeGuestWishlistItems,
  setGuestWishlistOwner,
} from "../lib/utils/guest-wishlist-storage";
import { addToWishlistAction } from "../lib/actions/wishlist.actions";

const FINAL_STATUSES = new Set([400, 404, 409]);

export function useMergeGuestWishlist() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { ids } = useGuestWishlist();
  const userId = session?.user?.id;

  const isMergingRef = useRef(false);
  const lastAttemptRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      queryClient.removeQueries({ queryKey: WISHLIST_QUERY_KEY, exact: true });
    }
  }, [status, queryClient]);

  useEffect(() => {
    if (status !== "authenticated" || !userId || ids.length === 0) return;
    if (isMergingRef.current) return;

    const attemptKey = `${userId}|${ids.join(",")}`;
    if (lastAttemptRef.current === attemptKey) return;
    lastAttemptRef.current = attemptKey;

    const owner = getGuestWishlistOwner();
    if (owner && owner !== userId) return;

    const idsToMerge = [...ids];

    const merge = async () => {
      isMergingRef.current = true;
      setGuestWishlistOwner(userId);

      try {
        for (const productId of idsToMerge) {
          const result = await addToWishlistAction(productId);

          if (result.ok || FINAL_STATUSES.has(result.status)) {
            removeGuestWishlistItems([productId]);
          } else if (result.status === 401) {
            break;
          }
        }
      } finally {
        isMergingRef.current = false;
      }

      if (getGuestWishlistSnapshot().length === 0) clearGuestWishlistOwner();
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    };

    void merge();
  }, [status, userId, ids, queryClient]);
}
