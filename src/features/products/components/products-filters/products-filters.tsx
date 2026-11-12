import CategoryFilter from "./CategoryFilters/category-filter";
import OccasionFilter from "./occasionfilter/occasion-filter";
import PriceFilter from "./price-filter";
import RatingFilter from "./rating-filter";
import ResetBtn from "./reset-btn";

export default function ProductsFilters() {
  return (
    <aside className="border-border-subtle dark:border-border-soft mt-18.5 min-h-300 w-75.25 shrink-0 border-e pe-6">
      {/*CategoryFilter*/}
      <CategoryFilter />
      {/*OccasionFilter*/}
      <OccasionFilter />
      {/*RatingFilter*/}
      <RatingFilter />
      {/*PriceFilter*/}
      <PriceFilter />
      {/*ResetBtn*/}
      <ResetBtn />
    </aside>
  );
}
