type TDiscountInput = {
  price: number;
  discountType?: string | null;
  discountValue?: number | null;
};

const round = (value: number) => Math.round(value * 100) / 100;

export function getDiscountedPrice({
  price,
  discountType,
  discountValue,
}: TDiscountInput) {
  if (!discountType || !discountValue || discountValue <= 0) return price;

  if (discountType === "PERCENT") {
    return round(price * (1 - Math.min(discountValue, 100) / 100));
  }
  if (discountType === "FIXED") {
    return round(Math.max(0, price - discountValue));
  }

  return price;
}
