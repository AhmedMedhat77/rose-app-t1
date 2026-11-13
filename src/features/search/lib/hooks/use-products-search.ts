import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../apis/search-products";

export function useProductsSearch(debouncedQuery: string, enabled: boolean) {
  const q = debouncedQuery.trim();

  return useQuery({
    queryKey: ["products", "search", q],
    queryFn: () => searchProducts(q),
    enabled,
  });
}
