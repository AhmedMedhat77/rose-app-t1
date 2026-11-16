"use client";

import type { ReactNode } from "react";

import { useCart } from "@/features/cart/hooks/use-cart";
import { mapCartItems } from "@/features/cart/utils/cart-mapper";
import { getCartSubtotal } from "@/features/cart/utils/cart-subtotal.util";

export default function CartSubtotal({
  children,
}: {
  children: (subtotal: number) => ReactNode;
}) {
  // Query
  const { data: cartData } = useCart();

  // Variables
  const subtotal = getCartSubtotal(mapCartItems(cartData?.cartItems ?? []));

  return children(subtotal);
}
