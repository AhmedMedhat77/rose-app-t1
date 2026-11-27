import type { IProductListParams } from "@/features/products/types/product";

type SearchParamValue = string | string[] | undefined;

function getFirstValue(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: SearchParamValue): number | undefined {
  const firstValue = getFirstValue(value);
  if (!firstValue?.trim()) return undefined;

  const parsedValue = Number(firstValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function parseText(value: SearchParamValue): string | undefined {
  const firstValue = getFirstValue(value);
  return firstValue?.trim() || undefined;
}

export function parseProductsSearchParams(
  params: Record<string, SearchParamValue>,
): IProductListParams {
  return {
    page: parseNumber(params.page),
    limit: parseNumber(params.limit),
    category: parseText(params.category),
    occasion: parseText(params.occasion),
    rating: parseNumber(params.rating),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
  };
}
