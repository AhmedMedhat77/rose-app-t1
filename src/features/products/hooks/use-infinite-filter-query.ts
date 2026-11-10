"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPaginatedListApi } from "../lib/apis/filter.api";

interface UseInfiniteFilterQueryParams {
  queryKey: readonly unknown[];
  endpoint: string;
  pageSize: number;
}

export function useInfiniteFilterQuery<T extends { title: string }>({
  queryKey,
  endpoint,
  pageSize,
}: UseInfiniteFilterQueryParams) {
  // Query
  return useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam, signal }) =>
      fetchPaginatedListApi<T>(
        {
          page: pageParam,
          limit: pageSize,
          endpoint,
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
