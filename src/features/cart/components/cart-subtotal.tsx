"use client";

import type { ReactNode } from "react";

import { useCart } from "@/features/cart/hooks/use-cart";
import { mapCartItems } from "@/features/cart/utils/cart-mapper";
import { getCartSubtotal } from "@/features/cart/utils/cart-subtotal.util";

interface CartSubtotalProps {
  children: (totals: { subtotal: number; isCartEmpty: boolean }) => ReactNode;
}

export default function CartSubtotal({ children }: CartSubtotalProps) {
  // Query
  const { data: cartData } = useCart();

  // Variables
  const cartItems = cartData?.cartItems ?? [];
  const subtotal = getCartSubtotal(mapCartItems(cartItems));
  const isCartEmpty = cartItems.length === 0;

  return children({ subtotal, isCartEmpty });
}
