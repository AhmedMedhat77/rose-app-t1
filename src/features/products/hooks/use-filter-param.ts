"use client";

import { useFilterUrl } from "./use-filter-url";

export function useFilterParam(key: string) {
  const { searchParams, update } = useFilterUrl();

  return {
    value: searchParams.get(key),
    select: (next: string) => update((p) => p.set(key, next)),
    reset: () => update((p) => p.delete(key)),
  };
}
