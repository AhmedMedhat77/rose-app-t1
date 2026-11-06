"use client";

import { useTranslations } from "next-intl";
import { Suspense, type ReactNode } from "react";

import FetchFeedback from "@/shared/components/fetch-feedback";
import ErrorBoundary from "./error-boundry";

interface FilterBoundaryProps {
  skeleton: ReactNode;
  children: ReactNode;
}

export function FilterBoundary({ skeleton, children }: FilterBoundaryProps) {
  const t = useTranslations();

  return (
    <ErrorBoundary
      fallback={(error, resetErrorBoundary) => (
        <FetchFeedback>
          {error.message}
          <button type="button" onClick={resetErrorBoundary}>
            {t("filters-retry")}
          </button>
        </FetchFeedback>
      )}
    >
      <Suspense fallback={skeleton}>{children}</Suspense>
    </ErrorBoundary>
  );
}
