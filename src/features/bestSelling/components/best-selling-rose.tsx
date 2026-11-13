import BestSellingExploreGift from "./best-selling-explore-gift";
import BestSellingSoldCarussel from "./best-selling-carousel";

export default async function BestSellingRose() {
  return (
    <div className="container mt-15 flex justify-between gap-10 align-middle">
      <BestSellingExploreGift />

      <BestSellingSoldCarussel />
    </div>
  );
}
