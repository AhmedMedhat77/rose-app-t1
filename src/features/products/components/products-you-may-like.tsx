import { getTranslations } from "next-intl/server";
import { getProducts } from "@/shared/lib/apis/products.api";
import ProductsCarousel from "@/shared/components/products-carousel";

const TOP_RATED_LIMIT = 8;
const TOP_RATED_QUERY = new URLSearchParams({
  page: "1",
  limit: String(TOP_RATED_LIMIT),
  sortBy: "rating",
  sortOrder: "desc",
}).toString();

export default async function ProductsYouMayLike() {
  const t = await getTranslations("Cart");

  return (
    <ProductsCarousel
      title={t("productYouMayLike")}
      productsList={getProducts(TOP_RATED_QUERY)}
    />
  );
}
