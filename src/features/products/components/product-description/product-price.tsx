import { useLocale, useTranslations } from "next-intl";

interface ProductPriceProps {
  price: number;
  oldPrice: number | null;
}

export function ProductPrice({ price, oldPrice }: ProductPriceProps) {
  const t = useTranslations("Product");
  const locale = useLocale();

  const format = (amount: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="font-primary flex items-baseline gap-2">
      {oldPrice !== null && (
        <span className="text-text-muted text-2xl font-bold line-through">
          {format(oldPrice)}
        </span>
      )}
      <span className="text-text-plain text-3xl font-bold">
        {format(price)}
      </span>
      <span className="text-text-plain text-lg">{t("currency")}</span>
    </div>
  );
}
