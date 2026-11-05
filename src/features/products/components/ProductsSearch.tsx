import { SearchBar } from "@/features/search/components/searchBar";
import { getProducts } from "../apis/get-products";

export async function ProductsSearch() {
  const products = await getProducts();
  return <SearchBar products={products} />;
}
