import { useInfiniteQuery } from "@tanstack/react-query";
import { gatReviewsApi } from "../lib/apis/products.api";

const REVIEWS_PAGE_SIZE = 10;

export function useInfiniteReviewsQuery(productId: string) {
  return useInfiniteQuery({
    queryKey: ["reviews", productId, REVIEWS_PAGE_SIZE],

    queryFn: ({ pageParam, signal }) =>
      gatReviewsApi(
        { productId, page: pageParam, limit: REVIEWS_PAGE_SIZE },
        signal,
      ),

    initialPageParam: 1,

    getNextPageParam: ({ payload: { metadata } }) =>
      metadata.page < metadata.totalPages ? metadata.page + 1 : undefined,
  });
}
