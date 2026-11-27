import { Suspense } from "react";

import ProductsFilters from "@/features/products/components/products-filters/products-filters";
import ProductList from "@/features/products/components/products-list";
import { ProductsListSkeleton } from "@/features/products/skeletons/products-list.skeleton";
import type { IProductListParams } from "@/features/products/types/product";

type SearchParamValue = string | string[] | undefined;

interface ProductsPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const filters: IProductListParams = {
    page: parseNumber(params.page),
    limit: parseNumber(params.limit),
    category: parseText(params.category),
    occasion: parseText(params.occasion),
    rating: parseNumber(params.rating),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
  };

  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex min-h-screen justify-between gap-6.25">
        <div className="w-75.25">
          <ProductsFilters />
        </div>

        <div className="w-238.5">
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductList filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
