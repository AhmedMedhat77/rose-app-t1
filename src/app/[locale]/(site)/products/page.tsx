import ProductsFilters from "@/features/products/components/products-filters/products-filters";
import ProductList from "@/features/products/components/products-list";

export default function Products() {
  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex min-h-screen justify-between gap-6.25">
        <ProductsFilters />
        <ProductList />
      </div>
    </div>
  );
}
