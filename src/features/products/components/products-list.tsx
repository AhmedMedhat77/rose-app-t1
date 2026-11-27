import { Pagination } from "@/shared/ui/pagination";
import ProductCard from "@/shared/components/product-card-copy";
import { getProductsPage } from "@/shared/lib/apis/products.api";
import type { IProductListParams } from "../types/product";

import NoItemsFound from "./not-found-items";

interface ProductListProps {
  filters: IProductListParams;
}

export default async function ProductList({ filters }: ProductListProps) {
  const { data: products, metadata } = await getProductsPage(filters, {
    next: { revalidate: 300 },
  });

  return (
    <section className="mt-17 mb-10 flex w-238.5 flex-col justify-between">
      <div className="grid grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <NoItemsFound />
        )}
      </div>

      <div className="mt-10">
        <Pagination totalItems={metadata.total} pageSize={metadata.limit} />
      </div>
    </section>
  );
}
