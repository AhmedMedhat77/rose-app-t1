"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { fetchPaginatedListApi } from "@/features/products/api/filter.api";
import { OCCASIONS_ENDPOINT } from "../product.endpoint";
import { IOccasionsItem } from "../../types/occasions.types";
import { FILTER_KEYS } from "../../lib/constants/filters.const";

const OCCASIONS_PAGE_SIZE = 20;

export function useOccasions() {
  return useSuspenseInfiniteQuery({
    queryKey: [FILTER_KEYS.OCCASION, OCCASIONS_PAGE_SIZE],

    queryFn: ({ pageParam, signal }) =>
      fetchPaginatedListApi<IOccasionsItem>(
        {
          page: pageParam,
          limit: OCCASIONS_PAGE_SIZE,
          endpoint: OCCASIONS_ENDPOINT,
        },
        signal,
      ),

    initialPageParam: 1,

    getNextPageParam: ({ payload: { metadata } }) =>
      metadata.page < metadata.totalPages ? metadata.page + 1 : undefined,

    select: (data) => data.pages.flatMap((page) => page.payload.data),
  });
}
