"use client";

import { CATEGORY_ENDPOINT } from "../lib/apis/product.endpoint";
import { FILTER_KEYS } from "../lib/constants/filters.constant";
import type { ICategoriesItem } from "../types/categories.types";
import { useInfiniteFilterQuery } from "./use-infinite-filter-query";

const CATEGORIES_PAGE_SIZE = 20;

export function useCategories() {
  return useInfiniteFilterQuery<ICategoriesItem>({
    queryKey: [FILTER_KEYS.CATEGORY, CATEGORIES_PAGE_SIZE],
    endpoint: CATEGORY_ENDPOINT,
    pageSize: CATEGORIES_PAGE_SIZE,
  });
}
