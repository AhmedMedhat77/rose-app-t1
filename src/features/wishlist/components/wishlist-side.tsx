"use client";

import { FolderHeart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ProductCollection } from "@/shared/components/product-collection";

import { useClearWishlist } from "../hooks/use-clear-wishlist";
import { useGuestWishlistProducts } from "../hooks/use-guest-wishlist-products";
import { useRemoveWishlistItem } from "../hooks/use-remove-wishlist-item";
import { useWishlist } from "../hooks/use-wishlist";
import ClearWishlistDialog from "./clear-wishlist-dialog";
import WishlistRow from "./wishlist-item";
import {
  mapGuestWishlistProducts,
  mapWishlistItems,
} from "../lib/utils/wishlist-mapper";
import {
  clearGuestWishlist,
  removeGuestWishlistItems,
} from "../lib/utils/guest-wishlist-storage";
import { WishlistViewItem } from "../lib/types/wishlist.types";

export default function WishlistSide() {
  // Translation
  const t = useTranslations("Wishlist");

  // State
  const { status } = useSession();
  const isGuest = status === "unauthenticated";
  const user = useWishlist();
  const guest = useGuestWishlistProducts(isGuest);
  const removeItem = useRemoveWishlistItem();
  const clearWishlist = useClearWishlist();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  // Variables
  const items = isGuest
    ? mapGuestWishlistProducts(guest.products)
    : mapWishlistItems(user.items);
  const isLoading = isGuest ? guest.isLoading : user.isLoading;
  const isError = isGuest ? guest.isError : user.isError;

  // Handlers
  const handleRemove = (item: WishlistViewItem) => {
    if (isGuest) removeGuestWishlistItems([item.productId]);
    else removeItem.mutate(item.id);
  };

  const handleConfirmClear = () => {
    if (isGuest) clearGuestWishlist();
    else clearWishlist.mutate();
    setIsClearDialogOpen(false);
  };

  if (isLoading) return <p>{t("loading")}</p>;

  if (isError) {
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
          <ProductCollection.Title className="flex items-center gap-2.5">
            <FolderHeart aria-hidden="true" className="size-12 shrink-0" />
            {t("title")}
          </ProductCollection.Title>
          <ProductCollection.Count>
            {t("count", { count: items.length })}
          </ProductCollection.Count>
        </ProductCollection.Heading>

        <ProductCollection.ClearButton
          variant="destructive"
          label={t("clear")}
          pendingLabel={t("clearing")}
          isPending={clearWishlist.isPending}
          disabled={items.length === 0}
          onClick={() => setIsClearDialogOpen(true)}
        />
      </ProductCollection.Header>

      <ProductCollection.Body>
        {items.length === 0 ? (
          <ProductCollection.Empty>{t("empty")}</ProductCollection.Empty>
        ) : (
          <ProductCollection.List>
            {items.map((item) => (
              <WishlistRow
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </ProductCollection.List>
        )}
      </ProductCollection.Body>

      <ProductCollection.ContinueShopping href="/products">
        {t("continueShopping")}
      </ProductCollection.ContinueShopping>

      <ClearWishlistDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onConfirm={handleConfirmClear}
      />
    </ProductCollection>
  );
}
