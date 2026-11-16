"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ProductRow } from "@/shared/components/product-row";
import { Button } from "@/shared/ui/button";
import { WishlistViewItem } from "../lib/types/wishlist.types";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.constant";

type WishlistRowProps = {
  item: WishlistViewItem;
  onRemove: () => void;
};

export default function WishlistItem({ item, onRemove }: WishlistRowProps) {
  // Translation
  const t = useTranslations("Wishlist");

  // Variables
  const inStock = item.stock > 0;

  return (
    <ProductRow className="px-0">
      <ProductRow.Image src={item.cover} alt={item.title} dimmed={!inStock} />

      <ProductRow.Content>
        <ProductRow.Header>
          <ProductRow.Info>
            <ProductRow.StockStatus inStock={inStock} />
            <ProductRow.Title className="text-xl text-zinc-800">
              {item.title}
            </ProductRow.Title>
            <ProductRow.Rating
              rating={item.rating}
              ratings={item.ratings}
              variant="badge"
            />
          </ProductRow.Info>

          <ProductRow.RemoveButton
            iconOnly
            className="h-12 w-13 bg-red-50 text-red-500 hover:bg-red-100"
            label={t("remove")}
            onClick={onRemove}
          />
        </ProductRow.Header>

        <ProductRow.Footer>
          <ProductRow.Price
            price={item.price}
            discountType={item.discountType}
            discountValue={item.discountValue}
            showOriginal
          />

          {inStock ? (
            <Button>
              <ShoppingCart aria-hidden="true" />
              {t("addToCart")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/products",
                    query: { [FILTER_KEYS.CATEGORY]: item.categoryName },
                  }}
                />
              }
            >
              {t("exploreSimilar")}
            </Button>
          )}
        </ProductRow.Footer>
      </ProductRow.Content>
    </ProductRow>
  );
}
