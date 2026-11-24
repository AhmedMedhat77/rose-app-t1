type TDiscountInput = {
  price: number | string;
  discountType?: string | null;
  discountValue?: number | string | null;
};

const round = (value: number) => Math.round(value * 100) / 100;

export function getDiscount({
  price: originalPrice,
  discountType,
  discountValue: originalDiscountValue,
}: TDiscountInput) {
  const discountValue = Number(originalDiscountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) return 0;

  const price = Number(originalPrice);
  if (discountType === "PERCENT") {
    return round(price * (Math.min(discountValue, 100) / 100));
  }
  if (discountType === "FIXED") {
    return round(Math.min(price, discountValue));
  }

  return 0;
}

export function getDiscountedPrice(input: TDiscountInput) {
  const price = Number(input.price);
  const discount = getDiscount(input);
  if (discount <= 0) return price;

  return round(price - discount);
}
