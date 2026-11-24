import { getLocale, getTranslations } from "next-intl/server";

import ProductCard from "@/shared/components/product-card";
import getMostPopularProducts from "../lib/api-mostproduct";

type Props = {
  occasionId: string;
};

export default async function MostPopularProducts({ occasionId }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("MostPopular");

  const products = occasionId ? await getMostPopularProducts(occasionId) : [];

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full min-w-0">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="mostPopular"
          />
        ))}

        {products.length === 0 && <p>{t("noProducts")}</p>}
      </div>
    </div>
  );
}
