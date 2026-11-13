"use client";

import { OCCASIONS_ENDPOINT } from "../lib/apis/product.endpoint";
import { FILTER_KEYS } from "../lib/constants/filters.constant";
import type { IOccasionsItem } from "../types/occasions.types";
import { useInfiniteFilterQuery } from "./use-infinite-filter-query";

const OCCASIONS_PAGE_SIZE = 20;

export function useOccasions() {
  return useInfiniteFilterQuery<IOccasionsItem>({
    queryKey: [FILTER_KEYS.OCCASION, OCCASIONS_PAGE_SIZE],
    endpoint: OCCASIONS_ENDPOINT,
    pageSize: OCCASIONS_PAGE_SIZE,
  });
}
