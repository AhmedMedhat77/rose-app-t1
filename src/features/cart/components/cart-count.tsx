"use client";

import { Badge } from "@/shared/ui/badge";
import { useCartContext } from "../context/cart-provider";

export default function CartCount() {
  const { cartLength } = useCartContext();

  if (cartLength <= 0) return null;

  return (
    <Badge className="bg-bg-danger dark:bg-bg-danger text-text-inverse dark:text-secondary-foreground absolute inset-e-0 -top-1 flex size-3.5 items-center justify-center rounded-full">
      {cartLength > 99 ? "99+" : cartLength}
    </Badge>
  );
}
