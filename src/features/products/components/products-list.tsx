"use client";

import { Pagination } from "@/shared/ui/pagination";
import { GetAllProductsParams } from "../types/allProducts";
import { getAllProducts } from "../lib/apis/api-allProducts";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/app/[locale]/not-found";
import NoItemsFound from "./not-found-items";
import { Skeleton } from "@/shared/ui/skeleton";
import ProductCardSkeleton from "@/shared/components/product-card-skeleton";
import ProductCard from "@/shared/components/product-card";

interface ProductListProps {
  filters: GetAllProductsParams;
}

export default function ProductList({ filters }: ProductListProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
  });

  if (isLoading) return <Skeleton />;

  if (isError) return <NotFound />;

  const products = data?.payload.data ?? [];
  const metadata = data?.payload.metadata;

  return (
    <section className="mt-17 mb-10 flex w-238.5 flex-col justify-between">
      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: products.length }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="displayAllProduct"
            />
          ))
        ) : (
          <NoItemsFound />
        )}
      </div>

      {!isLoading && (
        <div className="mt-10">
          <Pagination
            totalItems={metadata?.total ?? 0}
            pageSize={metadata?.limit ?? 0}
          />
        </div>
      )}
    </section>
  );
}
