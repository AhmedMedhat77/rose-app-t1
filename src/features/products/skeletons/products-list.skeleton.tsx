import ProductCardSkeleton from "@/shared/components/product-card-skeleton";

export function ProductsListSkeleton() {
  return (
    <section className="mt-17 mb-10 w-full">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
