"use client";

import { useSearchParams } from "next/navigation"; // not locale-specific

import { usePathname, useRouter } from "@/i18n/navigation"; // locale-specific

interface UseFilterParamResult {
  value: string | null;
  select: (value: string) => void;
  reset: () => void;
}

export function useFilterParam(key: string): UseFilterParamResult {
  // Navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Variables
  const value = searchParams.get(key);

  // Functions
  function updateParam(next: string | null): void {
    const params = new URLSearchParams(searchParams.toString());

    if (next === null) params.delete(key);
    else params.set(key, next);

    router.replace(params.size ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  }

  return {
    value,
    select: (next) => updateParam(next),
    reset: () => updateParam(null),
  };
}
