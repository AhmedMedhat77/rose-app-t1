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
  // Translation
  const t = useTranslations("Cart");

  // Variables
  const isOutOfStock = item.stock === 0;

  return (
    <ProductRow>
      <ProductRow.Image
        src={item.cover}
        alt={item.title}
        dimmed={isOutOfStock}
      />

      <ProductRow.Content>
        <ProductRow.Header>
          <ProductRow.Info>
            <ProductRow.Title>{item.title}</ProductRow.Title>

            <ProductRow.Rating
              rating={Number(item.rating.toFixed(2))}
              ratings={item.ratings}
            />

            {isOutOfStock && <ProductRow.StockStatus inStock={false} />}
          </ProductRow.Info>

          <ProductRow.RemoveButton
            label={t("remove")}
            onClick={onRemove}
            disabled={isRemoving}
          />
        </ProductRow.Header>

        <ProductRow.Footer>
          <ProductRow.Price
            price={item.price}
            discountType={item.discountType}
            discountValue={item.discountValue}
            quantity={item.quantity}
          />

          <QuantityStepper
            value={item.quantity}
            max={item.stock}
            disabled={isUpdating || isOutOfStock}
            onChange={onUpdateQuantity}
          />
        </ProductRow.Footer>
      </ProductRow.Content>
    </ProductRow>
  );
}
