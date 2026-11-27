import { getLocale, getTranslations } from "next-intl/server";

import ProductCard from "@/shared/components/product-card-copy";
import { getProducts } from "@/shared/lib/apis/products.api";
import { IProduct } from "@/features/products/types/product";

type Props = {
  occasionId: string;
};

export default async function MostPopularProducts({ occasionId }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("MostPopular");

  const query = new URLSearchParams({
    sortBy: "mostPopular",
    occasionId,
    limit: "12",
  }).toString();

  const products: IProduct[] = await getProducts(query);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full min-w-0">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {products.length === 0 && <p>{t("noProducts")}</p>}
      </div>
    </div>
  );
}
