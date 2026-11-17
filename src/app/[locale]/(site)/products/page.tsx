import ProductsFilters from "@/features/products/components/products-filters/products-filters";
import ProductList from "@/features/products/components/products-list";
import { GetAllProductsParams } from "@/features/products/types/allProducts";

interface PropsFilters {
  searchParams: Promise<GetAllProductsParams>;
}

export default async function Products({ searchParams }: PropsFilters) {
  const filters = await searchParams;

  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex min-h-screen justify-between gap-6.25">
        <div className="w-[301px]">
          <ProductsFilters />
        </div>

        <div className="w-[954px]">
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}
