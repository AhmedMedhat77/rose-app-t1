"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPaginatedListApi } from "@/features/products/api/filter.api";
import { CATEGORY_ENDPOINT } from "../product.endpoint";
import { ICategoriesItem } from "../../types/categories.types";
import { FILTER_KEYS } from "../../lib/constants/filters.const";

const CATEGORIES_PAGE_SIZE = 20;

export function useCategories() {
  return useInfiniteQuery({
    queryKey: [FILTER_KEYS.CATEGORY, CATEGORIES_PAGE_SIZE],

    queryFn: ({ pageParam, signal }) =>
      fetchPaginatedListApi<ICategoriesItem>(
        {
          page: pageParam,
          limit: CATEGORIES_PAGE_SIZE,
          endpoint: CATEGORY_ENDPOINT,
        },
        signal,
      ),

    initialPageParam: 1,

    getNextPageParam: ({ payload: { metadata } }) =>
      metadata.page < metadata.totalPages ? metadata.page + 1 : undefined,

    select: (data) =>
      data.pages
        .flatMap((page) => page.payload.data)
        .sort((a, b) => a.title.localeCompare(b.title)),
  });
}
