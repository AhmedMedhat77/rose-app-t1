"use client";

import CartSide from "@/features/cart/components/cart-side";
import CartSubtotal from "@/features/cart/components/cart-subtotal";
import Summary from "@/features/summary/components/summary";

export default function CartSection() {
  return (
    <>
      <div className="flex-2">
        <CartSide />
      </div>
      <CartSubtotal>
        {({ subtotal, isCartEmpty }) => (
          <Summary subtotal={subtotal} isCartEmpty={isCartEmpty} />
        )}
      </CartSubtotal>
    </>
  );
}
