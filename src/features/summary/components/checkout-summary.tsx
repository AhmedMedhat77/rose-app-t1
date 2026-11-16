"use client";

import CartSubtotal from "@/features/cart/components/cart-subtotal";
import Summary from "@/features/summary/components/summary";

export default function CheckoutSummary() {
  return (
    <CartSubtotal>
      {({ subtotal, isCartEmpty }) => (
        <Summary subtotal={subtotal} isCartEmpty={isCartEmpty} />
      )}
    </CartSubtotal>
  );
}
