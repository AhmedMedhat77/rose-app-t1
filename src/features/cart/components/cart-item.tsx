"use client";

import { useTranslations } from "next-intl";

import type { ICartViewItem } from "../types/cart.types";
import QuantityStepper from "./quantity-stepper";
import { ProductRow } from "@/shared/components/product-row";

interface ICartItemProps {
  item: ICartViewItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: ICartItemProps) {
  const t = useTranslations("Cart");

  const isOutOfStock = item.stock === 0;

  return (
    <ProductRow>
      <ProductRow.Image
        src={item.cover}
        alt={item.title}
        dimmed={isOutOfStock}
      />

      <ProductRow.Content>
        <ProductRow.Header className="items-start">
          <ProductRow.Info className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <ProductRow.Title>{item.title}</ProductRow.Title>

              {/* Mobile: Icon only */}
              <div className="sm:hidden">
                <ProductRow.RemoveButton
                  label={t("remove")}
                  iconOnly
                  onClick={onRemove}
                  disabled={isRemoving}
                  className="size-10 shrink-0"
                />
              </div>

              {/* Desktop: Icon + Text */}
              <div className="hidden sm:block">
                <ProductRow.RemoveButton
                  label={t("remove")}
                  onClick={onRemove}
                  disabled={isRemoving}
                />
              </div>
            </div>

            <ProductRow.Rating
              rating={Number(item.rating.toFixed(2))}
              ratings={item.ratings}
            />

            {isOutOfStock && <ProductRow.StockStatus inStock={false} />}
          </ProductRow.Info>
        </ProductRow.Header>

        <ProductRow.Footer className="flex-col items-start justify-between sm:flex-row sm:items-end">
          <div className="flex w-full flex-col items-start gap-3">
            <ProductRow.Price
              price={item.price}
              discountType={item.discountType}
              discountValue={item.discountValue}
              quantity={item.quantity}
            />

            {/* Mobile Quantity */}
            <div className="flex w-full items-center justify-end gap-2 pt-5 sm:hidden">
              <QuantityStepper
                value={item.quantity}
                max={item.stock}
                disabled={isUpdating || isOutOfStock}
                onChange={onUpdateQuantity}
              />
            </div>
          </div>

          {/* Desktop Quantity */}
          <div className="hidden sm:block">
            <QuantityStepper
              value={item.quantity}
              max={item.stock}
              disabled={isUpdating || isOutOfStock}
              onChange={onUpdateQuantity}
            />
          </div>
        </ProductRow.Footer>
      </ProductRow.Content>
    </ProductRow>
  );
}
