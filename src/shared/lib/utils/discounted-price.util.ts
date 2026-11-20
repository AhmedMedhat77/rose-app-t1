interface DiscountedProduct {
  price: number | string;
  discountType?: string | null;
  discountValue?: number | string | null;
}

export function getDiscountedPrice(product: DiscountedProduct): number {
  const price = Number(product.price);
  const discount = Number(product.discountValue ?? 0);
  if (!Number.isFinite(discount) || discount <= 0) return price;
  if (product.discountType === "PERCENT") {
    return Math.max(0, price * (1 - discount / 100));
  }
  if (product.discountType === "FIXED") return Math.max(0, price - discount);
  return price;
}
