"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "cn";
import { usePathname, useRouter } from "@/i18n/navigation";

const DEFAULT_PAGE_SIZE = 10;

type PageToken = number | "ellipsis";

export type PaginationChange = {
  page: number;
  limit: number;
  signal: AbortSignal;
};

function parsePositiveInt(value: string | null): number | null {
  if (value == null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return null;
  return parsed;
}

function resolvePageSize(pageSize: number): number {
  if (!Number.isInteger(pageSize) || pageSize < 1) return DEFAULT_PAGE_SIZE;
  return pageSize;
}

/**
 * Page numbers and ellipses between the first/previous and next/last controls.
 *
 * Always 7 slots once there are more than 7 pages. The earlier window used 5
 * slots at the ends (`1 2 3 … 10`) and 7 in the middle (`1 … 4 5 6 … 10`), so
 * the bar grew by two buttons and every control shifted while paging.
 * The ends now show the same seven slots as the middle: five numbers plus an
 * ellipsis and the opposite boundary page.
 */
function getPageItems(current: number, total: number): PageToken[] {
  if (total <= 0) return [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

/** Arabic uses Indian digits (٠١٢٣); English keeps Western digits. */
function formatPageNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    numberingSystem: locale === "ar" ? "arab" : "latn",
    useGrouping: false,
  }).format(value);
}

function readQuery(searchParams: URLSearchParams): Record<string, string> {
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key === "page" || key === "limit") return;
    query[key] = value;
  });
  return query;
}

/**
 * Page controls for a list. The current page and page size come from the
 * `page` and `limit` query params. Choosing a page writes both back to the URL.
 *
 * The last page is `ceil(totalItems / limit)`. A `limit` already in the URL
 * wins over `pageSize`.
 *
 * @param totalItems Number of items in the full list.
 * @param pageSize Items per page when `limit` is absent. Defaults to 10. Values below 1 fall back to 10.
 * @param onChange Called when the page or limit changes. `signal` aborts when that page is left.
 * @param className Classes added to the navigation element.
 */
function Pagination({
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  onChange,
  className,
}: {
  totalItems: number;
  pageSize?: number;
  onChange?: (state: PaginationChange) => void;
  className?: string;
}) {
  const t = useTranslations("pagination");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const parsedPage = parsePositiveInt(pageParam);
  const parsedLimit = parsePositiveInt(limitParam);
  const limit = parsedLimit ?? resolvePageSize(pageSize);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;
  const page = totalPages === 0 ? 1 : Math.min(parsedPage ?? 1, totalPages);
  const items = getPageItems(page, totalPages);
  const isStart = totalPages === 0 || page <= 1;
  const isEnd = totalPages === 0 || page >= totalPages;

  React.useEffect(() => {
    const pageIsInvalid = pageParam != null && pageParam !== String(page);
    const limitIsInvalid = limitParam != null && parsedLimit == null;
    if (!pageIsInvalid && !limitIsInvalid) return;

    const query = readQuery(searchParams);
    if (pageParam != null) query.page = String(page);
    if (parsedLimit != null) query.limit = String(parsedLimit);
    router.replace({ pathname, query });
  }, [
    limitParam,
    page,
    pageParam,
    parsedLimit,
    pathname,
    router,
    searchParams,
  ]);

  React.useEffect(() => {
    const controller = new AbortController();
    onChangeRef.current?.({ page, limit, signal: controller.signal });
    return () => controller.abort();
  }, [page, limit]);

  function goTo(nextPage: number) {
    if (
      totalPages === 0 ||
      nextPage === page ||
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    const query = readQuery(searchParams);
    query.page = String(nextPage);
    query.limit = String(limit);
    router.push({ pathname, query });
  }

  return (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      role="navigation"
      aria-label={t("label")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex items-center gap-2">
        {/* Point outward along the reading direction. In Arabic the row is RTL, so first/previous point right and next/last point left. */}
        <li>
          <PaginationControl
            label={t("first")}
            disabled={isStart}
            onClick={() => goTo(1)}
          >
            {isRtl ? (
              <ChevronsRight aria-hidden="true" className="size-4" />
            ) : (
              <ChevronsLeft aria-hidden="true" className="size-4" />
            )}
          </PaginationControl>
        </li>
        <li>
          <PaginationControl
            label={t("previous")}
            disabled={isStart}
            onClick={() => goTo(page - 1)}
          >
            {isRtl ? (
              <ChevronRight aria-hidden="true" className="size-4" />
            ) : (
              <ChevronLeft aria-hidden="true" className="size-4" />
            )}
          </PaginationControl>
        </li>
        {items.map((item, index) => (
          <li key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <span
                aria-hidden
                data-slot="pagination-ellipsis"
                className={controlClassName()}
              >
                ...
              </span>
            ) : (
              <PaginationControl
                label={t("page", { page: formatPageNumber(item, locale) })}
                active={item === page}
                onClick={() => goTo(item)}
              >
                {formatPageNumber(item, locale)}
              </PaginationControl>
            )}
          </li>
        ))}
        <li>
          <PaginationControl
            label={t("next")}
            disabled={isEnd}
            onClick={() => goTo(page + 1)}
          >
            {isRtl ? (
              <ChevronLeft aria-hidden="true" className="size-4" />
            ) : (
              <ChevronRight aria-hidden="true" className="size-4" />
            )}
          </PaginationControl>
        </li>
        <li>
          <PaginationControl
            label={t("last")}
            disabled={isEnd}
            onClick={() => goTo(totalPages)}
          >
            {isRtl ? (
              <ChevronsLeft aria-hidden="true" className="size-4" />
            ) : (
              <ChevronsRight aria-hidden="true" className="size-4" />
            )}
          </PaginationControl>
        </li>
      </ul>
    </nav>
  );
}

function controlClassName(active = false) {
  return cn(
    // No color transition: when the window shifts, the old page number moves
    // into a new slot and would stay primary for a moment while the color faded, and it's un-needed behavior.
    "inline-flex size-8 items-center justify-center rounded-lg border text-sm leading-none font-semibold outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring-default",
    "disabled:pointer-events-none disabled:text-text-muted",
    active
      ? "border-transparent bg-bg-primary text-text-inverse hover:bg-bg-primary-saturated"
      : "border-border-muted bg-bg-plain text-text-plain hover:bg-bg-muted",
  );
}

function PaginationControl({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      data-slot="pagination-control"
      className={controlClassName(active)}
    >
      {children}
    </button>
  );
}

export { Pagination };
