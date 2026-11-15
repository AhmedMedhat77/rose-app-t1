"use client";

import { Component, type ReactNode } from "react";
import { useTranslations } from "next-intl";

function ProductsCarouselErrorMessage() {
  const t = useTranslations("ProductsCarousel");
  return <p>{t("error")}</p>;
}

export class ProductsCarouselErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <ProductsCarouselErrorMessage />;
    return this.props.children;
  }
}
