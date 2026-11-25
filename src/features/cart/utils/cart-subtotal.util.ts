import { getDiscountedPrice } from "@/shared/lib/utils/price";

import type { ICartViewItem } from "../types/cart.types";

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function getCartSubtotal(items: ICartViewItem[]) {
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = getDiscountedPrice({
      price: item.price,
      discountType: item.discountType,
      discountValue: item.discountValue,
    });

    return sum + unitPrice * item.quantity;
  }, 0);

  return roundMoney(subtotal);
}
