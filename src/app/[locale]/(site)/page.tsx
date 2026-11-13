import { FeaturesStrip } from "@/features/home/components/hero-section/features-strip";
import BestSellingRose from "@/features/bestSelling/components/best-selling-rose";
import MostPopular from "@/features/mostPopular/components/MostPopular";
import AboutSection from "@/features/home/components/about-section/about-section";
import Gallery from "@/features/gallery/components/Gallery";
import Testimonials from "@/features/testimonials/components/Testimonials";
import Companies from "@/features/companies/Companies";
import getMostPopularProducts from "@/features/mostPopular/lib/api-mostproduct";
import getAllOccasions from "@/features/mostPopular/lib/api-occasions";
import { Hero } from "@/features/home/components/hero-section/Hero";

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
      <Hero />
      <div>
        <FeaturesStrip />
        <BestSellingRose />
        <MostPopular
          occasions={occasions}
          initialProducts={initialProducts}
          initialOccasionId={initialOccasionId}
        />

        <AboutSection />
        <Gallery />
      </div>

      <Testimonials />

      <Companies />
    </div>
  );
}
