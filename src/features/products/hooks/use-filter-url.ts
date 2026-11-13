"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { PAGE_KEY } from "../lib/constants/filters.constant";

export function useFilterUrl() {
  // Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Hooks
  const searchParams = useSearchParams();

  // Functions (handles filter URL updates and resets pagination to page 1.)
  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());

      mutate(params);

      params.delete(PAGE_KEY); // any filter change -> back to page 1

      const qs = params.toString();

      router.replace(qs ? `${pathname}?${qs}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  return { searchParams, update };
}
