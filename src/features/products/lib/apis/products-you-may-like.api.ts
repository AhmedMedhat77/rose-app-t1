import { getProducts } from "@/shared/lib/apis/products.api";

const TOP_RATED_LIMIT = 8;

export function getProductsYouMayLike() {
  const searchParams = new URLSearchParams({
    page: "1",
    limit: String(TOP_RATED_LIMIT),
    sortBy: "rating",
    sortOrder: "desc",
  });

  return getProducts(`/products?${searchParams.toString()}`);
}
