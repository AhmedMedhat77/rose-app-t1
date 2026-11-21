import { Badge } from "@/shared/ui/badge";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductStockBadgeProps {
  stock: number;
}

export function ProductStockBadge({ stock }: ProductStockBadgeProps) {
  const t = useTranslations("Product");
  const inStock = stock > 0;

  return (
    <Badge variant={inStock ? "subtle" : "secondary"} className={`gap-2 py-3`}>
      <Package className="size-4" />
      <span className="font-semibold">
        {inStock ? t("stockLeft", { count: stock }) : t("outOfStock")}
      </span>
    </Badge>
  );
}
