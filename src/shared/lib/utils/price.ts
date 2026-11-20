type TDiscountInput = {
  price: number;
  discountType?: string | null;
  discountValue?: number | null;
};

const round = (value: number) => Math.round(value * 100) / 100;

export function getDiscount({
  price,
  discountType,
  discountValue,
}: TDiscountInput) {
  if (!discountType || !discountValue || discountValue <= 0) return 0;

  if (discountType === "PERCENT") {
    return round(price * (Math.min(discountValue, 100) / 100));
  }
  if (discountType === "FIXED") {
    return round(Math.min(price, discountValue));
  }

  return 0;
}

export function getDiscountedPrice(input: TDiscountInput) {
  const discount = getDiscount(input);
  if (discount <= 0) return input.price;

  return round(input.price - discount);
}
