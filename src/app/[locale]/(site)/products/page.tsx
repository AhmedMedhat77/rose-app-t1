import { Suspense } from "react";

import ProductsFilters from "@/features/products/components/products-filters/products-filters";
import ProductList from "@/features/products/components/products-list";
import { ProductsListSkeleton } from "@/features/products/skeletons/products-list.skeleton";
import { parseProductsSearchParams } from "@/features/products/lib/utils/products-search-params.util";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ProductsResultsProps {
  searchParams: ProductsPageProps["searchParams"];
}

async function ProductsResults({ searchParams }: ProductsResultsProps) {
  const params = await searchParams;
  return <ProductList filters={parseProductsSearchParams(params)} />;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex min-h-screen justify-between gap-6.25">
        <div className="w-75.25">
          <ProductsFilters />
        </div>

        <div className="w-238.5">
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
