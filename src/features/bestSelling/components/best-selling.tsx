import BestSellingExploreGift from "./best-selling-explore-gift";
import { getProducts } from "@/shared/lib/apis/products.api";
import ProductsCarousel from "@/shared/components/products-carousel";

export default async function BestSelling() {
  return (
    <div className="container mt-15 flex justify-between gap-10 align-middle">
      <BestSellingExploreGift />

      <div className="relative w-full min-w-0">
        <ProductsCarousel productsList={getProducts("sortBy=bestSelling")} />
      </div>
    </div>
  );
}
