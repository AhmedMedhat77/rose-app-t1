"use client";

import { useQuery } from "@tanstack/react-query";

import { Pagination } from "@/shared/ui/pagination";
import ProductCardSkeleton from "@/shared/components/product-card-skeleton";
import ProductCard from "@/shared/components/product-card";

import { GetAllProductsParams } from "../types/allProducts";
import { getAllProducts } from "../lib/apis/api-allProducts";

import NoItemsFound from "./not-found-items";

interface ProductListProps {
  filters: GetAllProductsParams;
}

export default function ProductList({ filters }: ProductListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
  });

  // Loading State
  if (isLoading) {
    return (
      <section className="mt-17 mb-10 w-full">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (isError) {
    return (
      <section className="mt-17 mb-10 flex min-h-80 flex-col items-center justify-center gap-4">
        <p className="text-text-primary text-lg">
          Something went wrong while loading products.
        </p>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="bg-primary rounded-md px-6 py-2 text-white disabled:opacity-50"
        >
          {isRefetching ? "Retrying..." : "Try Again"}
        </button>
      </section>
    );
  }

  const products = data?.payload.data ?? [];
  const metadata = data?.payload.metadata;

  return (
    <section className="mt-17 mb-10 flex w-238.5 flex-col justify-between">
      <div className="grid grid-cols-3 gap-4">
        {products.length > 0 ? (
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

      {metadata && (
        <div className="mt-10">
          <Pagination totalItems={metadata.total} pageSize={metadata.limit} />
        </div>
      )}
    </section>
  );
}
