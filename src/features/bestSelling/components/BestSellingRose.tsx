import BestSellingExploreGift from "./BestSellingExploreGift";
import BestSellingSoldCarussel from "./BestSellingSoldCarussel";

export default async function BestSellingRose() {
  return (
    <div className="mt-15 flex justify-between gap-10 align-middle">
      <BestSellingExploreGift />

      <BestSellingSoldCarussel />
    </div>
  );
}
