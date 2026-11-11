import BestSellingRose from "@/features/bestSelling/components/BestSellingRose";
import Companies from "@/features/companies/Companies";
import Gallery from "@/features/gallery/components/Gallery";
import MostPopular from "@/features/mostPopular/components/MostPopular";
import getMostPopularProducts from "@/features/mostPopular/lib/api-mostproduct";
import getAllOccasions from "@/features/mostPopular/lib/api-occasions";
import Testimonials from "@/features/testimonials/components/Testimonials";

export default async function HomePage() {
  // 1. Fetch occasions
  const occasions = await getAllOccasions();

  // 2. Get the first occasion
  const firstOccasion = occasions[0];

  // 3. Fetch the first occasion's products
  const initialOccasionId = firstOccasion?.id ?? "";
  const initialProducts = await getMostPopularProducts(initialOccasionId);

  return (
    <div>
      <div className="mx-auto w-[80rem]">
        <BestSellingRose />

        <MostPopular
          occasions={occasions}
          initialProducts={initialProducts}
          initialOccasionId={initialOccasionId}
        />

        <Gallery />
      </div>

      <Testimonials />

      <div className="mx-auto w-[80rem]">
        <Companies />
      </div>
    </div>
  );
}
