import CategoryFilter from "./category-filter";
import OccasionFilter from "./occasion-filter";

export default function ProductsFilters() {
  return (
    <aside className="border-border-subtle mt-18.5 max-h-386.5 w-75.25 shrink-0 border-e pe-6">
      {/*CategoryFilter*/}
      <CategoryFilter />
      {/*OccasionFilter*/}
      <OccasionFilter />
    </aside>
  );
}
